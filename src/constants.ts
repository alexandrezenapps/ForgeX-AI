import { Exercise, Badge, WorkoutSession, LeaderboardEntry, WorkoutTemplate } from './types';

export const ALL_EQUIPMENT = [
  'Barbell',
  'Dumbbells',
  'Kettlebell',
  'Bench',
  'Squat Rack',
  'Pull-up Bar',
  'Resistance Bands',
  'Cable Machine',
  'Bodyweight',
  'Yoga Mat',
  'Pilates Ball',
  'Pilates Ring',
];

export const EXERCISES: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    category: 'Chest',
    equipment: ['Barbell', 'Bench'],
    difficulty: 'Intermediate',
    description: 'A compound exercise that works the chest, shoulders, and triceps.',
    cues: [
      'Keep your feet flat on the floor.',
      'Maintain a slight arch in your lower back.',
      'Lower the bar to your mid-chest.',
      'Drive the bar back up to full extension.'
    ],
    videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3ps'
  },
  {
    id: '2',
    name: 'Dumbbell Bicep Curls',
    category: 'Arms',
    equipment: ['Dumbbells'],
    difficulty: 'Beginner',
    description: 'An isolation exercise that targets the biceps.',
    cues: [
      'Keep your elbows close to your torso.',
      'Curl the weights while contracting your biceps.',
      'Lower the weights back down slowly.',
      'Avoid swinging your arms.'
    ],
    videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo'
  },
  {
    id: '3',
    name: 'Barbell Squat',
    category: 'Legs',
    equipment: ['Barbell', 'Squat Rack'],
    difficulty: 'Advanced',
    description: 'A compound exercise that works the quads, hamstrings, and glutes.',
    cues: [
      'Keep your chest up and back straight.',
      'Lower your hips until your thighs are parallel to the floor.',
      'Drive back up through your heels.',
      'Keep your knees in line with your toes.'
    ],
    videoUrl: 'https://www.youtube.com/embed/gcNh17Ckjgg'
  },
  {
    id: '4',
    name: 'Deadlift',
    category: 'Back',
    equipment: ['Barbell'],
    difficulty: 'Advanced',
    description: 'A compound exercise that works the entire posterior chain.',
    cues: [
      'Keep your back flat and core engaged.',
      'Lift the bar by extending your hips and knees.',
      'Keep the bar close to your body.',
      'Lower the bar back down with control.'
    ],
    videoUrl: 'https://www.youtube.com/embed/op9kVnSso6Q'
  },
  {
    id: '5',
    name: 'Pushups',
    category: 'Chest',
    equipment: ['Bodyweight'],
    difficulty: 'Beginner',
    description: 'A fundamental bodyweight exercise for chest, shoulders, and triceps.',
    cues: [
      'Keep your body in a straight line.',
      'Lower until your chest nearly touches the floor.',
      'Push back up to full extension.',
      'Engage your core throughout.'
    ],
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4'
  },
  {
    id: '6',
    name: 'Pull-ups',
    category: 'Back',
    equipment: ['Pull-up Bar'],
    difficulty: 'Intermediate',
    description: 'A challenging upper body exercise targeting the lats and biceps.',
    cues: [
      'Grip the bar slightly wider than shoulders.',
      'Pull your chest toward the bar.',
      'Lower yourself with control.',
      'Avoid swinging your legs.'
    ],
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g'
  },
  {
    id: '7',
    name: 'Lunges',
    category: 'Legs',
    equipment: ['Bodyweight', 'Dumbbells'],
    difficulty: 'Beginner',
    description: 'A lower body exercise that improves balance and leg strength.',
    cues: [
      'Step forward and lower your hips.',
      'Keep your front knee above your ankle.',
      'Push back to the starting position.',
      'Keep your torso upright.'
    ],
    videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U'
  },
  {
    id: '8',
    name: 'Plank',
    category: 'Core',
    equipment: ['Bodyweight'],
    difficulty: 'Beginner',
    description: 'A static exercise that builds core stability and strength.',
    cues: [
      'Hold a pushup-like position on your elbows.',
      'Keep your body in a straight line.',
      'Squeeze your glutes and core.',
      'Don\'t let your hips sag.'
    ],
    videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw'
  },
  {
    id: '9',
    name: 'Overhead Press',
    category: 'Shoulders',
    equipment: ['Barbell', 'Dumbbells'],
    difficulty: 'Intermediate',
    description: 'A compound exercise for building strong, stable shoulders.',
    cues: [
      'Press the weight directly overhead.',
      'Keep your core tight and back straight.',
      'Lock out your elbows at the top.',
      'Lower the weight back to shoulder level.'
    ],
    videoUrl: 'https://www.youtube.com/embed/2yjwxtZQDGA'
  },
  {
    id: '10',
    name: 'Romanian Deadlift',
    category: 'Legs',
    equipment: ['Barbell', 'Dumbbells'],
    difficulty: 'Intermediate',
    description: 'An exercise focusing on the hamstrings and glutes.',
    cues: [
      'Hinge at the hips with a slight knee bend.',
      'Lower the weight along your shins.',
      'Feel the stretch in your hamstrings.',
      'Drive your hips forward to stand up.'
    ],
    videoUrl: 'https://www.youtube.com/embed/JCXUYuzwvgM'
  },
  {
    id: '11',
    name: 'Tricep Dips',
    category: 'Arms',
    equipment: ['Parallel Bars', 'Bench'],
    difficulty: 'Intermediate',
    description: 'A powerful exercise for isolating and building the triceps.',
    cues: [
      'Lower your body by bending your elbows.',
      'Keep your elbows close to your body.',
      'Push back up to the starting position.',
      'Keep your chest up.'
    ],
    videoUrl: 'https://www.youtube.com/embed/6kALZiktrLc'
  },
  {
    id: '12',
    name: 'Russian Twists',
    category: 'Core',
    equipment: ['Bodyweight', 'Medicine Ball'],
    difficulty: 'Beginner',
    description: 'A rotational exercise for the obliques and core.',
    cues: [
      'Sit with knees bent and feet off the floor.',
      'Twist your torso from side to side.',
      'Touch the floor on each side.',
      'Keep your back straight.'
    ],
    videoUrl: 'https://www.youtube.com/embed/NeAtimSCasY'
  },
  {
    id: '13',
    name: 'Downward-Facing Dog',
    category: 'Yoga',
    equipment: ['Bodyweight', 'Yoga Mat'],
    difficulty: 'Beginner',
    description: 'A foundational yoga pose that stretches the entire body.',
    cues: [
      'Spread your fingers wide.',
      'Push your hips up and back.',
      'Keep your back flat.',
      'Pedal your feet to stretch your calves.'
    ],
    videoUrl: 'https://www.youtube.com/embed/j97UX0646qw'
  },
  {
    id: '14',
    name: 'Warrior I',
    category: 'Yoga',
    equipment: ['Bodyweight'],
    difficulty: 'Beginner',
    description: 'A standing pose that builds strength and focus.',
    cues: [
      'Step one foot forward into a lunge.',
      'Keep your back foot at a 45-degree angle.',
      'Reach your arms overhead.',
      'Square your hips to the front.'
    ],
    videoUrl: 'https://www.youtube.com/embed/o_I9vYvY_3U'
  },
  {
    id: '15',
    name: 'Cobra Pose',
    category: 'Yoga',
    equipment: ['Bodyweight'],
    difficulty: 'Beginner',
    description: 'A back-bending pose that opens the chest and strengthens the spine.',
    cues: [
      'Lie on your stomach with hands under shoulders.',
      'Gently lift your chest off the floor.',
      'Keep your elbows close to your sides.',
      'Gaze slightly upward.'
    ],
    videoUrl: 'https://www.youtube.com/embed/fOdrW7nfLfE'
  },
  {
    id: '16',
    name: 'Tree Pose',
    category: 'Yoga',
    equipment: ['Bodyweight'],
    difficulty: 'Intermediate',
    description: 'A balancing pose that improves focus and stability.',
    cues: [
      'Stand on one leg.',
      'Place the sole of your other foot on your inner thigh or calf.',
      'Bring your hands to your heart center.',
      'Find a steady point to gaze at.'
    ],
    videoUrl: 'https://www.youtube.com/embed/wdln9qWYloU'
  },
  {
    id: '17',
    name: 'The Hundred',
    category: 'Pilates',
    equipment: ['Bodyweight', 'Yoga Mat'],
    difficulty: 'Intermediate',
    description: 'A classic Pilates exercise that builds core strength and improves circulation.',
    cues: [
      'Lie on your back with legs in tabletop position.',
      'Lift your head and shoulders off the mat.',
      'Pump your arms up and down vigorously.',
      'Inhale for 5 counts, exhale for 5 counts.'
    ],
    videoUrl: 'https://www.youtube.com/embed/3v_70U9m5E0'
  },
  {
    id: '18',
    name: 'Pilates Roll Up',
    category: 'Pilates',
    equipment: ['Bodyweight'],
    difficulty: 'Intermediate',
    description: 'A core-strengthening exercise that improves spinal flexibility.',
    cues: [
      'Lie flat on your back with arms overhead.',
      'Slowly roll up, reaching for your toes.',
      'Keep your core engaged and spine curved.',
      'Roll back down with control, one vertebra at a time.'
    ],
    videoUrl: 'https://www.youtube.com/embed/u-vS9n_2OqY'
  },
  {
    id: '19',
    name: 'Single Leg Stretch',
    category: 'Pilates',
    equipment: ['Bodyweight'],
    difficulty: 'Beginner',
    description: 'A core exercise that targets the abdominals and improves coordination.',
    cues: [
      'Lie on your back with knees in tabletop.',
      'Lift your head and shoulders.',
      'Extend one leg out while pulling the other knee in.',
      'Switch legs with control, keeping your lower back pressed to the mat.'
    ],
    videoUrl: 'https://www.youtube.com/embed/6_rD8D8Z5pY'
  },
  {
    id: '20',
    name: 'Pilates Saw',
    category: 'Pilates',
    equipment: ['Bodyweight'],
    difficulty: 'Beginner',
    description: 'A rotational exercise that improves spinal mobility and stretches the hamstrings.',
    cues: [
      'Sit with legs wide and arms extended to the sides.',
      'Twist your torso and reach for the opposite foot.',
      'Keep your hips grounded.',
      'Return to center and repeat on the other side.'
    ],
    videoUrl: 'https://www.youtube.com/embed/Pj1e9pW9-Y8'
  }
];

