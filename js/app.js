/**
 * Veyro // Main Application Controller
 * Manages UI interactions, tab switching, workout execution HUD, modals,
 * custom routine builder, celebration confetti, and history analytics.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const App = {
    currentTab: 'dashboard-view',
    builderExercises: [],
    practiceExerciseId: null,

    // Initialize application
    init() {
      this.bindAudioActivation();
      this.bindNavigation();
      this.bindSettings();
      this.bindDashboard();
      this.bindPrograms();
      this.bindExerciseLibrary();
      this.bindRoutineBuilder();
      this.bindWorkoutArena();
      this.bindCelebration();
      this.bindAnalytics();

      // Initial Renders
      this.renderDashboardStats();
      this.renderFeaturedPrograms();
      this.renderAllPrograms();
      this.renderExerciseLibrary();
      this.renderBuilderPicker();
      this.renderWeeklyChart();
      this.renderHistoryTable();

      // Load Settings into Audio Coach
      this.syncSavedSettings();
    },

    // Audio Autoplay / Activation handling
    bindAudioActivation() {
      const banner = document.getElementById('audio-init-banner');
      const btnEnable = document.getElementById('btn-enable-audio');

      const unlockAudio = () => {
        window.AudioCoach.ensureAudioContext();
        if (banner) banner.classList.add('hidden');
      };

      if (btnEnable) btnEnable.addEventListener('click', unlockAudio);
      document.body.addEventListener('click', () => {
        window.AudioCoach.ensureAudioContext();
      }, { once: true });
    },

    // Navigation Tabs
    bindNavigation() {
      const navBtns = document.querySelectorAll('.nav-btn');
      const logo = document.getElementById('brand-logo');

      navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetTabId = btn.getAttribute('data-tab');
          this.switchTab(targetTabId);
        });
      });

      if (logo) {
        logo.addEventListener('click', () => {
          this.switchTab('dashboard-view');
        });
      }

      // Quick links from dashboard
      const btnSeeAll = document.getElementById('btn-see-all-programs');
      if (btnSeeAll) {
        btnSeeAll.addEventListener('click', () => this.switchTab('programs-view'));
      }

      const btnHeroBrowse = document.getElementById('btn-hero-browse');
      if (btnHeroBrowse) {
        btnHeroBrowse.addEventListener('click', () => this.switchTab('programs-view'));
      }

      const btnHeroQuick = document.getElementById('btn-hero-quickstart');
      if (btnHeroQuick) {
        btnHeroQuick.addEventListener('click', () => {
          // Launch default daily recommendation: HIIT Full Body Blast
          const defaultProg = WORKOUT_PROGRAMS[0];
          this.launchWorkout(defaultProg);
        });
      }
    },

    switchTab(tabId) {
      this.currentTab = tabId;

      // Update nav buttons
      document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Update views
      document.querySelectorAll('.view-panel').forEach(panel => {
        if (panel.id === tabId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });

      // Refresh view-specific content
      if (tabId === 'dashboard-view') {
        this.renderDashboardStats();
      } else if (tabId === 'programs-view') {
        this.renderAllPrograms();
      } else if (tabId === 'analytics-view') {
        this.renderWeeklyChart();
        this.renderHistoryTable();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // ----------------------------------------------------
    // DASHBOARD RENDERING
    // ----------------------------------------------------
    bindDashboard() {
      // Dynamic coach daily quotes
      const quotes = [
        `"Consistency turns effort into architecture. Ready to crush 15 minutes today?"`,
        `"Small hinges swing giant doors. Focus on precision over momentum."`,
        `"No gym needed when willpower is your foundation. Let's make today count!"`,
        `"Breath leads movement. Keep shoulders relaxed and power through your core."`,
        `"Progress happens in the final 5 seconds of every interval. Stay relentless!"`
      ];
      const quoteEl = document.getElementById('coach-daily-quote');
      if (quoteEl) {
        quoteEl.textContent = quotes[Math.floor(Math.random() * quotes.length)];
      }
    },

    renderDashboardStats() {
      const stats = window.StorageManager.getStats();
      const elStreak = document.getElementById('stat-streak-days');
      const elMinutes = document.getElementById('stat-total-minutes');
      const elCalories = document.getElementById('stat-total-calories');
      const elSessions = document.getElementById('stat-total-sessions');

      if (elStreak) elStreak.textContent = stats.streakDays;
      if (elMinutes) elMinutes.textContent = stats.totalMinutes;
      if (elCalories) elCalories.textContent = stats.totalCalories;
      if (elSessions) elSessions.textContent = stats.totalWorkouts;

      this.renderDashboardBadges();
    },

    renderDashboardBadges() {
      const unlockedIds = new Set(window.StorageManager.getUnlockedBadges());
      const container = document.getElementById('dashboard-badges-container');
      const countEl = document.getElementById('badge-count-text');
      if (!container) return;

      if (countEl) {
        countEl.textContent = `${unlockedIds.size} / ${ACHIEVEMENTS_LIST.length} Unlocked`;
      }

      // Display up to 4 badges preview
      const previewList = ACHIEVEMENTS_LIST.slice(0, 4);
      container.innerHTML = previewList.map(badge => {
        const isUnlocked = unlockedIds.has(badge.id);
        return `
          <div class="badge-item ${isUnlocked ? 'unlocked' : 'locked'}" title="${badge.desc}">
            <div class="badge-icon-wrap">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-req">${isUnlocked ? 'Unlocked âœ“' : badge.desc}</div>
          </div>
        `;
      }).join('');
    },

    renderFeaturedPrograms() {
      const container = document.getElementById('featured-programs-container');
      if (!container) return;

      const featured = WORKOUT_PROGRAMS.slice(0, 3);
      container.innerHTML = featured.map(prog => this.createProgramCardHtml(prog)).join('');
      this.attachProgramCardListeners(container);
    },

    createProgramCardHtml(prog) {
      const exerciseNames = prog.exercises
        .map(e => (getExerciseById(e.exerciseId) || {}).name || 'Exercise')
        .slice(0, 3)
        .join(', ') + (prog.exercises.length > 3 ? '...' : '');

      return `
        <div class="program-card" data-program-id="${prog.id}">
          <div class="program-card-hero">
            <span class="level-tag ${prog.level}">${prog.levelLabel}</span>
            <span class="duration-chip">â± ${prog.estMinutes} Min</span>
          </div>
          <div class="program-card-body">
            <h3 class="program-card-title">${prog.title}</h3>
            <p class="program-card-desc">${prog.tagline}</p>
            <div class="program-meta-row">
              <div class="meta-spec">
                <span class="meta-spec-lbl">Rounds</span>
                <span class="meta-spec-val">${prog.rounds} Rounds</span>
              </div>
              <div class="meta-spec">
                <span class="meta-spec-lbl">Burn</span>
                <span class="meta-spec-val">~${prog.estCalories} kcal</span>
              </div>
              <div class="meta-spec">
                <span class="meta-spec-lbl">Focus</span>
                <span class="meta-spec-val">${prog.category.toUpperCase()}</span>
              </div>
            </div>
            <div class="program-card-footer">
              <button class="btn btn-primary btn-card-launch" data-launch-id="${prog.id}">
                <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                <span>Start Workout</span>
              </button>
            </div>
          </div>
        </div>
      `;
    },

    attachProgramCardListeners(container) {
      container.querySelectorAll('.btn-card-launch').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const pId = btn.getAttribute('data-launch-id');
          const program = getProgramById(pId) || window.StorageManager.getCustomRoutines().find(r => r.id === pId);
          if (program) {
            this.launchWorkout(program);
          }
        });
      });
    },

    // ----------------------------------------------------
    // PROGRAMS VIEW & FILTERS
    // ----------------------------------------------------
    bindPrograms() {
      const filterBar = document.getElementById('program-filter-bar');
      if (filterBar) {
        filterBar.querySelectorAll('.pill').forEach(pill => {
          pill.addEventListener('click', () => {
            filterBar.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const filter = pill.getAttribute('data-filter');
            this.renderAllPrograms(filter);
          });
        });
      }
    },

    renderAllPrograms(filterCategory = 'all') {
      const container = document.getElementById('all-programs-container');
      if (!container) return;

      const customRoutines = window.StorageManager.getCustomRoutines();
      const allList = [...WORKOUT_PROGRAMS, ...customRoutines];

      const filtered = allList.filter(prog => {
        if (filterCategory === 'all') return true;
        if (filterCategory === 'custom') return Boolean(prog.isCustom);
        return prog.category === filterCategory;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="builder-empty-state" style="grid-column: 1 / -1;">
            <div class="empty-icon">âš¡</div>
            <h4>No routines found for this filter</h4>
            <p>Try selecting "All Routines" or create your own custom workout routine!</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(prog => this.createProgramCardHtml(prog)).join('');
      this.attachProgramCardListeners(container);
    },

    // ----------------------------------------------------
    // EXERCISE MOVEMENT LIBRARY
    // ----------------------------------------------------
    bindExerciseLibrary() {
      const searchInput = document.getElementById('exercise-search-input');
      const muscleFilterBar = document.getElementById('exercise-muscle-filter');

      const applyFilters = () => {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activePill = muscleFilterBar ? muscleFilterBar.querySelector('.pill.active') : null;
        const muscle = activePill ? activePill.getAttribute('data-muscle') : 'all';
        this.renderExerciseLibrary(query, muscle);
      };

      if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
      }

      if (muscleFilterBar) {
        muscleFilterBar.querySelectorAll('.pill').forEach(pill => {
          pill.addEventListener('click', () => {
            muscleFilterBar.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            applyFilters();
          });
        });
      }

      // Modal close
      const btnCloseModal = document.getElementById('btn-close-exercise-modal');
      const modal = document.getElementById('exercise-detail-modal');
      if (btnCloseModal && modal) {
        btnCloseModal.addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.classList.add('hidden');
        });
      }

      // Add to custom routine from modal
      const btnAddCustom = document.getElementById('btn-modal-add-to-custom');
      if (btnAddCustom) {
        btnAddCustom.addEventListener('click', () => {
          if (this.currentModalExercise) {
            this.addExerciseToBuilder(this.currentModalExercise.id);
            modal.classList.add('hidden');
            this.switchTab('builder-view');
          }
        });
      }

      // 30-sec practice button
      const btnTestPractice = document.getElementById('btn-modal-test-timer');
      if (btnTestPractice) {
        btnTestPractice.addEventListener('click', () => {
          if (this.currentModalExercise) {
            modal.classList.add('hidden');
            const miniRoutine = {
              id: 'practice_' + this.currentModalExercise.id,
              title: `${this.currentModalExercise.name} (Practice)`,
              category: 'mobility',
              rounds: 1,
              exercises: [{ exerciseId: this.currentModalExercise.id, workSec: 30, restSec: 0 }]
            };
            this.launchWorkout(miniRoutine);
          }
        });
      }
    },

    renderExerciseLibrary(searchQuery = '', muscleFilter = 'all') {
      const container = document.getElementById('exercise-hub-grid');
      if (!container) return;

      const filtered = EXERCISE_DATABASE.filter(ex => {
        const matchesSearch = !searchQuery || 
          ex.name.toLowerCase().includes(searchQuery) || 
          ex.category.toLowerCase().includes(searchQuery) ||
          ex.muscles.some(m => m.toLowerCase().includes(searchQuery));

        const matchesMuscle = muscleFilter === 'all' || 
          ex.category.toLowerCase() === muscleFilter.toLowerCase() ||
          ex.muscles.some(m => m.toLowerCase().includes(muscleFilter.toLowerCase()));

        return matchesSearch && matchesMuscle;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="builder-empty-state" style="grid-column: 1 / -1;">
            <div class="empty-icon">ðŸ”</div>
            <h4>No exercises match your query</h4>
            <p>Try searching for pushups, squats, planks, or select "All".</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(ex => `
        <div class="exercise-card" data-exercise-id="${ex.id}">
          <div class="exercise-card-visual">
            ${ex.svg}
          </div>
          <div class="exercise-card-body">
            <h4 class="exercise-card-title">${ex.name}</h4>
            <span class="exercise-muscle-tag">${ex.muscles.join(' â€¢ ')}</span>
            <div class="exercise-card-footer">
              <span class="exercise-difficulty-badge">${ex.difficulty}</span>
              <span class="text-accent" style="font-size: 0.8rem; font-weight: 700;">View Form &rarr;</span>
            </div>
          </div>
        </div>
      `).join('');

      // Open Modal on Card Click
      container.querySelectorAll('.exercise-card').forEach(card => {
        card.addEventListener('click', () => {
          const exId = card.getAttribute('data-exercise-id');
          const ex = getExerciseById(exId);
          if (ex) this.openExerciseModal(ex);
        });
      });
    },

    openExerciseModal(ex) {
      this.currentModalExercise = ex;
      const modal = document.getElementById('exercise-detail-modal');
      if (!modal) return;

      document.getElementById('modal-ex-category').textContent = `${ex.category} / ${ex.difficulty.toUpperCase()}`;
      document.getElementById('modal-ex-title').textContent = ex.name;
      document.getElementById('modal-ex-visual').innerHTML = ex.svg;
      document.getElementById('modal-ex-muscles').textContent = ex.muscles.join(', ');
      document.getElementById('modal-ex-difficulty').textContent = ex.difficulty;
      document.getElementById('modal-ex-met').textContent = `~${ex.calPerMin} kcal/min`;
      document.getElementById('modal-ex-instructions').textContent = ex.instructions;

      document.getElementById('modal-ex-dos').innerHTML = ex.dos.map(d => `<li>âœ“ ${d}</li>`).join('');
      document.getElementById('modal-ex-donts').innerHTML = ex.donts.map(d => `<li>âœ— ${d}</li>`).join('');
      document.getElementById('modal-ex-breathing').textContent = `ðŸŒ¬ ${ex.breathing}`;

      modal.classList.remove('hidden');
    },

    // ----------------------------------------------------
    // CUSTOM ROUTINE BUILDER
    // ----------------------------------------------------
    bindRoutineBuilder() {
      const btnClear = document.getElementById('btn-clear-builder');
      const btnSave = document.getElementById('btn-save-custom-routine');
      const btnStartNow = document.getElementById('btn-start-custom-routine-now');
      const searchPicker = document.getElementById('builder-picker-search');

      if (btnClear) {
        btnClear.addEventListener('click', () => {
          this.builderExercises = [];
          this.renderBuilderSequence();
        });
      }

      if (searchPicker) {
        searchPicker.addEventListener('input', () => {
          this.renderBuilderPicker(searchPicker.value.toLowerCase().trim());
        });
      }

      if (btnSave) {
        btnSave.addEventListener('click', () => {
          const routine = this.compileCustomRoutine();
          if (!routine) return;
          window.StorageManager.saveCustomRoutine(routine);
          alert(`Routine "${routine.title}" saved successfully!`);
          this.renderAllPrograms();
          this.switchTab('programs-view');
        });
      }

      if (btnStartNow) {
        btnStartNow.addEventListener('click', () => {
          const routine = this.compileCustomRoutine();
          if (!routine) return;
          window.StorageManager.saveCustomRoutine(routine);
          this.launchWorkout(routine);
        });
      }
    },

    renderBuilderPicker(searchQuery = '') {
      const container = document.getElementById('builder-picker-items');
      if (!container) return;

      const filtered = EXERCISE_DATABASE.filter(e => 
        !searchQuery || e.name.toLowerCase().includes(searchQuery) || e.category.toLowerCase().includes(searchQuery)
      );

      container.innerHTML = filtered.map(ex => `
        <div class="picker-item">
          <div class="picker-info">
            <h5>${ex.name}</h5>
            <span>${ex.category} â€¢ ${ex.difficulty}</span>
          </div>
          <button class="btn-add-picker" data-add-id="${ex.id}" title="Add to Workout">+</button>
        </div>
      `).join('');

      container.querySelectorAll('.btn-add-picker').forEach(btn => {
        btn.addEventListener('click', () => {
          const exId = btn.getAttribute('data-add-id');
          this.addExerciseToBuilder(exId);
        });
      });
    },

    addExerciseToBuilder(exerciseId) {
      const ex = getExerciseById(exerciseId);
      if (!ex) return;

      const defaultWork = parseInt(document.getElementById('builder-work-sec').value, 10) || 30;
      const defaultRest = parseInt(document.getElementById('builder-rest-sec').value, 10) || 15;

      this.builderExercises.push({
        uid: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        exerciseId: ex.id,
        exercise: ex,
        workSec: defaultWork,
        restSec: defaultRest
      });

      this.renderBuilderSequence();
    },

    renderBuilderSequence() {
      const container = document.getElementById('builder-sequence-list');
      const placeholder = document.getElementById('builder-empty-placeholder');
      const countEl = document.getElementById('builder-exercise-count');
      const estTimeEl = document.getElementById('builder-est-time');
      const estCalEl = document.getElementById('builder-est-cal');

      if (!container) return;

      const rounds = parseInt(document.getElementById('builder-rounds').value, 10) || 1;
      countEl.textContent = this.builderExercises.length;

      if (this.builderExercises.length === 0) {
        container.innerHTML = `
          <div class="builder-empty-state">
            <div class="empty-icon">âš¡</div>
            <h4>Your routine is empty</h4>
            <p>Click "+" on any exercise from the right panel to add it to your workout flow.</p>
          </div>
        `;
        estTimeEl.textContent = '0m 0s';
        estCalEl.textContent = '0 kcal';
        return;
      }

      // Calculate totals
      let totalSecondsSingleRound = 0;
      let totalCaloriesSingleRound = 0;

      this.builderExercises.forEach(item => {
        totalSecondsSingleRound += (item.workSec + item.restSec);
        totalCaloriesSingleRound += (item.workSec * (item.exercise.calPerMin / 60));
      });

      const totalSecondsAllRounds = totalSecondsSingleRound * rounds;
      const totalCaloriesAllRounds = Math.round(totalCaloriesSingleRound * rounds);

      const mins = Math.floor(totalSecondsAllRounds / 60);
      const secs = totalSecondsAllRounds % 60;
      estTimeEl.textContent = `${mins}m ${secs}s`;
      estCalEl.textContent = `${totalCaloriesAllRounds} kcal`;

      container.innerHTML = this.builderExercises.map((item, idx) => `
        <div class="sequence-item" data-uid="${item.uid}">
          <span class="sequence-drag-handle">#${idx + 1}</span>
          <div class="sequence-main-info">
            <div class="sequence-item-title">${item.exercise.name}</div>
            <div class="sequence-item-meta">${item.exercise.category} â€¢ Target: ${item.exercise.muscles.join(', ')}</div>
          </div>
          <div class="sequence-inputs">
            <div class="time-input-wrap">
              <span>Work</span>
              <input type="number" class="seq-work-input" data-uid="${item.uid}" value="${item.workSec}" min="5" max="180">
              <span>s</span>
            </div>
            <div class="time-input-wrap">
              <span>Rest</span>
              <input type="number" class="seq-rest-input" data-uid="${item.uid}" value="${item.restSec}" min="0" max="120">
              <span>s</span>
            </div>
            <button class="btn-remove-seq" data-remove-uid="${item.uid}" title="Remove move">&times;</button>
          </div>
        </div>
      `).join('');

      // Input changes
      container.querySelectorAll('.seq-work-input').forEach(inp => {
        inp.addEventListener('change', (e) => {
          const uid = inp.getAttribute('data-uid');
          const found = this.builderExercises.find(x => x.uid === uid);
          if (found) found.workSec = Math.max(5, parseInt(e.target.value, 10) || 30);
          this.renderBuilderSequence();
        });
      });

      container.querySelectorAll('.seq-rest-input').forEach(inp => {
        inp.addEventListener('change', (e) => {
          const uid = inp.getAttribute('data-uid');
          const found = this.builderExercises.find(x => x.uid === uid);
          if (found) found.restSec = Math.max(0, parseInt(e.target.value, 10) || 15);
          this.renderBuilderSequence();
        });
      });

      container.querySelectorAll('.btn-remove-seq').forEach(btn => {
        btn.addEventListener('click', () => {
          const uid = btn.getAttribute('data-remove-uid');
          this.builderExercises = this.builderExercises.filter(x => x.uid !== uid);
          this.renderBuilderSequence();
        });
      });
    },

    compileCustomRoutine() {
      const nameInput = document.getElementById('builder-routine-name');
      const catInput = document.getElementById('builder-routine-category');
      const roundsInput = document.getElementById('builder-rounds');

      const title = (nameInput && nameInput.value.trim()) || 'Custom Power Session';
      const category = (catInput && catInput.value) || 'hiit';
      const rounds = Math.max(1, parseInt(roundsInput.value, 10) || 1);

      if (this.builderExercises.length === 0) {
        alert('Please add at least one exercise to your routine before saving.');
        return null;
      }

      // Calculate time & cal
      let totalSeconds = 0;
      let totalCal = 0;
      this.builderExercises.forEach(e => {
        totalSeconds += (e.workSec + e.restSec);
        totalCal += (e.workSec * (e.exercise.calPerMin / 60));
      });
      totalSeconds *= rounds;
      totalCal = Math.round(totalCal * rounds);

      return {
        id: 'custom_' + Date.now(),
        title,
        category,
        isCustom: true,
        level: 'intermediate',
        levelLabel: 'Custom',
        rounds,
        estMinutes: Math.max(1, Math.round(totalSeconds / 60)),
        estCalories: totalCal,
        tagline: `Custom routine with ${this.builderExercises.length} movements across ${rounds} round(s).`,
        exercises: this.builderExercises.map(item => ({
          exerciseId: item.exerciseId,
          workSec: item.workSec,
          restSec: item.restSec
        }))
      };
    },

    // ----------------------------------------------------
    // LIVE WORKOUT ARENA (HUD)
    // ----------------------------------------------------
    bindWorkoutArena() {
      const arena = document.getElementById('workout-arena');
      const btnExit = document.getElementById('arena-btn-exit');
      const btnPlayPause = document.getElementById('arena-btn-playpause');
      const btnSkip = document.getElementById('arena-btn-skip');
      const btnPrev = document.getElementById('arena-btn-prev');
      const btnMute = document.getElementById('arena-btn-mute');

      if (btnExit) {
        btnExit.addEventListener('click', () => {
          if (confirm('Are you sure you want to stop this workout session?')) {
            window.WorkoutEngine.stop();
            arena.classList.add('hidden');
          }
        });
      }

      if (btnPlayPause) {
        btnPlayPause.addEventListener('click', () => {
          if (window.WorkoutEngine.state === ENGINE_STATE.PAUSED) {
            window.WorkoutEngine.resume();
          } else {
            window.WorkoutEngine.pause();
          }
        });
      }

      if (btnSkip) {
        btnSkip.addEventListener('click', () => {
          window.WorkoutEngine.skipToNext();
        });
      }

      if (btnPrev) {
        btnPrev.addEventListener('click', () => {
          window.WorkoutEngine.previousStep();
        });
      }

      if (btnMute) {
        btnMute.addEventListener('click', () => {
          window.AudioCoach.voiceEnabled = !window.AudioCoach.voiceEnabled;
          btnMute.classList.toggle('active', window.AudioCoach.voiceEnabled);
        });
      }

      // Hook up Workout Engine callbacks
      window.WorkoutEngine.onTick = (tickData) => this.handleEngineTick(tickData);
      window.WorkoutEngine.onStateChange = (state) => this.handleEngineStateChange(state);
      window.WorkoutEngine.onStepChange = (currentStep, nextStep) => this.handleEngineStepChange(currentStep, nextStep);
      window.WorkoutEngine.onComplete = (summary) => this.handleWorkoutComplete(summary);
    },

    launchWorkout(routine) {
      window.AudioCoach.ensureAudioContext();

      const arena = document.getElementById('workout-arena');
      if (!arena) return;

      document.getElementById('arena-routine-title').textContent = routine.title;
      arena.classList.remove('hidden');

      window.WorkoutEngine.start(routine);
    },

    handleEngineTick(data) {
      const digitsEl = document.getElementById('arena-timer-seconds');
      const ringCircle = document.getElementById('timer-ring-circle');
      const totalProgressFill = document.getElementById('arena-total-progress-fill');
      const elapsedLabel = document.getElementById('arena-total-time-elapsed');
      const liveCalEl = document.getElementById('arena-live-calories');
      const heartZoneEl = document.getElementById('arena-heart-zone');

      // Digits
      if (digitsEl) digitsEl.textContent = data.secondsRemaining;

      // SVG Ring stroke-dashoffset (Circumference = 2 * PI * 140 = 879.64)
      const circumference = 879.64;
      if (ringCircle) {
        const offset = circumference * (1 - data.ringFraction);
        ringCircle.style.strokeDashoffset = offset;
      }

      // Total Progress Fill
      if (totalProgressFill) {
        totalProgressFill.style.width = `${Math.min(100, data.overallProgress)}%`;
      }

      // Total Elapsed Time (MM:SS)
      if (elapsedLabel) {
        const mins = Math.floor(data.totalElapsed / 60);
        const secs = data.totalElapsed % 60;
        elapsedLabel.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }

      // Live Calories
      if (liveCalEl) {
        liveCalEl.textContent = `${data.calories} kcal`;
      }

      // Heart Zone simulation
      if (heartZoneEl) {
        if (data.state === ENGINE_STATE.EXERCISING) {
          heartZoneEl.textContent = 'Cardio Zone 3 (Aerobic)';
          heartZoneEl.style.color = 'var(--accent-lime)';
        } else if (data.state === ENGINE_STATE.RESTING) {
          heartZoneEl.textContent = 'Recovery Zone 1';
          heartZoneEl.style.color = 'var(--accent-cyan)';
        } else {
          heartZoneEl.textContent = 'Warmup Zone';
          heartZoneEl.style.color = 'var(--accent-amber)';
        }
      }
    },

    handleEngineStateChange(state) {
      const stateTag = document.getElementById('arena-state-tag');
      const statusSub = document.getElementById('arena-status-sub');
      const ringCircle = document.getElementById('timer-ring-circle');
      const playIcon = document.querySelector('.icon-play');
      const pauseIcon = document.querySelector('.icon-pause');

      if (ringCircle) {
        ringCircle.classList.remove('rest-phase', 'prep-phase');
      }

      if (state === ENGINE_STATE.PREPARING) {
        if (stateTag) stateTag.textContent = 'PREPARE';
        if (statusSub) statusSub.textContent = 'GET READY';
        if (ringCircle) ringCircle.classList.add('prep-phase');
      } else if (state === ENGINE_STATE.EXERCISING) {
        if (stateTag) stateTag.textContent = 'WORK';
        if (statusSub) statusSub.textContent = 'EXERCISE';
      } else if (state === ENGINE_STATE.RESTING) {
        if (stateTag) stateTag.textContent = 'REST';
        if (statusSub) statusSub.textContent = 'RECOVERY';
        if (ringCircle) ringCircle.classList.add('rest-phase');
      } else if (state === ENGINE_STATE.PAUSED) {
        if (stateTag) stateTag.textContent = 'PAUSED';
        if (statusSub) statusSub.textContent = 'SESSION FROZEN';
      }

      // Toggle Play/Pause Icon
      if (playIcon && pauseIcon) {
        if (state === ENGINE_STATE.PAUSED) {
          playIcon.classList.remove('hidden');
          pauseIcon.classList.add('hidden');
        } else {
          playIcon.classList.add('hidden');
          pauseIcon.classList.remove('hidden');
        }
      }
    },

    handleEngineStepChange(currentStep, nextStep) {
      const ex = currentStep.exercise;
      const exNameEl = document.getElementById('arena-current-exercise-name');
      const animHost = document.getElementById('arena-animation-host');
      const muscleTags = document.getElementById('arena-muscle-tags');
      const coachLiveTip = document.getElementById('arena-coach-live-tip');
      const roundIndicator = document.getElementById('arena-round-indicator');
      const stepLabel = document.getElementById('arena-exercise-step-label');

      // Next preview elements
      const nextNameEl = document.getElementById('arena-next-name');
      const nextDurationEl = document.getElementById('arena-next-duration');
      const checklistEl = document.getElementById('arena-form-checklist');

      if (exNameEl) exNameEl.textContent = ex.name;
      if (animHost) animHost.innerHTML = ex.svg;

      if (muscleTags) {
        muscleTags.innerHTML = (ex.muscles || []).map(m => `<span class="target-tag">${m}</span>`).join('');
      }

      if (coachLiveTip) {
        coachLiveTip.textContent = `"${ex.instructions}"`;
      }

      if (roundIndicator) {
        roundIndicator.textContent = `Round ${currentStep.round} of ${currentStep.totalRounds}`;
      }

      if (stepLabel) {
        stepLabel.textContent = `Exercise ${currentStep.stepIndex} of ${currentStep.totalStepsInRound}`;
      }

      // Next preview
      if (nextStep) {
        if (nextNameEl) nextNameEl.textContent = nextStep.exercise.name;
        if (nextDurationEl) nextDurationEl.textContent = `${nextStep.workSec} seconds work`;
      } else {
        if (nextNameEl) nextNameEl.textContent = 'Finish Line ðŸ';
        if (nextDurationEl) nextDurationEl.textContent = 'Cooldown & High Five';
      }

      // Form checklist
      if (checklistEl) {
        checklistEl.innerHTML = (ex.dos || ['Maintain steady form']).map(d => `<li><span>âœ“</span> ${d}</li>`).join('');
      }
    },

    // ----------------------------------------------------
    // CELEBRATION & COMPLETION
    // ----------------------------------------------------
    bindCelebration() {
      const btnFinish = document.getElementById('btn-finish-celebration');
      const modal = document.getElementById('celebration-modal');

      if (btnFinish && modal) {
        btnFinish.addEventListener('click', () => {
          modal.classList.add('hidden');
          document.getElementById('workout-arena').classList.add('hidden');
          this.switchTab('dashboard-view');
        });
      }
    },

    handleWorkoutComplete(summary) {
      // Log session into storage
      const result = window.StorageManager.logWorkoutSession(summary);

      // Hide Arena & Open Celebration Modal
      const arena = document.getElementById('workout-arena');
      const celebModal = document.getElementById('celebration-modal');
      if (arena) arena.classList.add('hidden');
      if (celebModal) celebModal.classList.remove('hidden');

      // Summary values
      const mins = Math.floor(summary.durationSec / 60);
      const secs = summary.durationSec % 60;
      document.getElementById('summary-duration').textContent = `${mins}:${String(secs).padStart(2, '0')}`;
      document.getElementById('summary-exercises').textContent = summary.exerciseCount;
      document.getElementById('summary-calories').textContent = summary.caloriesBurned;

      // Badges awarded
      const badgesContainer = document.getElementById('celebration-new-badges');
      if (badgesContainer) {
        if (result.newBadges && result.newBadges.length > 0) {
          badgesContainer.innerHTML = result.newBadges.map(b => `
            <div class="unlocked-award-card">
              <span class="unlocked-award-icon">${b.icon}</span>
              <div class="unlocked-award-text">
                <h5>New Badge Unlocked: ${b.name}!</h5>
                <p>${b.desc}</p>
              </div>
            </div>
          `).join('');
        } else {
          badgesContainer.innerHTML = '';
        }
      }

      // Launch Confetti animation
      this.launchConfetti();

      // Refresh Dashboard & History
      this.renderDashboardStats();
      this.renderWeeklyChart();
      this.renderHistoryTable();
    },

    launchConfetti() {
      const canvas = document.getElementById('confetti-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.parentElement.offsetWidth || 500;
      canvas.height = canvas.parentElement.offsetHeight || 400;

      const particles = [];
      const colors = ['#2563EB', '#60A5FA', '#8b5cf6', '#ff6b35', '#ffffff'];

      for (let i = 0; i < 90; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          r: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.7) * 14,
          tilt: Math.random() * 10,
          tiltAngle: 0,
          tiltAngleIncremental: (Math.random() * 0.08) + 0.05
        });
      }

      let animId;
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activeCount = 0;

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.28; // Gravity
          p.tiltAngle += p.tiltAngleIncremental;
          p.tilt = Math.sin(p.tiltAngle) * 8;

          if (p.y < canvas.height) {
            activeCount++;
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.rect(p.x + p.tilt, p.y, p.r, p.r * 1.5);
            ctx.fill();
          }
        });

        if (activeCount > 0) {
          animId = requestAnimationFrame(render);
        }
      };

      render();
    },

    // ----------------------------------------------------
    // ANALYTICS & HISTORY
    // ----------------------------------------------------
    bindAnalytics() {
      const btnExport = document.getElementById('btn-export-data');
      const btnClearHistory = document.getElementById('btn-clear-history');

      if (btnExport) {
        btnExport.addEventListener('click', () => {
          const exportData = {
            history: window.StorageManager.getHistory(),
            stats: window.StorageManager.getStats(),
            customRoutines: window.StorageManager.getCustomRoutines(),
            badges: window.StorageManager.getUnlockedBadges(),
            exportedAt: new Date().toISOString()
          };

          const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `veyro_fitness_backup_${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
        });
      }

      if (btnClearHistory) {
        btnClearHistory.addEventListener('click', () => {
          if (confirm('Are you sure you want to delete all recorded workout history? This cannot be undone.')) {
            window.StorageManager.clearHistory();
            this.renderDashboardStats();
            this.renderWeeklyChart();
            this.renderHistoryTable();
          }
        });
      }
    },

    renderWeeklyChart() {
      const container = document.getElementById('weekly-chart-bars');
      if (!container) return;

      const history = window.StorageManager.getHistory();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const now = new Date();
      const currentDayIdx = now.getDay();

      // Aggregate minutes for past 7 days
      const past7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dayStr = d.toISOString().slice(0, 10);
        const dayName = days[d.getDay()];

        const totalMinsOnDay = history
          .filter(h => new Date(h.timestamp).toISOString().slice(0, 10) === dayStr)
          .reduce((sum, h) => sum + h.durationMinutes, 0);

        past7Days.push({
          dayName,
          dateStr: dayStr,
          minutes: totalMinsOnDay,
          isToday: i === 0
        });
      }

      const maxMins = Math.max(30, ...past7Days.map(d => d.minutes));

      container.innerHTML = past7Days.map(d => {
        const heightPercent = Math.min(100, Math.round((d.minutes / maxMins) * 100));
        return `
          <div class="day-bar-column">
            <span style="font-size: 0.7rem; color: var(--text-muted);">${d.minutes > 0 ? d.minutes + 'm' : ''}</span>
            <div class="bar-track">
              <div class="bar-fill ${d.minutes > 0 ? 'active-day' : ''}" style="height: ${Math.max(4, heightPercent)}%;"></div>
            </div>
            <span class="day-label ${d.isToday ? 'today' : ''}">${d.dayName}</span>
          </div>
        `;
      }).join('');
    },

    renderHistoryTable() {
      const tbody = document.getElementById('history-table-body');
      const emptyMsg = document.getElementById('history-empty');
      const table = document.getElementById('history-table');
      if (!tbody) return;

      const history = window.StorageManager.getHistory();

      if (history.length === 0) {
        tbody.innerHTML = '';
        if (emptyMsg) emptyMsg.classList.remove('hidden');
        if (table) table.classList.add('hidden');
        return;
      }

      if (emptyMsg) emptyMsg.classList.add('hidden');
      if (table) table.classList.remove('hidden');

      tbody.innerHTML = history.map(item => `
        <tr>
          <td>${item.dateString}</td>
          <td><strong style="color: #fff;">${item.routineTitle}</strong></td>
          <td>${item.durationMinutes} min</td>
          <td>${item.exerciseCount} sets</td>
          <td>${item.caloriesBurned} kcal</td>
          <td><span class="chip-accent" style="padding: 2px 8px; font-size: 0.7rem;">Completed</span></td>
        </tr>
      `).join('');
    },

    // ----------------------------------------------------
    // SETTINGS & COACH PREFERENCES
    // ----------------------------------------------------
    bindSettings() {
      const btnOpen = document.getElementById('btn-open-settings');
      const btnClose = document.getElementById('btn-close-settings-modal');
      const modal = document.getElementById('settings-modal');
      const btnSave = document.getElementById('btn-save-settings');

      const toggleVoiceHeader = document.getElementById('toggle-voice-instructor');
      const toggleSoundHeader = document.getElementById('toggle-sound-fx');

      if (btnOpen && modal) {
        btnOpen.addEventListener('click', () => {
          this.populateSettingsModal();
          modal.classList.remove('hidden');
        });
      }

      if (btnClose && modal) {
        btnClose.addEventListener('click', () => modal.classList.add('hidden'));
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.classList.add('hidden');
        });
      }

      if (btnSave && modal) {
        btnSave.addEventListener('click', () => {
          this.saveSettingsFromModal();
          modal.classList.add('hidden');
        });
      }

      // Speech rate live slider label
      const slider = document.getElementById('settings-speech-rate');
      const label = document.getElementById('speech-rate-val');
      if (slider && label) {
        slider.addEventListener('input', () => {
          label.textContent = `${slider.value}x`;
        });
      }

      // Header Quick Toggles
      if (toggleVoiceHeader) {
        toggleVoiceHeader.addEventListener('click', () => {
          window.AudioCoach.voiceEnabled = !window.AudioCoach.voiceEnabled;
          toggleVoiceHeader.classList.toggle('active', window.AudioCoach.voiceEnabled);
          toggleVoiceHeader.querySelector('.icon-voice-on').classList.toggle('hidden', !window.AudioCoach.voiceEnabled);
          toggleVoiceHeader.querySelector('.icon-voice-off').classList.toggle('hidden', window.AudioCoach.voiceEnabled);

          const s = window.StorageManager.getSettings();
          s.voiceEnabled = window.AudioCoach.voiceEnabled;
          window.StorageManager.saveSettings(s);
        });
      }

      if (toggleSoundHeader) {
        toggleSoundHeader.addEventListener('click', () => {
          window.AudioCoach.soundFxEnabled = !window.AudioCoach.soundFxEnabled;
          toggleSoundHeader.classList.toggle('active', window.AudioCoach.soundFxEnabled);

          const s = window.StorageManager.getSettings();
          s.soundFxEnabled = window.AudioCoach.soundFxEnabled;
          window.StorageManager.saveSettings(s);
        });
      }
    },

    syncSavedSettings() {
      const s = window.StorageManager.getSettings();
      window.AudioCoach.voiceEnabled = s.voiceEnabled;
      window.AudioCoach.soundFxEnabled = s.soundFxEnabled;
      window.AudioCoach.metronomeEnabled = s.metronomeEnabled;
      window.AudioCoach.speechRate = s.speechRate || 1.05;

      const toggleVoiceHeader = document.getElementById('toggle-voice-instructor');
      const toggleSoundHeader = document.getElementById('toggle-sound-fx');

      if (toggleVoiceHeader) {
        toggleVoiceHeader.classList.toggle('active', s.voiceEnabled);
        toggleVoiceHeader.querySelector('.icon-voice-on').classList.toggle('hidden', !s.voiceEnabled);
        toggleVoiceHeader.querySelector('.icon-voice-off').classList.toggle('hidden', s.voiceEnabled);
      }
      if (toggleSoundHeader) {
        toggleSoundHeader.classList.toggle('active', s.soundFxEnabled);
      }
    },

    populateSettingsModal() {
      const s = window.StorageManager.getSettings();
      const voiceSelect = document.getElementById('settings-voice-select');
      const rateInput = document.getElementById('settings-speech-rate');
      const beepsInput = document.getElementById('settings-countdown-beeps');
      const cuesInput = document.getElementById('settings-motivation-cues');
      const prepInput = document.getElementById('settings-default-prep');
      const metroInput = document.getElementById('settings-metronome');

      if (rateInput) rateInput.value = s.speechRate || 1.0;
      const rateLabel = document.getElementById('speech-rate-val');
      if (rateLabel) rateLabel.textContent = `${s.speechRate || 1.0}x`;

      if (beepsInput) beepsInput.checked = s.soundFxEnabled;
      if (cuesInput) cuesInput.checked = s.motivationCues !== false;
      if (prepInput) prepInput.value = s.defaultPrepSec || 8;
      if (metroInput) metroInput.checked = Boolean(s.metronomeEnabled);

      // Populate voice choices from window.AudioCoach
      if (voiceSelect && window.AudioCoach.voices) {
        voiceSelect.innerHTML = window.AudioCoach.voices.map(v => `
          <option value="${v.name}" ${v.name === s.voiceName ? 'selected' : ''}>${v.name} (${v.lang})</option>
        `).join('');
      }
    },

    saveSettingsFromModal() {
      const voiceSelect = document.getElementById('settings-voice-select');
      const rateInput = document.getElementById('settings-speech-rate');
      const beepsInput = document.getElementById('settings-countdown-beeps');
      const cuesInput = document.getElementById('settings-motivation-cues');
      const prepInput = document.getElementById('settings-default-prep');
      const metroInput = document.getElementById('settings-metronome');

      const newSettings = {
        voiceEnabled: window.AudioCoach.voiceEnabled,
        soundFxEnabled: beepsInput ? beepsInput.checked : true,
        speechRate: rateInput ? parseFloat(rateInput.value) : 1.0,
        voiceName: voiceSelect ? voiceSelect.value : '',
        motivationCues: cuesInput ? cuesInput.checked : true,
        defaultPrepSec: prepInput ? parseInt(prepInput.value, 10) : 8,
        metronomeEnabled: metroInput ? metroInput.checked : false
      };

      window.StorageManager.saveSettings(newSettings);

      // Update AudioCoach
      window.AudioCoach.soundFxEnabled = newSettings.soundFxEnabled;
      window.AudioCoach.speechRate = newSettings.speechRate;
      window.AudioCoach.metronomeEnabled = newSettings.metronomeEnabled;

      if (newSettings.voiceName && window.AudioCoach.voices) {
        const found = window.AudioCoach.voices.find(v => v.name === newSettings.voiceName);
        if (found) window.AudioCoach.selectedVoice = found;
      }
    }
  };

  // Launch application
  window.App = App;
  App.init();
});
