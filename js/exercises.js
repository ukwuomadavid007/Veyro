/**
 * Veyro // Exercise & Program Database
 * High-definition movement definitions, muscle targeting, cues, and vectorized illustrations.
 */

const EXERCISE_DATABASE = [
  {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    category: 'Cardio',
    muscles: ['Full Body', 'Calves', 'Shoulders'],
    difficulty: 'Beginner',
    calPerMin: 10.5,
    instructions: 'Start standing tall with feet together and arms at your sides. In one explosive motion, jump your feet outward while clapping your hands overhead. Return lightly onto the balls of your feet.',
    dos: [
      'Land softly on the balls of your feet to protect your joints',
      'Maintain a subtle bend in knees throughout the jump',
      'Synchronize your breathing: inhale down, exhale up'
    ],
    donts: [
      'Stomping flat-footed or locking knees upon impact',
      'Letting shoulders shrug up into the neck'
    ],
    breathing: 'Rhythmic breath: Inhale as feet land together, exhale when jumping wide overhead.',
    voiceCues: {
      halfway: 'Halfway through! Keep that cadence bouncy and light!',
      last10: 'Last ten seconds! Pump up the pace for maximum cardio burn!'
    },
    svg: `
      <svg viewBox="0 0 200 200" class="svg-jack">
        <circle cx="100" cy="40" r="14" fill="#00f59b" />
        <line x1="100" y1="54" x2="100" y2="120" stroke="#00f59b" stroke-width="8" stroke-linecap="round" />
        <!-- Arms -->
        <line class="arm-l" x1="100" y1="70" x2="60" y2="35" stroke="#06b6d4" stroke-width="7" stroke-linecap="round" />
        <line class="arm-r" x1="100" y1="70" x2="140" y2="35" stroke="#06b6d4" stroke-width="7" stroke-linecap="round" />
        <!-- Legs -->
        <line class="leg-l" x1="100" y1="120" x2="65" y2="175" stroke="#8b5cf6" stroke-width="7" stroke-linecap="round" />
        <line class="leg-r" x1="100" y1="120" x2="135" y2="175" stroke="#8b5cf6" stroke-width="7" stroke-linecap="round" />
      </svg>
    `
  },
  {
    id: 'pushups',
    name: 'Standard Pushups',
    category: 'Chest',
    muscles: ['Pectorals', 'Triceps', 'Anterior Deltoids', 'Core'],
    difficulty: 'Intermediate',
    calPerMin: 9.0,
    instructions: 'Assume a high plank with palms directly below shoulders. Lower your body under control until your chest touches an inch above the floor, keeping elbows at a 45-degree angle. Press through palms to return.',
    dos: [
      'Lock your glutes and pull navel to spine to create a rigid plank',
      'Maintain neutral neck by looking at the floor 6 inches ahead',
      'Drive aggressively through whole hands, including fingertips'
    ],
    donts: [
      'Sagging hips or piking your rear in the air',
      'Flaring elbows outward at 90-degree right angles to neck'
    ],
    breathing: 'Inhale smoothly on descent. Exhale sharply as you push the ground away.',
    voiceCues: {
      halfway: 'Halfway! Keep the hollow body shape, no sagging hips!',
      last10: 'Ten seconds left! Every clean repetition builds upper body armor!'
    },
    svg: `
      <svg viewBox="0 0 200 200" class="svg-pushup">
        <g class="torso-group">
          <!-- Head -->
          <circle cx="50" cy="95" r="12" fill="#00f59b" />
          <!-- Torso Line -->
          <line x1="58" y1="102" x2="155" y2="128" stroke="#00f59b" stroke-width="8" stroke-linecap="round" />
          <!-- Arm -->
          <polyline points="72,106 78,142 84,155" fill="none" stroke="#06b6d4" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
          <!-- Foot/Pivot -->
          <circle cx="156" cy="130" r="5" fill="#8b5cf6" />
        </g>
        <!-- Ground Line -->
        <line x1="30" y1="158" x2="170" y2="158" stroke="rgba(255,255,255,0.2)" stroke-width="3" stroke-dasharray="6 4" />
      </svg>
    `
  },
  {
    id: 'bodyweight_squats',
    name: 'Air Squats',
    category: 'Legs',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    difficulty: 'Beginner',
    calPerMin: 8.5,
    instructions: 'Set feet shoulder-width apart, toes turned slightly outward. Send hips down and back as if sitting into an invisible chair. Sink until thighs break parallel to the deck, then push through heels to stand.',
    dos: [
      'Keep knees tracking inline with your 2nd and 3rd toes',
      'Proud upright chest with shoulders relaxed down',
      'Drive weight evenly through tripod foot: heel, big toe, pinky'
    ],
    donts: [
      'Allowing knees to cave inwards (valgus collapse)',
      'Lifting heels off the ground during bottom transition'
    ],
    breathing: 'Inhale down into the pocket. Exhale as you fire hips forward at the top.',
    voiceCues: {
      halfway: 'Halfway! Deep depth on each rep, break parallel!',
      last10: 'Final 10 seconds! Stay upright and finish powerful!'
    },
    svg: `
      <svg viewBox="0 0 200 200" class="svg-squat">
        <g class="squat-torso">
          <circle cx="95" cy="55" r="13" fill="#00f59b" />
          <line x1="95" y1="68" x2="88" y2="115" stroke="#00f59b" stroke-width="8" stroke-linecap="round" />
          <!-- Thigh & Shin -->
          <polyline points="88,115 125,120 120,165" fill="none" stroke="#8b5cf6" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
          <!-- Arms out for balance -->
          <line x1="94" y1="80" x2="135" y2="78" stroke="#06b6d4" stroke-width="6" stroke-linecap="round" />
        </g>
        <line x1="60" y1="168" x2="140" y2="168" stroke="rgba(255,255,255,0.2)" stroke-width="3" />
      </svg>
    `
  },
  {
    id: 'high_plank',
    name: 'High Plank Hold',
    category: 'Core',
    muscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Shoulders', 'Glutes'],
    difficulty: 'Beginner',
    calPerMin: 7.0,
    instructions: 'Plant hands directly below shoulders, fingers spread wide for a sturdy base. Extend legs straight back with feet hip-width. Create an unbreakable straight line from ears to heels.',
    dos: [
      'Push the ground away to actively fill out the space between scapulae',
      'Contract quads and glutes as hard as possible',
      'Breathe steadily into the lower ribcage without dropping tension'
    ],
    donts: [
      'Dropping lower back into hyperextension',
      'Piking buttocks upward to avoid abdominal work'
    ],
    breathing: 'Consistent rhythmic belly breaths. Do NOT hold your breath.',
    voiceCues: {
      halfway: 'Halfway point! Squeeze glutes and press through palms!',
      last10: 'Hold rock solid! Do not let those hips drop!'
    },
    svg: `
      <svg viewBox="0 0 200 200" class="svg-plank">
        <g class="plank-torso">
          <circle cx="50" cy="98" r="12" fill="#00f59b" />
          <line x1="58" y1="104" x2="155" y2="124" stroke="#00f59b" stroke-width="8" stroke-linecap="round" />
          <line x1="72" y1="108" x2="72" y2="155" stroke="#06b6d4" stroke-width="7" stroke-linecap="round" />
          <circle cx="156" cy="125" r="5" fill="#8b5cf6" />
        </g>
        <line x1="30" y1="158" x2="170" y2="158" stroke="rgba(255,255,255,0.2)" stroke-width="3" stroke-dasharray="6 4" />
      </svg>
    `
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    category: 'Cardio',
    muscles: ['Core', 'Hip Flexors', 'Shoulders', 'Cardio Engine'],
    difficulty: 'Intermediate',
    calPerMin: 12.0,
    instructions: 'From a rigid high plank position, rapidly drive one knee toward your chest without letting your hips pike up. Alternate legs in a dynamic, piston-like running rhythm.',
    dos: [
      'Maintain shoulders over wrists throughout the movement',
      'Run knees straight forward rather than flaring out',
      'Stay quick and light on toes'
    ],
    donts: [
      'Bouncing hips wildly up into the air',
      'Letting shoulders retreat behind the wrist line'
    ],
    breathing: 'Fast synchronized breath: Inhale two steps, exhale two steps.',
    voiceCues: {
      halfway: 'Halfway! Keep driving those knees, pace like a sprint!',
      last10: 'Turbo time! Last ten seconds, empty the tank!'
    },
    svg: `
      <svg viewBox="0 0 200 200" class="svg-climber">
        <circle cx="55" cy="95" r="12" fill="#00f59b" />
        <line x1="62" y1="102" x2="140" y2="120" stroke="#00f59b" stroke-width="8" stroke-linecap="round" />
        <line x1="75" y1="105" x2="75" y2="155" stroke="#06b6d4" stroke-width="7" stroke-linecap="round" />
        <!-- Bent driving leg -->
        <polyline points="135,120 100,125 105,150" fill="none" stroke="#00f59b" stroke-width="7" stroke-linecap="round" />
        <!-- Straight leg -->
        <line x1="140" y1="120" x2="175" y2="155" stroke="#8b5cf6" stroke-width="7" stroke-linecap="round" />
        <line x1="30" y1="158" x2="185" y2="158" stroke="rgba(255,255,255,0.2)" stroke-width="3" />
      </svg>
    `
  },
  {
    id: 'lunges',
    name: 'Alternating Forward Lunges',
    category: 'Legs',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Balance'],
    difficulty: 'Beginner',
    calPerMin: 8.0,
    instructions: 'Step forward with one foot, bending both knees to approximately 90 degrees. Lower until your back knee hovers just above the floor. Push firmly through front heel to step back to starting position.',
    dos: [
      'Keep torso upright and crown of head reaching toward the ceiling',
      'Ensure front knee stays stacked over front ankle',
      'Step out with adequate width for lateral stability'
    ],
    donts: [
      'Slamming the rear kneecap violently against hard flooring',
      'Collapsing the chest forward onto the front thigh'
    ],
    breathing: 'Inhale as you step out and lower. Exhale forcefully as you press back.',
    voiceCues: {
      halfway: 'Halfway! Control that descent, no knee slamming!',
      last10: '10 seconds left! Strong pushes off that front heel!'
    },
    svg: `
      <svg viewBox="0 0 200 200" class="svg-lunge">
        <circle cx="95" cy="50" r="13" fill="#00f59b" />
        <line x1="95" y1="63" x2="95" y2="115" stroke="#00f59b" stroke-width="8" stroke-linecap="round" />
        <!-- Front Leg (Bent 90 deg) -->
        <polyline points="95,115 130,118 130,165" fill="none" stroke="#06b6d4" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Back Leg (Hovering) -->
        <polyline points="95,115 65,135 60,162" fill="none" stroke="#8b5cf6" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
        <line x1="40" y1="168" x2="160" y2="168" stroke="rgba(255,255,255,0.2)" stroke-width="3" />
      </svg>
    `
  },
  {
    id: 'burpees',
    name: 'Full Body Burpees',
    category: 'Cardio',
    muscles: ['Full Body', 'Heart Engine', 'Chest', 'Legs'],
    difficulty: 'Advanced',
    calPerMin: 14.0,
    instructions: 'From standing, drop hands to the deck, kick feet back to high plank, perform a clean chest-to-deck touch, pop feet back under your hips, and explode straight into the air with an overhead reach.',
    dos: [
      'Snap feet up wide outside the hands to save lower back strain',
      'Explode upwards with full hip extension',
      'Land softly right into the next repetition'
    ],
    donts: [
      'Arching lumbar spine while kicking legs backward',
      'Stopping to rest mid-repetition'
    ],
    breathing: 'Exhale explosively at the peak of the jump. Inhale as you drop hands down.',
    voiceCues: {
      halfway: 'Halfway! Find your rhythm, smooth and continuous!',
      last10: 'Final ten seconds! Champions push through the burn!'
    },
    svg: `
      <svg viewBox="0 0 200 200" class="svg-burpee">
        <circle cx="100" cy="40" r="14" fill="#ff6b35" />
        <line x1="100" y1="54" x2="100" y2="115" stroke="#ff6b35" stroke-width="8" stroke-linecap="round" />
        <!-- Jump Arms up -->
        <line x1="100" y1="70" x2="70" y2="30" stroke="#00f59b" stroke-width="7" stroke-linecap="round" />
        <line x1="100" y1="70" x2="130" y2="30" stroke="#00f59b" stroke-width="7" stroke-linecap="round" />
        <!-- Jump Legs down -->
        <line x1="100" y1="115" x2="85" y2="160" stroke="#06b6d4" stroke-width="7" stroke-linecap="round" />
        <line x1="100" y1="115" x2="115" y2="160" stroke="#06b6d4" stroke-width="7" stroke-linecap="round" />
        <!-- Jump blast rings -->
        <circle cx="100" cy="180" r="18" fill="none" stroke="rgba(255,107,53,0.4)" stroke-width="3" />
      </svg>
    `
  },
  {
    id: 'bicycle_crunches',
    name: 'Bicycle Crunches',
    category: 'Core',
    muscles: ['Rectus Abdominis', 'Internal Obliques', 'External Obliques'],
    difficulty: 'Intermediate',
    calPerMin: 9.5,
    instructions: 'Lie on your back with fingertips lightly cradling your temples. Bring knees to table-top. Rotate your torso to meet opposite elbow to opposite knee while extending the other leg out straight at a 45-degree angle.',
    dos: [
      'Rotate from your ribcage and shoulders, not by pulling on your neck',
      'Keep shoulder blades elevated off the floor throughout',
      'Pause for a micro-second at each cross contraction'
    ],
    donts: [
      'Yanking violently on cervical spine with your hands',
      'Rushing through reps with zero torso rotation'
    ],
    breathing: 'Exhale with every twist and crossover. Inhale as you transition center.',
    voiceCues: {
      halfway: 'Halfway! Rotate that shoulder completely across!',
      last10: 'Ten seconds left! Feel the burn in the oblique walls!'
    },
    svg: `
      <svg viewBox="0 0 200 200" class="svg-bicycle">
        <circle cx="55" cy="120" r="12" fill="#00f59b" />
        <line x1="65" y1="125" x2="115" y2="135" stroke="#00f59b" stroke-width="8" stroke-linecap="round" />
        <!-- Knee tucked -->
        <polyline points="115,135 95,105 85,120" fill="none" stroke="#06b6d4" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Leg extended -->
        <polyline points="115,135 155,120 180,110" fill="none" stroke="#8b5cf6" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `
  },
  {
    id: 'glute_bridges',
    name: 'Glute Bridges',
    category: 'Legs',
    muscles: ['Gluteus Maximus', 'Hamstrings', 'Posterior Chain'],
    difficulty: 'Beginner',
    calPerMin: 6.5,
    instructions: 'Lie flat on your back, knees bent, feet flat on the floor hip-width apart and near your glutes. Drive through heels to raise hips until thighs and torso align. Squeeze glutes firmly at top before lowering.',
    dos: [
      'Initiate drive from heels and contract glutes at peak height',
      'Keep core braced to prevent hyper-arching your lower back',
      'Hold the contraction at the peak for 1 full second'
    ],
    donts: [
      'Arching lower back beyond neutral spine',
      'Letting knees splay excessively outward or pinch inward'
    ],
    breathing: 'Exhale as you bridge upwards. Inhale as you return your hips to the mat.',
    voiceCues: {
      halfway: 'Halfway mark! Hard squeeze at the apex of every rep!',
      last10: '10 seconds to go! Lock out full posterior power!'
    },
    svg: `
      <svg viewBox="0 0 200 200" class="svg-bridge">
        <circle cx="45" cy="145" r="12" fill="#00f59b" />
        <!-- Bridged torso -->
        <line x1="55" y1="145" x2="110" y2="115" stroke="#00f59b" stroke-width="8" stroke-linecap="round" />
        <!-- Bent legs to ground -->
        <polyline points="110,115 145,115 150,155" fill="none" stroke="#8b5cf6" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
        <line x1="30" y1="158" x2="175" y2="158" stroke="rgba(255,255,255,0.2)" stroke-width="3" />
      </svg>
    `
  },
  {
    id: 'tricep_dips',
    name: 'Bench/Chair Tricep Dips',
    category: 'Arms',
    muscles: ['Triceps', 'Anterior Shoulders', 'Upper Chest'],
    difficulty: 'Beginner',
    calPerMin: 7.5,
    instructions: 'Sit on the edge of a chair or stable surface with hands gripping beside your hips. Slide forward off the edge, bend elbows straight back to lower body until elbows hit 90 degrees, then push through palms to lockout.',
    dos: [
      'Keep back close to the bench to minimize shoulder shear',
      'Lower until upper arms are parallel to the floor',
      'Squeeze triceps at top lockout'
    ],
    donts: [
      'Flaring elbows out to the sides',
      'Dropping lower than 90 degrees if shoulders lack mobility'
    ],
    breathing: 'Inhale on the lowering phase. Exhale sharply on the upward extension.',
    voiceCues: {
      halfway: 'Halfway! Keep elbows pointing straight back!',
      last10: 'Ten seconds! Strong lockout at the top!'
    },
    svg: `
      <svg viewBox="0 0 200 200" class="svg-dips">
        <!-- Chair/Bench outline -->
        <rect x="35" y="105" width="40" height="55" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" stroke-width="2" rx="4" />
        <circle cx="95" cy="70" r="12" fill="#00f59b" />
        <line x1="95" y1="82" x2="95" y2="128" stroke="#00f59b" stroke-width="8" stroke-linecap="round" />
        <!-- Arm pressing bench -->
        <polyline points="93,92 72,95 72,106" fill="none" stroke="#06b6d4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Bent legs forward -->
        <polyline points="95,128 125,130 130,160" fill="none" stroke="#8b5cf6" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
        <line x1="30" y1="162" x2="170" y2="162" stroke="rgba(255,255,255,0.2)" stroke-width="3" />
      </svg>
    `
  },
  {
    id: 'high_knees',
    name: 'High Knees Sprint',
    category: 'Cardio',
    muscles: ['Hip Flexors', 'Quadriceps', 'Calves', 'Cardiovascular System'],
    difficulty: 'Intermediate',
    calPerMin: 12.5,
    instructions: 'Run in place, explosively lifting alternating knees to hip height while pumping your arms with athletic intent. Stay agile on the balls of your feet.',
    dos: [
      'Drive knees all the way up to parallel waist height',
      'Keep chest tall and maintain forward eye line',
      'Pump arms rhythmically from hip to chin'
    ],
    donts: [
      'Leaning torso backward to compensate for hip height',
      'Letting feet stamp heavily'
    ],
    breathing: 'Rapid cyclic breathing matching step cadence.',
    voiceCues: {
      halfway: 'Halfway! Lift those knees higher, waist level!',
      last10: 'Sprint speed! 10 seconds of max intensity!'
    },
    svg: `
      <svg viewBox="0 0 200 200" class="svg-knees">
        <circle cx="100" cy="40" r="13" fill="#00f59b" />
        <line x1="100" y1="53" x2="100" y2="110" stroke="#00f59b" stroke-width="8" stroke-linecap="round" />
        <!-- One knee high (90 deg) -->
        <polyline points="100,110 75,108 75,145" fill="none" stroke="#00f59b" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Ground leg -->
        <line x1="100" y1="110" x2="115" y2="165" stroke="#8b5cf6" stroke-width="7" stroke-linecap="round" />
        <!-- Pumping arms -->
        <polyline points="100,68 125,65 130,95" fill="none" stroke="#06b6d4" stroke-width="6" stroke-linecap="round" />
        <line x1="50" y1="168" x2="150" y2="168" stroke="rgba(255,255,255,0.2)" stroke-width="3" />
      </svg>
    `
  },
  {
    id: 'superman_hold',
    name: 'Superman Back Extensor',
    category: 'Back',
    muscles: ['Erector Spinae', 'Glutes', 'Upper Back', 'Hamstrings'],
    difficulty: 'Beginner',
    calPerMin: 6.5,
    instructions: 'Lie face down on the floor with arms extended overhead. Simultaneously raise arms, chest, and thighs off the floor by contracting your posterior chain. Hold the flying position.',
    dos: [
      'Keep neck relaxed by looking straight down at the floor',
      'Contract glutes and squeeze scapulae together',
      'Focus on length through fingertips and toes'
    ],
    donts: [
      'Cranking head backward into excessive neck extension',
      'Jerking or bouncing violently'
    ],
    breathing: 'Slow controlled breaths into abdomen. Never hold breath under tension.',
    voiceCues: {
      halfway: 'Halfway! Squeeze those upper back muscles together!',
      last10: 'Ten seconds! Hold high and long!'
    },
    svg: `
      <svg viewBox="0 0 200 200" class="svg-superman">
        <circle cx="50" cy="115" r="11" fill="#00f59b" />
        <!-- Raised torso curve -->
        <path d="M 60 120 Q 100 135 140 120" fill="none" stroke="#00f59b" stroke-width="8" stroke-linecap="round" />
        <!-- Reaching arms -->
        <line x1="60" y1="120" x2="25" y2="105" stroke="#06b6d4" stroke-width="6" stroke-linecap="round" />
        <!-- Raised legs -->
        <line x1="140" y1="120" x2="175" y2="105" stroke="#8b5cf6" stroke-width="6" stroke-linecap="round" />
        <line x1="20" y1="150" x2="180" y2="150" stroke="rgba(255,255,255,0.2)" stroke-width="3" stroke-dasharray="6 4" />
      </svg>
    `
  }
];