export const BADGES: Badge[] = [
  {
    id: '1',
    name: 'First Workout',
    description: 'Complete your first workout session.',
    icon: 'Award',
    unlocked: true
  },
  {
    id: '2',
    name: 'Consistency King',
    description: 'Maintain a 7-day workout streak.',
    icon: 'Flame',
    unlocked: false
  },
  {
    id: '3',
    name: 'Strength Master',
    description: 'Reach a combined total of 1000 lbs in the big three.',
    icon: 'Dumbbell',
    unlocked: false
  },
  {
    id: '4',
    name: 'Early Bird',
    description: 'Complete 5 workouts before 8 AM.',
    icon: 'Zap',
    unlocked: false
  },
  {
    id: '5',
    name: 'Night Owl',
    description: 'Complete 5 workouts after 9 PM.',
    icon: 'Moon',
    unlocked: false
  },
  {
    id: '6',
    name: 'Volume Warrior',
    description: 'Lift a total of 50,000 lbs in a single week.',
    icon: 'Trophy',
    unlocked: false
  },
  {
    id: '7',
    name: 'Challenge Master',
    description: 'Complete 5 weekly challenges.',
    icon: 'Star',
    unlocked: false
  }
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { id: '1', name: 'Alex', points: 12500, tier: 'Elite' },
  { id: '2', name: 'Sarah', points: 11200, tier: 'Platinum' },
  { id: '3', name: 'Mike', points: 9800, tier: 'Gold' },
  { id: '4', name: 'Elena', points: 8500, tier: 'Gold' },
  { id: '5', name: 'David', points: 7200, tier: 'Silver' },
  { id: '6', name: 'Chris', points: 6800, tier: 'Silver' },
  { id: '7', name: 'Jessica', points: 5400, tier: 'Bronze' },
  { id: '8', name: 'Ryan', points: 4200, tier: 'Bronze' },
];

