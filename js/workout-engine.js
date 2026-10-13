/**
 * Veyro // Workout Engine State Machine
 * Handles live interval execution, timers, cues, transitions, and audio sync.
 */

const ENGINE_STATE = {
  IDLE: 'IDLE',
  PREPARING: 'PREPARING',
  EXERCISING: 'EXERCISING',
  RESTING: 'RESTING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED'
};

class WorkoutEngine {
  constructor() {
    this.state = ENGINE_STATE.IDLE;
    this.previousState = ENGINE_STATE.IDLE;

    // Routine state
    this.activeRoutine = null;
    this.flattenedSteps = []; // Sequential list of { exercise, workSec, restSec, round, totalRounds }
    this.currentStepIndex = 0;
    this.currentRound = 1;
    this.totalRounds = 1;

    // Timer variables
    this.currentSeconds = 0;
    this.initialIntervalSeconds = 0;
    this.totalElapsedSeconds = 0;
    this.totalActiveSeconds = 0;
    this.timerInterval = null;

    // Live Metrics
    this.totalEstimatedCalories = 0;

    // Callbacks for UI updates
    this.onTick = null;
    this.onStateChange = null;
    this.onStepChange = null;
    this.onComplete = null;
  }

  // Load and launch a routine
  start(routine) {
    this.stop(); // Clear any existing running loops

    this.activeRoutine = routine;
    this.totalRounds = routine.rounds || 1;
    this.currentRound = 1;
    this.currentStepIndex = 0;
    this.totalElapsedSeconds = 0;
    this.totalActiveSeconds = 0;
    this.totalEstimatedCalories = 0;

    // Build flat sequence across rounds
    this.flattenedSteps = [];
    for (let r = 1; r <= this.totalRounds; r++) {
      routine.exercises.forEach((exItem, idx) => {
        const fullExercise = getExerciseById(exItem.exerciseId) || {
          id: exItem.exerciseId,
          name: 'Exercise ' + (idx + 1),
          category: 'Fitness',
          muscles: ['Full Body'],
          calPerMin: 8,
          instructions: 'Perform with focused form.',
          dos: ['Keep steady form'],
          donts: ['Avoid rushing'],
          breathing: 'Steady natural breath',
          svg: ''
        };

        this.flattenedSteps.push({
          exercise: fullExercise,
          workSec: exItem.workSec || 30,
          restSec: exItem.restSec || 15,
          round: r,
          totalRounds: this.totalRounds,
          stepIndex: idx + 1,
          totalStepsInRound: routine.exercises.length
        });
      });
    }

    if (this.flattenedSteps.length === 0) {
      console.error('Routine has no exercises');
      return;
    }

    // Read prep time from settings
    const settings = window.StorageManager.getSettings();
    const prepSeconds = settings.defaultPrepSec || 8;

    this.startPrepPhase(prepSeconds);
  }

  // PREPARATION PHASE
  startPrepPhase(durationSec) {
    this.setState(ENGINE_STATE.PREPARING);
    this.currentSeconds = durationSec;
    this.initialIntervalSeconds = durationSec;

    const currentStep = this.flattenedSteps[this.currentStepIndex];
    if (this.onStepChange) {
      this.onStepChange(currentStep, this.getNextStep());
    }

    // Audio Cue
    window.AudioCoach.speak(`Get ready for ${currentStep.exercise.name}.`, true);

    this.startIntervalTimer();
  }

  // WORK / EXERCISING PHASE
  startWorkPhase() {
    this.setState(ENGINE_STATE.EXERCISING);
    const currentStep = this.flattenedSteps[this.currentStepIndex];
    this.currentSeconds = currentStep.workSec;
    this.initialIntervalSeconds = currentStep.workSec;

    // High energy start sound & voice
    window.AudioCoach.playWorkStart();
    window.AudioCoach.speak(`Go! Start ${currentStep.exercise.name}!`, false);

    this.startIntervalTimer();
  }

  // REST PHASE
  startRestPhase() {
    this.setState(ENGINE_STATE.RESTING);
    const currentStep = this.flattenedSteps[this.currentStepIndex];
    this.currentSeconds = currentStep.restSec;
    this.initialIntervalSeconds = currentStep.restSec;

    // Next exercise preview cue
    const nextStep = this.getNextStep();
    window.AudioCoach.playRestChime();

    if (nextStep) {
      window.AudioCoach.speak(`Rest. Up next: ${nextStep.exercise.name}.`, false);
    } else {
      window.AudioCoach.speak(`Rest. Almost there, final stretch!`, false);
    }

    this.startIntervalTimer();
  }