// PRE-BUILT WORKOUT PROGRAMS
const WORKOUT_PROGRAMS = [
  {
    id: 'prog_hiit_torch',
    title: 'HIIT Full Body Blast',
    category: 'hiit',
    level: 'intermediate',
    levelLabel: 'Intermediate',
    estMinutes: 12,
    estCalories: 135,
    tagline: 'High octane fat-burning interval circuit that spikes your metabolism.',
    description: 'Dynamic mix of cardio plyometrics and core control designed to maximize calorie burn and endurance with minimal rest periods.',
    rounds: 2,
    exercises: [
      { exerciseId: 'jumping_jacks', workSec: 35, restSec: 15 },
      { exerciseId: 'pushups', workSec: 30, restSec: 15 },
      { exerciseId: 'bodyweight_squats', workSec: 35, restSec: 15 },
      { exerciseId: 'mountain_climbers', workSec: 30, restSec: 15 },
      { exerciseId: 'high_plank', workSec: 35, restSec: 25 }
    ]
  },
  {
    id: 'prog_core_sculpt',
    title: 'Core Matrix & Abs Shred',
    category: 'core',
    level: 'beginner',
    levelLabel: 'All Levels',
    estMinutes: 10,
    estCalories: 85,
    tagline: 'Target all 3 planes of abdominal strength without neck strain.',
    description: 'A focused core session strengthening the transverse abdominis, rectus abdominis, and deep stabilizing spinal erectors.',
    rounds: 2,
    exercises: [
      { exerciseId: 'high_plank', workSec: 40, restSec: 15 },
      { exerciseId: 'bicycle_crunches', workSec: 30, restSec: 15 },
      { exerciseId: 'glute_bridges', workSec: 35, restSec: 15 },
      { exerciseId: 'superman_hold', workSec: 30, restSec: 20 }
    ]
  },
  {
    id: 'prog_calisthenics_iron',
    title: 'Upper Body Calisthenics',
    category: 'strength',
    level: 'advanced',
    levelLabel: 'Advanced',
    estMinutes: 14,
    estCalories: 140,
    tagline: 'Build lean pushing and pulling bodyweight strength without weights.',
    description: 'Progressive overload using body angles to forge bulletproof shoulders, triceps, chest, and athletic posture.',
    rounds: 2,
    exercises: [
      { exerciseId: 'pushups', workSec: 35, restSec: 20 },
      { exerciseId: 'tricep_dips', workSec: 35, restSec: 15 },
      { exerciseId: 'superman_hold', workSec: 35, restSec: 15 },
      { exerciseId: 'high_plank', workSec: 45, restSec: 20 }
    ]
  },
  {
    id: 'prog_legs_power',
    title: 'Lower Body & Glutes Power',
    category: 'strength',
    level: 'intermediate',
    levelLabel: 'Intermediate',
    estMinutes: 12,
    estCalories: 115,
    tagline: 'Explosive quadricep, hamstring, and glute activation circuit.',
    description: 'Develop firm lower body propulsion and knee resilience with time-under-tension squat and lunge mechanics.',
    rounds: 2,
    exercises: [
      { exerciseId: 'bodyweight_squats', workSec: 40, restSec: 15 },
      { exerciseId: 'lunges', workSec: 40, restSec: 15 },
      { exerciseId: 'glute_bridges', workSec: 40, restSec: 15 },
      { exerciseId: 'high_knees', workSec: 25, restSec: 20 }
    ]
  },
  {
    id: 'prog_morning_flow',
    title: 'Morning Awakening & Flow',
    category: 'mobility',
    level: 'beginner',
    levelLabel: 'Beginner',
    estMinutes: 8,
    estCalories: 50,
    tagline: 'Decompress joints, wake up your nervous system, and ignite energy.',
    description: 'Low-impact flow ideal for morning routines or workday recovery. Promotes circulation, spinal health, and flexibility.',
    rounds: 1,
    exercises: [
      { exerciseId: 'glute_bridges', workSec: 45, restSec: 15 },
      { exerciseId: 'superman_hold', workSec: 40, restSec: 15 },
      { exerciseId: 'bodyweight_squats', workSec: 40, restSec: 15 },
      { exerciseId: 'high_plank', workSec: 35, restSec: 15 },
      { exerciseId: 'jumping_jacks', workSec: 30, restSec: 10 }
    ]
  },
  {
    id: 'prog_express_tabata',
    title: 'Tabata Torch (5-Min Sprint)',
    category: 'hiit',
    level: 'advanced',
    levelLabel: 'High Intensity',
    estMinutes: 5,
    estCalories: 75,
    tagline: '20 seconds work, 10 seconds rest. Pure metabolic inferno.',
    description: 'Strict Tabata protocol designed to deliver maximum cardiovascular stimulus in the shortest possible window.',
    rounds: 1,
    exercises: [
      { exerciseId: 'burpees', workSec: 20, restSec: 10 },
      { exerciseId: 'high_knees', workSec: 20, restSec: 10 },
      { exerciseId: 'mountain_climbers', workSec: 20, restSec: 10 },
      { exerciseId: 'jumping_jacks', workSec: 20, restSec: 10 },
      { exerciseId: 'pushups', workSec: 20, restSec: 10 },
      { exerciseId: 'bodyweight_squats', workSec: 20, restSec: 10 }
    ]
  }
];