export const WORKOUT_HISTORY: WorkoutSession[] = [
  {
    id: '1',
    name: 'Push Session A',
    date: '2026-03-27T10:00:00Z',
    duration: 52,
    calories: 420,
    exercises: [
      {
        exerciseId: '1',
        sets: [
          { reps: 10, weight: 60, completed: true },
          { reps: 10, weight: 60, completed: true },
          { reps: 8, weight: 60, completed: true },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Leg Day Alpha',
    date: '2026-03-25T14:30:00Z',
    duration: 65,
    calories: 580,
    exercises: [
      {
        exerciseId: '3',
        sets: [
          { reps: 12, weight: 80, completed: true },
          { reps: 10, weight: 80, completed: true },
          { reps: 10, weight: 80, completed: true },
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Back & Biceps',
    date: '2026-03-23T18:15:00Z',
    duration: 48,
    calories: 390,
    exercises: [
      {
        exerciseId: '4',
        sets: [
          { reps: 8, weight: 100, completed: true },
          { reps: 8, weight: 100, completed: true },
          { reps: 6, weight: 100, completed: true },
        ]
      }
    ]
  }
];

export const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'dt1',
    name: 'Neural Chest & Back (Superset)',
    exercises: [
      {
        exerciseId: '1', // Bench Press
        supersetWith: '6', // Pull-ups
        sets: [
          { reps: 10, weight: 60 },
          { reps: 10, weight: 60 },
          { reps: 10, weight: 60 },
        ]
      },
      {
        exerciseId: '6', // Pull-ups
        sets: [
          { reps: 8, weight: 0 },
          { reps: 8, weight: 0 },
          { reps: 8, weight: 0 },
        ]
      },
      {
        exerciseId: '5', // Pushups
        sets: [
          { reps: 15, weight: 0 },
          { reps: 15, weight: 0 },
          { reps: 15, weight: 0 },
        ]
      }
    ]
  },
  {
    id: 'dt2',
    name: 'Cybernetic Leg Day',
    exercises: [
      {
        exerciseId: '3', // Squat
        sets: [
          { reps: 10, weight: 80 },
          { reps: 10, weight: 80 },
          { reps: 10, weight: 80 },
        ]
      },
      {
        exerciseId: '10', // Romanian Deadlift
        sets: [
          { reps: 12, weight: 60 },
          { reps: 12, weight: 60 },
          { reps: 12, weight: 60 },
        ]
      }
    ]
  }
];
