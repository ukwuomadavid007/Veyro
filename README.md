# Veyro // Virtual Home Workout Instructor & AI Coach

A zero-backend home workout instructor built with **HTML5, Vanilla CSS, and Vanilla JavaScript**. All data is persistent via **LocalStorage**, featuring a real-time audio voice coach, synthesized interval sound cues, custom workout builder, interactive movement hub with animated SVG diagrams, and comprehensive analytics.

---

## ⚡ Key Features

1. **AI Voice & Sound FX Coach (`js/audio.js`)**:
   - **Real-Time Voice Coaching**: Powered by the browser's Web Speech API (`SpeechSynthesis`). Speaks out instructions, countdowns ("3, 2, 1, Go!"), halfway motivation tips, and rest alerts.
   - **Synthesized Audio Cues**: Built using the Web Audio API (`AudioContext`). Generates crisp countdown beeps, interval chimes, cadence metronome ticks, and victory fanfares without external audio dependencies.
   - **Voice Persona & Speed Tuning**: Configurable voice selection, speech rate slider (0.8x - 1.3x), and audio toggles in Settings.

2. **Live Workout Arena HUD (`js/workout-engine.js`)**:
   - Immersive fullscreen workout state machine: **Prepare &rarr; Exercise &rarr; Rest &rarr; Cooldown &rarr; Complete**.
   - Dynamic SVG circular countdown ring with `stroke-dashoffset` animation.
   - Animated vector exercise visualizer showing movement dynamics.
   - "Up Next" preview and coach form checklist.
   - Interactive controls: Pause, Resume, Skip, Previous, and Exit.
   - Live metrics: Heart rate aerobic zone simulation and real-time calorie burn rate.

3. **Exercise Movement Library (`js/exercises.js`)**:
   - High-definition animated SVG vector illustrations for exercises (Jumping Jacks, Pushups, Air Squats, High Plank, Burpees, Mountain Climbers, Lunges, Bicycle Crunches, Glute Bridges, Tricep Dips, High Knees, Superman Hold).
   - Filter by muscle target (Chest, Legs, Core, Back, Arms, Cardio) and instant keyword search.
   - Interactive exercise detail modal with step-by-step form instructions, Dos & Don'ts checklist, breathing rhythm, and a quick "30-Sec Practice" mini-timer.

4. **Curated Workout Programs & Custom Studio**:
   - **6 Pre-Built Routines**:
     - *HIIT Full Body Blast* (Intermediate, 12 min)
     - *Core Matrix & Abs Shred* (All Levels, 10 min)
     - *Upper Body Calisthenics* (Advanced, 14 min)
     - *Lower Body & Glutes Power* (Intermediate, 12 min)
     - *Morning Awakening & Flow* (Beginner, 8 min)
     - *Tabata Torch* (High Intensity, 5 min)
   - **Custom Routine Studio**:
     - Pick movements from the exercise library.
     - Customize work time (sec), rest time (sec), and total rounds.
     - Live auto-calculation of total duration and estimated calorie burn.
     - Save to LocalStorage or start the custom workout immediately.

5. **Progress Analytics & Achievement Badges (`js/storage.js`)**:
   - **Automatic Streak Calculation**: Evaluates day-to-day frequency and tracks consecutive workout streaks.
   - **7-Day Velocity Chart**: Interactive bar visualization of active workout minutes.
   - **Session History Table**: Date, duration, exercise count, estimated calories burned, and completion status.
   - **8 Unlockable Achievement Badges**:
     - ⚡ *First Workout* (First completed session)
     - 🔥 *Consistency Cadet* (3-day streak)
     - 🛡️ *Week Warrior* (7-day streak)
     - 🚀 *HIIT Engine* (3 HIIT sessions)
     - 🌋 *500 kCal Burned* (Milestone calorie goal)
     - 🛠️ *Routine Architect* (Created and finished a custom routine)
     - ⏱️ *Century Club* (100 total workout minutes)
     - 👑 *Iron Will* (10 total sessions)
   - **Export History**: Download full logs and progress as a JSON backup.

---

## 🚀 Running the App Locally

The application runs directly in any modern browser without external dependencies or build steps:

1. **Directly in Browser**: Open `index.html` in Chrome, Edge, Firefox, or Safari.
2. **With the Local Server**:
   ```bash
   node server.js
   ```
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🎨 Technology Constraints Met

- **No Tailwind CSS**: Styled entirely using modern Vanilla CSS with dark glassmorphism, athletic neon electric palettes, and responsive layouts.
- **No Backend**: Runs 100% client-side.
- **LocalStorage Persistence**: Stores user statistics, settings, custom routines, history, and unlocked badges seamlessly across visits.