// ACHIEVEMENTS / BADGES DEFINITION
const ACHIEVEMENTS_LIST = [
  { id: 'first_blood', name: 'First Workout', icon: '⚡', desc: 'Finish your very first workout session.' },
  { id: 'streak_3', name: 'Consistency Cadet', icon: '🔥', desc: 'Reach a 3-day workout streak.' },
  { id: 'streak_7', name: 'Week Warrior', icon: '🛡️', desc: 'Reach a 7-day workout streak.' },
  { id: 'hiit_king', name: 'HIIT Engine', icon: '🚀', desc: 'Complete 3 HIIT sessions.' },
  { id: 'calorie_500', name: '500 kCal Burned', icon: '🌋', desc: 'Burn over 500 total estimated calories.' },
  { id: 'custom_builder', name: 'Routine Architect', icon: '🛠️', desc: 'Create and run a custom workout.' },
  { id: 'centurion', name: 'Century Club', icon: '⏱️', desc: 'Accumulate 100 total workout minutes.' },
  { id: 'master_coach', name: 'Iron Will', icon: '👑', desc: 'Complete 10 total workout sessions.' }
];

// Helper lookup
function getExerciseById(id) {
  return EXERCISE_DATABASE.find(e => e.id === id) || null;
}

function getProgramById(id) {
  return WORKOUT_PROGRAMS.find(p => p.id === id) || null;
}