  // TIMER LOOP
  startIntervalTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);

    // Initial tick to refresh UI immediately
    if (this.onTick) this.onTick(this.getTickData());
  }

  tick() {
    this.totalElapsedSeconds++;

    if (this.state === ENGINE_STATE.EXERCISING) {
      this.totalActiveSeconds++;
      // Calculate calorie increment per second based on exercise MET
      const currentStep = this.flattenedSteps[this.currentStepIndex];
      const calPerSec = (currentStep.exercise.calPerMin || 8.0) / 60;
      this.totalEstimatedCalories += calPerSec;

      // Metronome cadence if enabled
      window.AudioCoach.playMetronomeTick();

      // Halfway motivational cue
      const halfwayTime = Math.floor(this.initialIntervalSeconds / 2);
      if (this.currentSeconds === halfwayTime) {
        const customCue = currentStep.exercise.voiceCues && currentStep.exercise.voiceCues.halfway;
        window.AudioCoach.speak(customCue || 'Halfway there! Keep your form solid!', false);
      }

      // Last 10s cue
      if (this.currentSeconds === 10 && this.initialIntervalSeconds > 15) {
        const custom10 = currentStep.exercise.voiceCues && currentStep.exercise.voiceCues.last10;
        window.AudioCoach.speak(custom10 || 'Final ten seconds! Push through!', false);
      }
    }

    // 3, 2, 1 Countdown Beeps
    if (this.currentSeconds <= 3 && this.currentSeconds > 0) {
      window.AudioCoach.playCountdownBeep(false);
    }

    this.currentSeconds--;

    // Broadcast tick to UI
    if (this.onTick) {
      this.onTick(this.getTickData());
    }

    // Interval expired
    if (this.currentSeconds < 0) {
      this.handleIntervalFinished();
    }
  }

  handleIntervalFinished() {
    if (this.state === ENGINE_STATE.PREPARING) {
      this.startWorkPhase();
    } else if (this.state === ENGINE_STATE.EXERCISING) {
      const currentStep = this.flattenedSteps[this.currentStepIndex];
      // If there is rest time and not the very last step
      if (currentStep.restSec > 0 && this.currentStepIndex < this.flattenedSteps.length - 1) {
        this.startRestPhase();
      } else {
        this.advanceToNextStep();
      }
    } else if (this.state === ENGINE_STATE.RESTING) {
      this.advanceToNextStep();
    }
  }

  advanceToNextStep() {
    this.currentStepIndex++;

    if (this.currentStepIndex >= this.flattenedSteps.length) {
      this.completeWorkout();
    } else {
      const nextStep = this.flattenedSteps[this.currentStepIndex];
      if (this.onStepChange) {
        this.onStepChange(nextStep, this.getNextStep());
      }
      this.startWorkPhase();
    }
  }

  skipToNext() {
    if (this.state === ENGINE_STATE.IDLE || this.state === ENGINE_STATE.COMPLETED) return;
    this.advanceToNextStep();
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      const prevStep = this.flattenedSteps[this.currentStepIndex];
      if (this.onStepChange) {
        this.onStepChange(prevStep, this.getNextStep());
      }
      this.startWorkPhase();
    }
  }

  pause() {
    if (this.state === ENGINE_STATE.PAUSED || this.state === ENGINE_STATE.IDLE) return;
    this.previousState = this.state;
    this.setState(ENGINE_STATE.PAUSED);
    if (this.timerInterval) clearInterval(this.timerInterval);
    window.AudioCoach.stopSpeaking();
  }

  resume() {
    if (this.state !== ENGINE_STATE.PAUSED) return;
    this.setState(this.previousState);
    this.startIntervalTimer();
    window.AudioCoach.speak('Resuming. Stay focused.', false);
  }

  stop() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.setState(ENGINE_STATE.IDLE);
    window.AudioCoach.stopSpeaking();
  }

  completeWorkout() {
    this.stop();
    this.setState(ENGINE_STATE.COMPLETED);

    window.AudioCoach.playVictoryFanfare();
    window.AudioCoach.speak('Outstanding effort! Workout complete! You gave it your all today.', true);

    const summaryData = {
      routineId: this.activeRoutine ? this.activeRoutine.id : 'custom',
      routineTitle: this.activeRoutine ? this.activeRoutine.title : 'Custom Session',
      category: this.activeRoutine ? this.activeRoutine.category : 'workout',
      isCustom: Boolean(this.activeRoutine && this.activeRoutine.isCustom),
      durationSec: this.totalElapsedSeconds,
      activeSec: this.totalActiveSeconds,
      exerciseCount: this.flattenedSteps.length,
      caloriesBurned: Math.round(this.totalEstimatedCalories)
    };

    if (this.onComplete) {
      this.onComplete(summaryData);
    }
  }

  setState(newState) {
    this.state = newState;
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }

  getNextStep() {
    if (this.currentStepIndex + 1 < this.flattenedSteps.length) {
      return this.flattenedSteps[this.currentStepIndex + 1];
    }
    return null;
  }

  getTickData() {
    const totalSteps = this.flattenedSteps.length;
    const currentStep = this.flattenedSteps[this.currentStepIndex];
    const progressPercent = totalSteps > 0 ? (this.currentStepIndex / totalSteps) * 100 : 0;
    
    // Interval ring fraction (0 to 1)
    const ringFraction = this.initialIntervalSeconds > 0 
      ? Math.max(0, this.currentSeconds) / this.initialIntervalSeconds 
      : 0;

    return {
      state: this.state,
      secondsRemaining: Math.max(0, this.currentSeconds),
      totalSecondsInPhase: this.initialIntervalSeconds,
      ringFraction,
      totalElapsed: this.totalElapsedSeconds,
      currentStepIndex: this.currentStepIndex + 1,
      totalSteps,
      overallProgress: progressPercent,
      currentRound: currentStep ? currentStep.round : 1,
      totalRounds: this.totalRounds,
      calories: Math.round(this.totalEstimatedCalories)
    };
  }
}

window.WorkoutEngine = new WorkoutEngine();
