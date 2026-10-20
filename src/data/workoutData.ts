export interface ExerciseSet {
  setNumber: number;
  reps: string;
  restSeconds: number;
  notes?: string;
  isUnilateral?: boolean;
}

export interface Exercise {
  id: string;
  slug: string;
  dayId: "leg-day" | "arm-day" | "chest-day" | "back-day" | "shoulder-day";
  dayName: string;
  title: string;
  subtitle: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  betweenExerciseRest: number; // in seconds
  generalFormCue: string;
  demoImage: string;
  startPositionImage?: string;
  finishPositionImage?: string;
  sets: ExerciseSet[];
  howToPerform: {
    setup: string[];
    execution: string[];
    proTips: string[];
    commonMistakes: string[];
  };
}

export interface WorkoutDay {
  id: "leg-day" | "arm-day" | "chest-day" | "back-day" | "shoulder-day";
  slug: string;
  name: string;
  tagline: string;
  totalExercises: number;
  estimatedDuration: string;
  targetIntensity: string;
  badge: string;
  exercises: Exercise[];
}

export interface StretchItem {
  id: string;
  name: string;
  targetArea: string;
  durationOrReps: string;
  instruction: string;
  image?: string;
  type: "dynamic" | "static";
}

export interface CardioProtocol {
  durationMinutes: number;
  preferredActivity: string;
  preferredActivityDetails: string;
  alternativeActivities: {
    name: string;
    setting: string;
    benefit: string;
  }[];
  intensityCue: string;
  targetHeartRateZone: string;
}

export interface FinisherRoutine {
  type: "abs" | "calves";
  title: string;
  badge: string;
  tagline: string;
  description: string;
  frequencyRule: string;
  exercises: {
    id: string;
    name: string;
    targetMuscle: string;
    sets: number;
    reps: string;
    restSeconds: number;
    cue: string;
    notes: string;
  }[];
}

export interface ScheduledWorkoutDay {
  workoutNumber: number; // 1 to 28
  dayOfWeek: string;
  dayName: string;
  splitId: "chest-day" | "back-day" | "shoulder-day" | "leg-day" | "arm-day" | "rest";
  splitName: string;
  focus: string;
  coreOrCalf: "abs" | "calves" | "none";
  cardioMinutes: number;
  isRest: boolean;
}

// -------------------------------------------------------------
// MAIN WORKOUT DAYS: Leg, Arm, Chest, Back, Shoulder
// -------------------------------------------------------------
export const WORKOUT_DAYS: WorkoutDay[] = [
  {
    id: "chest-day",
    slug: "chest-day",
    name: "Chest Day",
    tagline: "Upper, mid, and lower pectoral density & pressing power",
    totalExercises: 4,
    estimatedDuration: "50 - 65 min",
    targetIntensity: "High hypertrophy tension (RPE 8-9)",
    badge: "Pectoral Focus",
    exercises: [
      {
        id: "incline-chest-press",
        slug: "incline-chest-press",
        dayId: "chest-day",
        dayName: "Chest Day",
        title: "Incline Chest Press",
        subtitle: "Upper Pectoral (Clavicular Head) Focus",
        primaryMuscles: ["Upper Chest (Pectoralis Major)"],
        secondaryMuscles: ["Front Deltoids", "Triceps"],
        equipment: "Incline Press Machine / Dumbbells",
        betweenExerciseRest: 60,
        generalFormCue: "Drive through elbows and squeeze upper chest hard at the top. Control descent.",
        demoImage: "/images/exercises/incline-chest-press.png",
        startPositionImage: "/images/exercises/incline-chest-press-start.png",
        finishPositionImage: "/images/exercises/incline-chest-press-finish.png",
        sets: [
          { setNumber: 1, reps: "8-12 Reps", restSeconds: 60, notes: "Moderate heavy working set" },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 60, notes: "Keep strict elbow angle" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 60, notes: "Final heavy set to near failure" },
        ],
        howToPerform: {
          setup: [
            "Adjust the seat so handles align with your upper chest line.",
            "Plant feet firmly on the floor and retract your shoulder blades into the back pad.",
            "Grip the handles firmly with wrists straight."
          ],
          execution: [
            "Press the handles smoothly forward and upward until arms are almost fully extended.",
            "Focus on squeezing the upper chest fibers together.",
            "Lower under complete control for 2-3 seconds until you feel a deep chest stretch."
          ],
          proTips: [
            "Do not allow your shoulders to roll forward at the peak contraction.",
            "Keep your chin tucked and chest proudly puffed out throughout."
          ],
          commonMistakes: [
            "Flaring elbows straight out at 90 degrees (keep at roughly 45-60 degrees).",
            "Bouncing out of the bottom stretch position."
          ]
        }
      },
      {
        id: "flat-bench-chest-press",
        slug: "flat-bench-chest-press",
        dayId: "chest-day",
        dayName: "Chest Day",
        title: "Flat Bench Chest Press",
        subtitle: "Mid & Sternal Pectoral Mass Builder",
        primaryMuscles: ["Mid Chest (Sternal Head)"],
        secondaryMuscles: ["Anterior Deltoids", "Triceps"],
        equipment: "Flat Bench / Machine or Barbell",
        betweenExerciseRest: 60,
        generalFormCue: "Retract scapulae, touch lower sternum under control, drive up explosively.",
        demoImage: "/images/exercises/flat-bench-chest-press.png",
        startPositionImage: "/images/exercises/flat-bench-chest-press-start.png",
        finishPositionImage: "/images/exercises/flat-bench-chest-press-finish.png",
        sets: [
          { setNumber: 1, reps: "20 Reps", restSeconds: 45, notes: "High-rep warm-up and blood pump" },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 45, notes: "Increase load to heavy working weight" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 30, notes: "Short rest overload set" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 30, notes: "Maximum effort final set" },
        ],
        howToPerform: {
          setup: [
            "Lie flat with eyes under the bar or handles, feet flat on the floor.",
            "Pinch shoulder blades back and down to create a stable pressing platform."
          ],
          execution: [
            "Lower weight smoothly until hands touch or hover right above mid-chest.",
            "Pause for half a second at the chest stretch.",
            "Drive upwards through the chest until arms reach near full extension."
          ],
          proTips: [
            "Keep wrists straight above elbows to prevent joint strain.",
            "Engage leg drive by pushing through the floor without lifting glutes."
          ],
          commonMistakes: [
            "Bouncing the weight off the sternum.",
            "Lifting hips off the bench during tough reps."
          ]
        }
      },
      {
        id: "dumbbell-chest-press",
        slug: "dumbbell-chest-press",
        dayId: "chest-day",
        dayName: "Chest Day",
        title: "Dumbbell Chest Press",
        subtitle: "Free-Weight Unilateral Balance & Full ROM",
        primaryMuscles: ["Chest (Pectoralis Major)"],
        secondaryMuscles: ["Triceps", "Front Deltoids", "Core Stabilizers"],
        equipment: "Flat Workout Bench + Pair of Dumbbells",
        betweenExerciseRest: 60,
        generalFormCue: "Bring dumbbells wide for deep stretch, press up and converge slightly at peak.",
        demoImage: "/images/exercises/dumbbell-chest-press.png",
        startPositionImage: "/images/exercises/dumbbell-chest-press-start.png",
        finishPositionImage: "/images/exercises/dumbbell-chest-press-finish.png",
        sets: [
          { setNumber: 1, reps: "12-15 Reps", restSeconds: 45, notes: "Moderate weight grooving movement" },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 45, notes: "Step up the dumbbell weight" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 45, notes: "Heavy clean reps" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 45, notes: "Burnout set with steady tempo" },
        ],
        howToPerform: {
          setup: [
            "Sit on edge of bench, place dumbbells on knees, kick back into flat position.",
            "Rotate wrists so palms face slightly inward at 45 degrees."
          ],
          execution: [
            "Lower dumbbells beside your chest with forearms perpendicular to floor.",
            "Feel a deep, comfortable stretch across both pectorals.",
            "Press weights back up smoothly in a slight arc."
          ],
          proTips: [
            "Do not bang the dumbbells together at the top; keep constant muscle tension.",
            "Maintain slight natural arch in the lower back."
          ],
          commonMistakes: [
            "Flaring elbows excessively wide toward shoulders.",
            "Cutting bottom depth short due to too heavy weight."
          ]
        }
      },
      {
        id: "cable-chest-fly",
        slug: "cable-chest-fly",
        dayId: "chest-day",
        dayName: "Chest Day",
        title: "Cable Chest Fly",
        subtitle: "Continuous Tension Squeeze & Isolation",
        primaryMuscles: ["Sternal Pectorals (Inner Chest Squeeze)"],
        secondaryMuscles: ["Anterior Deltoids"],
        equipment: "Dual Cable Pulley Station",
        betweenExerciseRest: 60,
        generalFormCue: "Maintain fixed elbow bend, bring hands together like hugging a tree, squeeze 1s.",
        demoImage: "/images/exercises/cable-chest-fly.png",
        startPositionImage: "/images/exercises/cable-chest-fly-start.png",
        finishPositionImage: "/images/exercises/cable-chest-fly-finish.png",
        sets: [
          { setNumber: 1, reps: "8-12 Reps", restSeconds: 45, notes: "Feel the stretch and contraction" },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 35, notes: "Maintain 1-second squeeze at the apex" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 35, notes: "Final pump set to complete muscle exhaustion" },
        ],
        howToPerform: {
          setup: [
            "Set pulleys at chest height or slightly above, grip single handles.",
            "Step forward into a staggered stance with chest high and slight forward torso lean."
          ],
          execution: [
            "With arms extended and elbows slightly bent, sweep hands forward in a wide hug arc.",
            "Bring knuckles or palms to touch in front of your chest.",
            "Contract chest hard for a full second, then open slowly."
          ],
          proTips: [
            "Lock your elbow angle throughout the entire rep; do not turn it into a press.",
            "Control the stretch phase completely against cable resistance."
          ],
          commonMistakes: [
            "Letting shoulders roll forward as hands meet.",
            "Using momentum or swinging the torso."
          ]
        }
      }
    ]
  },
  {
    id: "back-day",
    slug: "back-day",
    name: "Back Day",
    tagline: "V-taper lat width, middle back thickness, and spinal stability",
    totalExercises: 4,
    estimatedDuration: "50 - 65 min",
    targetIntensity: "Heavy progressive pulling (RPE 8.5)",
    badge: "Back & Lat Focus",
    exercises: [
      {
        id: "assisted-pull-up",
        slug: "assisted-pull-up",
        dayId: "back-day",
        dayName: "Back Day",
        title: "Assisted Pull-Up",
        subtitle: "Vertical Pulling & Upper Lat Wing Expansion",
        primaryMuscles: ["Latissimus Dorsi", "Teres Major"],
        secondaryMuscles: ["Biceps", "Rhomboids", "Posterior Deltoids"],
        equipment: "Assisted Pull-Up Counterbalance Machine",
        betweenExerciseRest: 60,
        generalFormCue: "Drive elbows down toward waist, lead with chest to bar, avoid swinging.",
        demoImage: "/images/exercises/assisted-pull-up.png",
        startPositionImage: "/images/exercises/assisted-pull-up-start.png",
        finishPositionImage: "/images/exercises/assisted-pull-up-finish.png",
        sets: [
          { setNumber: 1, reps: "8-12 Reps", restSeconds: 40, notes: "Dial in counterbalance weight" },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 45, notes: "Focus on pulling chest toward handles" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 40, notes: "Controlled negatives on last reps" },
        ],
        howToPerform: {
          setup: [
            "Select counter-weight assistance, grip wide neutral or overhand handles.",
            "Kneel or stand onto the assistance pad with core braced and arms fully hung."
          ],
          execution: [
            "Depress your scapulae first, pulling shoulders away from ears.",
            "Drive elbows down and back, lifting upper body until chin clears grip level.",
            "Pause at the top, then lower smoothly over 3 seconds to full hang."
          ],
          proTips: [
            "Do not crunch forward at the top; keep chest proud and arch upper thoracic spine.",
            "Lower completely into a full stretch to activate lower lat insertion."
          ],
          commonMistakes: [
            "Using kicking legs to generate momentum.",
            "Performing half-reps without full extension."
          ]
        }
      },
      {
        id: "single-arm-cable-lat-pulldown",
        slug: "single-arm-cable-lat-pulldown",
        dayId: "back-day",
        dayName: "Back Day",
        title: "Single-Arm Cable Lat Pulldown",
        subtitle: "Unilateral Lower Lat Isolation & Peak Tension",
        primaryMuscles: ["Lower Lats (Iliac Division)"],
        secondaryMuscles: ["Biceps", "Brachialis", "Forearm"],
        equipment: "Cable Machine + D-Handle / Bench",
        betweenExerciseRest: 45,
        generalFormCue: "Feel the overhead stretch, pull elbow tight down to your back pocket.",
        demoImage: "/images/exercises/single-arm-cable-lat-pulldown.png",
        startPositionImage: "/images/exercises/single-arm-cable-lat-pulldown-start.png",
        finishPositionImage: "/images/exercises/single-arm-cable-lat-pulldown-finish.png",
        sets: [
          { setNumber: 1, reps: "12-15 / Arm", restSeconds: 15, notes: "Right arm then left arm, quick swap", isUnilateral: true },
          { setNumber: 2, reps: "12-15 / Arm", restSeconds: 30, notes: "Increase weight slightly", isUnilateral: true },
          { setNumber: 3, reps: "8-12 / Arm", restSeconds: 15, notes: "Heavy unilateral working weight", isUnilateral: true },
          { setNumber: 4, reps: "8-12 / Arm", restSeconds: 30, notes: "Final squeeze at bottom on each arm", isUnilateral: true },
        ],
        howToPerform: {
          setup: [
            "Attach D-handle to high cable pulley, kneel or sit sideways/facing machine.",
            "Grab handle with neutral grip, let arm fully extend upward for a deep stretch."
          ],
          execution: [
            "Initiate by depressing your shoulder blade downward.",
            "Pull elbow down tight along ribcage toward your rear hip pocket.",
            "Hold peak contraction for 1 second, then release slowly back to full overhead stretch."
          ],
          proTips: [
            "Slight side-crunch of torso at peak contraction helps fully shorten the lat.",
            "Keep palm neutral (facing inward) to emphasize lat rather than bicep."
          ],
          commonMistakes: [
            "Rotating the whole torso wildly to heave the cable down.",
            "Restricting the top stretch."
          ]
        }
      },
      {
        id: "bent-over-dumbbell-row",
        slug: "bent-over-dumbbell-row",
        dayId: "back-day",
        dayName: "Back Day",
        title: "Bent-Over Dumbbell Row",
        subtitle: "Mid-Back Thickness, Rhomboids & Rear Delts",
        primaryMuscles: ["Middle Back (Rhomboids, Mid-Traps)"],
        secondaryMuscles: ["Lats", "Rear Delts", "Erector Spinae", "Biceps"],
        equipment: "Pair of Heavy Dumbbells",
        betweenExerciseRest: 60,
        generalFormCue: "Hinge at hips, keep spine neutral, row elbows past ribs and pinch shoulder blades.",
        demoImage: "/images/exercises/bent-over-dumbbell-row.png",
        startPositionImage: "/images/exercises/bent-over-dumbbell-row-start.png",
        finishPositionImage: "/images/exercises/bent-over-dumbbell-row-finish.png",
        sets: [
          { setNumber: 1, reps: "20 Reps", restSeconds: 50, notes: "High volume activation set" },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 40, notes: "Heavy clean rowing form" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 30, notes: "Shorter rest endurance set" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 30, notes: "Final grinding working set" },
        ],
        howToPerform: {
          setup: [
            "Stand with feet shoulder-width, hinge hips backward until torso is at ~45-degree angle.",
            "Hold dumbbells hanging naturally with arms extended, knees softly bent."
          ],
          execution: [
            "Pull dumbbells up toward lower ribcage by driving elbows toward the ceiling.",
            "Squeeze middle back and shoulder blades tightly together at the top.",
            "Lower weights smoothly back down to full hang without rounding back."
          ],
          proTips: [
            "Think of your hands as hooks; pull with your back and elbows, not biceps.",
            "Brace core tightly to protect lumbar spine."
          ],
          commonMistakes: [
            "Rounding lower back like a scared cat.",
            "Standing up too straight as sets get heavy."
          ]
        }
      },
      {
        id: "close-grip-cable-row",
        slug: "close-grip-cable-row",
        dayId: "back-day",
        dayName: "Back Day",
        title: "Close-Grip Cable Row",
        subtitle: "Seated Low Row for Dense Mid-Back Mass",
        primaryMuscles: ["Lats & Mid-Back"],
        secondaryMuscles: ["Biceps", "Posterior Deltoids", "Forearms"],
        equipment: "Seated Cable Row Station + V-Bar Handle",
        betweenExerciseRest: 60,
        generalFormCue: "Keep chest proud, sit tall, row V-grip to navel, hold 1 second pause.",
        demoImage: "/images/exercises/close-grip-cable-row.png",
        startPositionImage: "/images/exercises/close-grip-cable-row-start.png",
        finishPositionImage: "/images/exercises/close-grip-cable-row-finish.png",
        sets: [
          { setNumber: 1, reps: "20 Reps", restSeconds: 45, notes: "Warm-up pump set with full ROM" },
          { setNumber: 2, reps: "12-15 Reps", restSeconds: 45, notes: "Step up the pin weight" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 45, notes: "Heavy strict pulling" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 45, notes: "All-out final set with squeeze" },
        ],
        howToPerform: {
          setup: [
            "Sit on bench with knees slightly flexed, place feet against foot plates.",
            "Grasp V-bar handle, sit up tall with back straight and chest puffed."
          ],
          execution: [
            "Pull handle back toward your lower abdomen/navel.",
            "Drive elbows straight back and flare chest forward into the contraction.",
            "Pause for a full second, then return forward allowing lats to stretch."
          ],
          proTips: [
            "Do not lean back excessively beyond 10-15 degrees.",
            "Maintain controlled return so the weight stack doesn't slam."
          ],
          commonMistakes: [
            "Rocking back and forth vigorously using lower back momentum.",
            "Shrugging shoulders up toward ears during the pull."
          ]
        }
      }
    ]
  },
  {
    id: "shoulder-day",
    slug: "shoulder-day",
    name: "Shoulder Day",
    tagline: "3D lateral deltoid caps, overhead pressing, and posterior chain balance",
    totalExercises: 4,
    estimatedDuration: "50 - 60 min",
    targetIntensity: "High metabolic burn and strict isolation",
    badge: "Deltoid Focus",
    exercises: [
      {
        id: "shoulder-lateral-raise",
        slug: "shoulder-lateral-raise",
        dayId: "shoulder-day",
        dayName: "Shoulder Day",
        title: "Shoulder Lateral Raise",
        subtitle: "Side Deltoid Width & 3D Shoulder Silhouette",
        primaryMuscles: ["Lateral Deltoid (Side Shoulder)"],
        secondaryMuscles: ["Supraspinatus", "Trapezius", "Forearms"],
        equipment: "Pair of Dumbbells or Dual Cables",
        betweenExerciseRest: 45,
        generalFormCue: "Lead with elbows, raise to parallel, pour the pitcher slightly at top.",
        demoImage: "/images/exercises/shoulder-lateral-raise.png",
        startPositionImage: "/images/exercises/shoulder-lateral-raise-start.png",
        finishPositionImage: "/images/exercises/shoulder-lateral-raise-finish.png",
        sets: [
          { setNumber: 1, reps: "20 Reps", restSeconds: 45, notes: "High-rep shoulder flush" },
          { setNumber: 2, reps: "15-20 Reps", restSeconds: 30, notes: "Strict form, no swinging" },
          { setNumber: 3, reps: "15-20 Reps", restSeconds: 30, notes: "Feel the burn in side cap" },
          { setNumber: 4, reps: "12-15 Reps", restSeconds: 30, notes: "Final set to absolute failure" },
        ],
        howToPerform: {
          setup: [
            "Stand tall with feet hip-width apart, holding dumbbells at sides with palms inward.",
            "Keep a slight bend in your knees and a 5-degree forward torso lean."
          ],
          execution: [
            "Raise weights out to sides in a wide arc until arms are parallel with the floor.",
            "Keep pinkies slightly elevated so elbows lead the movement.",
            "Pause briefly at peak shoulder height, then lower with a strict 2-second count."
          ],
          proTips: [
            "Do not shrug your traps up; keep shoulders pushed down away from your neck.",
            "Think of pushing the dumbbells out toward the walls rather than lifting up."
          ],
          commonMistakes: [
            "Swinging hips or knees to fling the dumbbells upward.",
            "Lifting hands higher than elbows (which shifts focus to traps)."
          ]
        }
      },
      {
        id: "dumbbell-shoulder-press",
        slug: "dumbbell-shoulder-press",
        dayId: "shoulder-day",
        dayName: "Shoulder Day",
        title: "Seated Dumbbell Shoulder Press",
        subtitle: "Compound Overhead Pressing for Anterior Deltoid Power",
        primaryMuscles: ["Anterior Deltoid (Front Shoulder)"],
        secondaryMuscles: ["Lateral Deltoid", "Triceps", "Upper Chest"],
        equipment: "Adjustable Incline Bench (set upright ~80°) + Dumbbells",
        betweenExerciseRest: 60,
        generalFormCue: "Press up in a natural arc, avoid slamming dumbbells together, keep abs braced.",
        demoImage: "/images/hero-split.png",
        sets: [
          { setNumber: 1, reps: "12-15 Reps", restSeconds: 45, notes: "Smooth warm-up groove" },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 45, notes: "Heavy working weight" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 45, notes: "Solid controlled tempo" },
          { setNumber: 4, reps: "8-10 Reps", restSeconds: 60, notes: "Heavy final power set" },
        ],
        howToPerform: {
          setup: [
            "Sit on an upright bench with back firmly against pad.",
            "Kick dumbbells to shoulder height, palms facing forward or semi-neutral."
          ],
          execution: [
            "Press overhead smoothly until arms reach full extension without locking elbows.",
            "Lower dumbbells under control until elbows are level with ears (~90 degrees).",
            "Pause momentarily before driving back up."
          ],
          proTips: [
            "Tuck elbows slightly forward (scapular plane ~30 degrees) to protect rotator cuff.",
            "Brace core hard to avoid excessive arching of the lower back."
          ],
          commonMistakes: [
            "Hyperextending lower back off the pad.",
            "Dropping weights too fast and rebounding at the bottom."
          ]
        }
      },
      {
        id: "cable-face-pull",
        slug: "cable-face-pull",
        dayId: "shoulder-day",
        dayName: "Shoulder Day",
        title: "Cable Face Pull",
        subtitle: "Rear Deltoid & External Rotator Health",
        primaryMuscles: ["Rear Deltoids", "Infraspinatus & Teres Minor"],
        secondaryMuscles: ["Rhomboids", "Upper Traps"],
        equipment: "Cable Machine + Rope Attachment",
        betweenExerciseRest: 45,
        generalFormCue: "Set pulley at nose height, pull rope to eyes, pull hands apart at finish.",
        demoImage: "/images/exercises/tricep-pushdown-cable.png",
        sets: [
          { setNumber: 1, reps: "15-20 Reps", restSeconds: 35, notes: "Emphasize rear delt squeeze" },
          { setNumber: 2, reps: "15-20 Reps", restSeconds: 35, notes: "Pull hands wide apart at the face" },
          { setNumber: 3, reps: "15-20 Reps", restSeconds: 35, notes: "Final posture & burn set" },
        ],
        howToPerform: {
          setup: [
            "Attach double-rope handle to cable pulley set at eye level.",
            "Grip rope with thumbs pointing back toward you, step back into stance."
          ],
          execution: [
            "Pull center of rope toward bridge of your nose.",
            "Simultaneously pull hands apart and externally rotate forearms up.",
            "Hold the double-biceps-like contraction for 1 second, then control return."
          ],
          proTips: [
            "Focus on the contraction in the rear shoulder and upper back.",
            "Do not allow head to poke forward to meet the rope."
          ],
          commonMistakes: [
            "Using excessive weight and turning the move into a sloppy row.",
            "Not separating hands at the finish."
          ]
        }
      },
      {
        id: "dumbbell-shrugs",
        slug: "dumbbell-shrugs",
        dayId: "shoulder-day",
        dayName: "Shoulder Day",
        title: "Dumbbell Shrugs",
        subtitle: "Upper Trapezius Elevation & Neck Stability",
        primaryMuscles: ["Upper Trapezius"],
        secondaryMuscles: ["Forearms & Grip", "Levator Scapulae"],
        equipment: "Pair of Heavy Dumbbells",
        betweenExerciseRest: 45,
        generalFormCue: "Shrug straight up to ears, squeeze for 2 seconds at peak, lower under control.",
        demoImage: "/images/hero2.png",
        sets: [
          { setNumber: 1, reps: "15 Reps", restSeconds: 45, notes: "Warm up traps with 2s hold" },
          { setNumber: 2, reps: "12-15 Reps", restSeconds: 45, notes: "Heavy clean shrugging" },
          { setNumber: 3, reps: "10-12 Reps", restSeconds: 45, notes: "Maximum weight with strict pauses" },
        ],
        howToPerform: {
          setup: [
            "Stand tall holding heavy dumbbells at your sides with neutral grip.",
            "Feet shoulder-width apart, chest upright, core engaged."
          ],
          execution: [
            "Elevate shoulders straight up toward ears as high as possible.",
            "Hold peak contraction for 2 full seconds.",
            "Lower slowly back down to full stretch."
          ],
          proTips: [
            "Do not roll your shoulders forward or backward (this causes neck and rotator wear).",
            "Keep head straight and neutral; do not crane neck down."
          ],
          commonMistakes: [
            "Rolling shoulders in circles.",
            "Bending elbows to cheat the weight up."
          ]
        }
      }
    ]
  },
  {
    id: "leg-day",
    slug: "leg-day",
    name: "Leg Day",
    tagline: "Build strong quads, hamstrings, and glutes",
    totalExercises: 7,
    estimatedDuration: "60 - 75 min",
    targetIntensity: "Hard effort (leave 0-1 rep in the tank)",
    badge: "Leg Strength",
    exercises: [
      {
        id: "leg-extensions",
        slug: "leg-extensions",
        dayId: "leg-day",
        dayName: "Leg Day",
        title: "Leg Extensions",
        subtitle: "Front Thighs (Quads) Focus",
        primaryMuscles: ["Front Thighs (Quadriceps)"],
        secondaryMuscles: ["Knee Stabilizers"],
        equipment: "Leg Extension Machine",
        betweenExerciseRest: 75,
        generalFormCue: "Pause at the top for 1 second. Lower the weight slowly under control.",
        demoImage: "/images/exercises/leg-extensions.png",
        sets: [
          { setNumber: 1, reps: "20 Reps", restSeconds: 45, notes: "Warm-up set to get blood flowing" },
          { setNumber: 2, reps: "15-20 Reps", restSeconds: 30, notes: "Short rest pump set" },
          { setNumber: 3, reps: "12-15 Reps", restSeconds: 45, notes: "Add more weight" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 45, notes: "Heavy final set until you cannot do another rep" },
        ],
        howToPerform: {
          setup: [
            "Adjust the back pad so your knees line up with the machine's pivot circle.",
            "Place the lower pad right above your ankles.",
            "Hold the side handles firmly to keep your hips glued to the seat."
          ],
          execution: [
            "Straighten your legs smoothly until your knees are almost fully extended.",
            "Squeeze your front thigh muscles hard at the top for a full 1 second.",
            "Lower the weight slowly over 2-3 seconds back to the start."
          ],
          proTips: [
            "Do not swing your body or kick the weight up with momentum.",
            "Keep your toes pointed slightly up to get the best contraction."
          ],
          commonMistakes: [
            "Lifting hips off the seat when the weight gets heavy.",
            "Letting the weight plates slam down between reps."
          ]
        }
      },
      {
        id: "hamstring-curls",
        slug: "hamstring-curls",
        dayId: "leg-day",
        dayName: "Leg Day",
        title: "Hamstring Curls",
        subtitle: "Back of Thighs (Hamstrings) Focus",
        primaryMuscles: ["Back of Thighs (Hamstrings)"],
        secondaryMuscles: ["Calves", "Glutes"],
        equipment: "Lying or Seated Leg Curl Machine",
        betweenExerciseRest: 60,
        generalFormCue: "Keep your hips flat on the pad. Do not arch your lower back.",
        demoImage: "/images/exercises/hamstring-curls.png",
        sets: [
          { setNumber: 1, reps: "20 Reps", restSeconds: 45, notes: "Warm-up set with full range of motion" },
          { setNumber: 2, reps: "12-15 Reps", restSeconds: 45, notes: "Step up the weight" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 55, notes: "Heavy working set" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 55, notes: "Push hard on every single rep" },
        ],
        howToPerform: {
          setup: [
            "Set the round roller pad to rest right below your calves on your ankles.",
            "Lie flat with your chest on the pad and grip the front handles."
          ],
          execution: [
            "Curl your heels up toward your glutes in a smooth, controlled motion.",
            "Pause for half a second at the top and squeeze the back of your legs.",
            "Lower the weight back down slowly; do not let it drop."
          ],
          proTips: [
            "Keep your toes pointed toward your shins (dorsiflexion) to activate hamstrings better.",
            "Keep your hips pressed down into the bench throughout the entire movement."
          ],
          commonMistakes: [
            "Arching lower back to heave the weight up.",
            "Only moving the weight half-way down."
          ]
        }
      },
      {
        id: "squats",
        slug: "squats",
        dayId: "leg-day",
        dayName: "Leg Day",
        title: "Squats",
        subtitle: "Complete Lower Body Mass Builder",
        primaryMuscles: ["Quadriceps", "Glutes"],
        secondaryMuscles: ["Hamstrings", "Lower Back", "Core"],
        equipment: "Barbell Squat Rack or Smith Machine",
        betweenExerciseRest: 75,
        generalFormCue: "Feet slightly wider than shoulder width. Sit down deep between your hips.",
        demoImage: "/images/exercises/squats.png",
        sets: [
          { setNumber: 1, reps: "20 Reps", restSeconds: 45, notes: "Light warm-up with empty bar or light weight" },
          { setNumber: 2, reps: "12-15 Reps", restSeconds: 45, notes: "Add weight to prepare for working sets" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 60, notes: "Heavy working set with strict form" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 60, notes: "Maximum effort final set" },
        ],
        howToPerform: {
          setup: [
            "Set bar at collarbone height. Step under and rest bar securely on upper back traps.",
            "Grip the bar tightly, unrack, and take two small steps back.",
            "Set feet slightly wider than shoulder width, with toes pointed out 15-30 degrees."
          ],
          execution: [
            "Take a deep breath into your belly and brace your core like preparing for a punch.",
            "Bend knees and hips at the same time, sitting down until thighs are parallel to floor.",
            "Drive through your whole foot (heel and mid-foot) to stand back up powerfully."
          ],
          proTips: [
            "Keep your chest proud and eyes looking forward, not down at your feet.",
            "Push your knees outward in the direction your toes are pointing."
          ],
          commonMistakes: [
            "Letting knees cave inward during the ascent.",
            "Rounds in lower back at the bottom of the squat."
          ]
        }
      },
      {
        id: "inner-hip-abductions",
        slug: "inner-hip-abductions",
        dayId: "leg-day",
        dayName: "Leg Day",
        title: "Inner Hip Abductions (Adductors)",
        subtitle: "Inner Thigh Strength & Pelvis Stability",
        primaryMuscles: ["Inner Thighs (Hip Adductors)"],
        secondaryMuscles: ["Groin", "Lower Core"],
        equipment: "Seated Adductor Machine",
        betweenExerciseRest: 45,
        generalFormCue: "Squeeze knees inward together smoothly. Hold for 1 second at the touch.",
        demoImage: "/images/exercises/inner-hip-abductions.png",
        sets: [
          { setNumber: 1, reps: "15-20 Reps", restSeconds: 30, notes: "Light weight to warm up inner thigh muscles" },
          { setNumber: 2, reps: "15-20 Reps", restSeconds: 30, notes: "Controlled smooth speed" },
          { setNumber: 3, reps: "15-20 Reps", restSeconds: 30, notes: "Hold each rep for 1 full second at the center" },
          { setNumber: 4, reps: "12-15 Reps", restSeconds: 30, notes: "Heavy final pump set" },
        ],
        howToPerform: {
          setup: [
            "Sit with back flat against backrest. Open the pads wide to a comfortable stretch.",
            "Place your inner knees against the padded arm rests."
          ],
          execution: [
            "Squeeze your legs inward together against the resistance until pads touch.",
            "Hold the pads together tightly for 1 second to maximize inner thigh contraction.",
            "Slowly open legs back to the starting stretch position over 2 seconds."
          ],
          proTips: [
            "Do not let the weight stack slam between reps.",
            "Sit tall with your spine neutral; avoid leaning too far forward."
          ],
          commonMistakes: [
            "Using momentum or bouncing legs inward.",
            "Setting the start position too wide causing groin discomfort."
          ]
        }
      },
      {
        id: "outer-hip-abductions",
        slug: "outer-hip-abductions",
        dayId: "leg-day",
        dayName: "Leg Day",
        title: "Outer Hip Abductions (Glutes)",
        subtitle: "Side Glutes & Hip Stability Focus",
        primaryMuscles: ["Outer Glutes (Gluteus Medius & Minimus)"],
        secondaryMuscles: ["Tensor Fasciae Latae (TFL)"],
        equipment: "Seated Abductor Machine",
        betweenExerciseRest: 45,
        generalFormCue: "Push knees outward as wide as possible. Squeeze the side of your hips.",
        demoImage: "/images/exercises/outer-hip-abductions.png",
        sets: [
          { setNumber: 1, reps: "15-20 Reps", restSeconds: 30, notes: "Moderate warm-up set" },
          { setNumber: 2, reps: "15-20 Reps", restSeconds: 30, notes: "Keep tension on the outer glutes" },
          { setNumber: 3, reps: "15-20 Reps", restSeconds: 30, notes: "Pause for 1 second at maximum width" },
          { setNumber: 4, reps: "12-15 Reps", restSeconds: 30, notes: "Burnout set with heavy weight" },
        ],
        howToPerform: {
          setup: [
            "Adjust pads so they rest on the outside of your knees.",
            "Sit back firmly in the seat and grip the side handles."
          ],
          execution: [
            "Push your knees apart as wide as possible against the pads.",
            "Hold the wide position for 1 second and feel your side glutes fire.",
            "Allow legs to come back together slowly under full control."
          ],
          proTips: [
            "Leaning slightly forward from your hips can increase glute activation.",
            "Focus on pushing through your knees, not just your feet."
          ],
          commonMistakes: [
            "Letting knees snap inward quickly on the return.",
            "Only opening half way."
          ]
        }
      },
      {
        id: "lunges",
        slug: "lunges",
        dayId: "leg-day",
        dayName: "Leg Day",
        title: "Walking or Stationary Lunges",
        subtitle: "Unilateral Balance, Glute & Quad Development",
        primaryMuscles: ["Quadriceps", "Glutes"],
        secondaryMuscles: ["Hamstrings", "Calves", "Core"],
        equipment: "Pair of Dumbbells or Bodyweight",
        betweenExerciseRest: 60,
        generalFormCue: "Step forward into a deep bend. Front knee stays over front ankle.",
        demoImage: "/images/exercises/lunges.png",
        sets: [
          { setNumber: 1, reps: "8-12 Reps / Leg", restSeconds: 45, notes: "Moderate weight stepping smoothly", isUnilateral: true },
          { setNumber: 2, reps: "8-12 Reps / Leg", restSeconds: 45, notes: "Keep chest tall and balance steady", isUnilateral: true },
          { setNumber: 3, reps: "8-12 Reps / Leg", restSeconds: 45, notes: "Deep back knee drop on every rep", isUnilateral: true },
          { setNumber: 4, reps: "8-12 Reps / Leg", restSeconds: 45, notes: "Final grinding burnout set", isUnilateral: true },
        ],
        howToPerform: {
          setup: [
            "Stand tall holding dumbbells at your sides with arms relaxed.",
            "Engage your abs and keep your head and chest upright."
          ],
          execution: [
            "Take a big step forward with one leg.",
            "Lower hips until your front thigh is parallel to floor and back knee hovers 1 inch above ground.",
            "Push through your front heel to stand back up or step into the next stride."
          ],
          proTips: [
            "Keep torso upright; do not fold forward over your front thigh.",
            "Keep your front knee tracking in line with your second toe."
          ],
          commonMistakes: [
            "Taking too short of a step, putting excessive pressure on the front knee.",
            "Banging the back knee into the hard floor."
          ]
        }
      },
      {
        id: "inverted-leg-press",
        slug: "inverted-leg-press",
        dayId: "leg-day",
        dayName: "Leg Day",
        title: "Inverted / 45° Leg Press",
        subtitle: "Heavy Compound Lower Body Loading",
        primaryMuscles: ["Quadriceps", "Glutes"],
        secondaryMuscles: ["Hamstrings", "Calves"],
        equipment: "45-Degree Leg Press Machine",
        betweenExerciseRest: 75,
        generalFormCue: "Lower the platform deep without letting your lower back peel off the pad.",
        demoImage: "/images/exercises/inverted-leg-press.png",
        sets: [
          { setNumber: 1, reps: "20 Reps", restSeconds: 45, notes: "Warm-up set with smooth tempo" },
          { setNumber: 2, reps: "15 Reps", restSeconds: 45, notes: "Add 45lb plates" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 60, notes: "Heavy working set" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 60, notes: "Final heavy set - full depth" },
        ],
        howToPerform: {
          setup: [
            "Sit in the seat with your back and hips firmly pressed against the support pads.",
            "Place feet shoulder-width apart in the center of the sled platform.",
            "Release safety handles while holding side handles firmly."
          ],
          execution: [
            "Lower the weight sled toward you until your knees bend to roughly 90 degrees.",
            "Make sure your tailbone stays glued to the seat at the bottom.",
            "Press the platform back up through mid-foot and heels without locking knees."
          ],
          proTips: [
            "Never lock your knees aggressively at the top of the movement.",
            "Keep hands firmly on the side handles to keep your hips seated."
          ],
          commonMistakes: [
            "Allowing lower back to curl off the pad at deep flexion.",
            "Placing feet too low on platform, causing excessive knee shear."
          ]
        }
      }
    ]
  },
  {
    id: "arm-day",
    slug: "arm-day",
    name: "Arm Day",
    tagline: "Build sleeve-filling biceps, brachialis, and tricep mass",
    totalExercises: 6,
    estimatedDuration: "55 - 65 min",
    targetIntensity: "High pump & burn (RPE 8.5)",
    badge: "Arm Hypertrophy",
    exercises: [
      {
        id: "preacher-curl",
        slug: "preacher-curl",
        dayId: "arm-day",
        dayName: "Arm Day",
        title: "Preacher Curl",
        subtitle: "Bicep Peak & Short Head Isolation",
        primaryMuscles: ["Biceps Brachii (Short Head)"],
        secondaryMuscles: ["Brachialis", "Forearms"],
        equipment: "Preacher Bench + EZ-Curl Bar or Dumbbells",
        betweenExerciseRest: 60,
        generalFormCue: "Armpits locked over top of pad. Control down all the way, squeeze at top.",
        demoImage: "/images/exercises/preacher-curl.png",
        sets: [
          { setNumber: 1, reps: "20 Reps", restSeconds: 45, notes: "Warm-up set with light weight" },
          { setNumber: 2, reps: "12-15 Reps", restSeconds: 45, notes: "Step up the weight" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 45, notes: "Heavy working set with smooth control" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 45, notes: "Final burnout set to failure" },
        ],
        howToPerform: {
          setup: [
            "Adjust seat height so your armpits rest comfortably over the top edge of the pad.",
            "Rest your triceps flat against the slanted pad.",
            "Grasp the EZ-bar with an underhand grip on the angled inner bends."
          ],
          execution: [
            "Curl the bar upward toward your chin by contracting your biceps.",
            "Squeeze hard at the top position for half a second.",
            "Lower the bar slowly under control until arms are almost fully extended."
          ],
          proTips: [
            "Do not lift your upper body or chest off the pad to swing the bar.",
            "Keep wrists straight or slightly flexed, not bent back."
          ],
          commonMistakes: [
            "Hyperextending and violently snapping elbows at bottom.",
            "Resting the bar at the top instead of keeping constant tension."
          ]
        }
      },
      {
        id: "standing-barbell-curl",
        slug: "standing-barbell-curl",
        dayId: "arm-day",
        dayName: "Arm Day",
        title: "Standing Barbell Curl",
        subtitle: "Heavy Compound Mass for Full Bicep Belly",
        primaryMuscles: ["Biceps Brachii (Long & Short Heads)"],
        secondaryMuscles: ["Forearms", "Core"],
        equipment: "Olympic Straight Bar or EZ Bar",
        betweenExerciseRest: 60,
        generalFormCue: "Pin elbows at your sides. No rocking or swinging back and forth.",
        demoImage: "/images/exercises/standing-barbell-curl.png",
        sets: [
          { setNumber: 1, reps: "15-20 Reps", restSeconds: 30, notes: "Strict pump set with no body momentum" },
          { setNumber: 2, reps: "15-20 Reps", restSeconds: 30, notes: "Keep elbows glued to your ribs" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 45, notes: "Heavy set with slow 3-second negative" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 45, notes: "Finish every rep with full bicep squeeze" },
        ],
        howToPerform: {
          setup: [
            "Stand tall with feet shoulder-width apart, holding barbell at shoulder-width underhand grip.",
            "Pull shoulders back and pin your elbows lightly into your waist."
          ],
          execution: [
            "Curl the barbell upward while keeping elbows completely motionless.",
            "Bring the bar up to collarbone height and squeeze biceps aggressively.",
            "Lower the bar slowly back to full hang over 2 to 3 seconds."
          ],
          proTips: [
            "Brace your glutes and abs tightly to avoid leaning backward.",
            "Do not let your elbows drift forward more than 1-2 inches."
          ],
          commonMistakes: [
            "Swinging hips or knees to cheat the weight up.",
            "Dropping the bar down quickly with no eccentric resistance."
          ]
        }
      },
      {
        id: "combined-bicep-hammer-curl",
        slug: "combined-bicep-hammer-curl",
        dayId: "arm-day",
        dayName: "Arm Day",
        title: "Combined Bicep & Hammer Curls",
        subtitle: "Bicep Peak Plus Outer Arm (Brachialis) Thickness",
        primaryMuscles: ["Brachialis", "Brachioradialis", "Biceps"],
        secondaryMuscles: ["Forearms & Grip"],
        equipment: "Pair of Medium/Heavy Dumbbells",
        betweenExerciseRest: 60,
        generalFormCue: "Neutral grip with palms facing each other. Squeeze outer forearm at top.",
        demoImage: "/images/exercises/combined-bicep-hammer-curl.png",
        sets: [
          { setNumber: 1, reps: "12-15 Reps", restSeconds: 45, notes: "Standard underhand curl immediately into hammer curl" },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 45, notes: "Heavy dumbbells, strict control" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 45, notes: "Feel the brachialis on the side of the arm" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 45, notes: "Final grinding combination set" },
        ],
        howToPerform: {
          setup: [
            "Stand tall holding dumbbells with palms facing each other (neutral grip).",
            "Keep feet grounded, chest up, and shoulders packed down."
          ],
          execution: [
            "Perform standard curls rotating palms up, then switch to hammer curls (palms facing inward).",
            "Lift dumbbell straight up toward your front shoulder like swinging a hammer.",
            "Pause at the top for a squeeze, then lower with total control."
          ],
          proTips: [
            "Hammer grip targets the brachialis, which pushes your bicep up higher.",
            "Keep wrists rigid and locked; do not bend wrists upward."
          ],
          commonMistakes: [
            "Swinging weights out wide away from the body.",
            "Using momentum from shoulders."
          ]
        }
      },
      {
        id: "tricep-pushdown-cable",
        slug: "tricep-pushdown-cable",
        dayId: "arm-day",
        dayName: "Arm Day",
        title: "Tricep Pushdown (Straight Bar or V-Bar)",
        subtitle: "Tricep Lateral & Medial Head Focus",
        primaryMuscles: ["Triceps (Lateral Head)"],
        secondaryMuscles: ["Triceps (Medial Head)", "Forearms"],
        equipment: "Cable Station + Straight Bar or V-Bar Attachment",
        betweenExerciseRest: 45,
        generalFormCue: "Pin upper arms to your sides. Lock out completely at the bottom and squeeze.",
        demoImage: "/images/exercises/tricep-pushdown-cable.png",
        sets: [
          { setNumber: 1, reps: "20 Reps", restSeconds: 30, notes: "Warm-up pump set to lubricate elbow joints" },
          { setNumber: 2, reps: "15-20 Reps", restSeconds: 30, notes: "Short rest speed set" },
          { setNumber: 3, reps: "15-20 Reps", restSeconds: 30, notes: "Hold lockout for 1 full second" },
          { setNumber: 4, reps: "12-15 Reps", restSeconds: 30, notes: "Heavy final burnout set" },
        ],
        howToPerform: {
          setup: [
            "Clip straight bar or V-bar to high cable pulley.",
            "Grip bar with overhand grip, step close, and lean slightly forward (5-10 degrees).",
            "Glue your elbows tight to your sides at roughly 90 degrees."
          ],
          execution: [
            "Push the bar straight down by extending elbows until arms are completely straight.",
            "Squeeze triceps as hard as possible at the bottom lockout for 1 second.",
            "Allow bar to rise slowly back up to chest height while elbows stay pinned."
          ],
          proTips: [
            "Do not let your elbows flare out or drift forward as the weight goes up.",
            "Keep wrists stiff and locked straight with your forearms."
          ],
          commonMistakes: [
            "Leaning heavily over the bar and using chest weight to push it down.",
            "Stopping reps short before full elbow lockout."
          ]
        }
      },
      {
        id: "single-arm-skull-crushers",
        slug: "single-arm-skull-crushers",
        dayId: "arm-day",
        dayName: "Arm Day",
        title: "Single Arm Skull Crushers",
        subtitle: "One-Arm Dumbbell Tricep Extension on Bench",
        primaryMuscles: ["Triceps (Long Head)"],
        secondaryMuscles: ["Shoulder Stabilizers"],
        equipment: "Flat Workout Bench + 1 Dumbbell",
        betweenExerciseRest: 45,
        generalFormCue: "Keep upper arm still, angled slightly back. Bend only at the elbow.",
        demoImage: "/images/exercises/single-arm-skull-crushers.png",
        sets: [
          { setNumber: 1, reps: "8-12 Reps", restSeconds: 30, notes: "Right arm then left arm", isUnilateral: true },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 30, notes: "Right arm then left arm", isUnilateral: true },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 30, notes: "Right arm then left arm", isUnilateral: true },
        ],
        howToPerform: {
          setup: [
            "Lie flat on a bench holding one dumbbell in your hand pointing straight up.",
            "Tilt your upper arm back slightly (about 10 degrees behind vertical) to keep constant tension on the tricep."
          ],
          execution: [
            "Bend only at your elbow, lowering the dumbbell down past the side of your ear.",
            "Keep your upper arm completely still like a pillar.",
            "Extend your arm back up to the starting position and squeeze your tricep.",
            "Finish reps on one arm, then switch immediately to the other arm."
          ],
          proTips: [
            "You can place your free hand lightly on your working elbow to help keep it steady.",
            "Lower the dumbbell with full control; do not rush the movement."
          ],
          commonMistakes: [
            "Flaring your elbow out wide to the side.",
            "Moving your whole upper arm instead of hinging only at the elbow."
          ]
        }
      },
      {
        id: "double-arm-overhead-extension",
        slug: "double-arm-overhead-extension",
        dayId: "arm-day",
        dayName: "Arm Day",
        title: "Double Arm Overhead Dumbbell Tricep Extensions",
        subtitle: "Deep Overhead Stretch for Maximum Tricep Growth",
        primaryMuscles: ["Triceps (Deep Stretch)"],
        secondaryMuscles: ["Upper Back & Core"],
        equipment: "1 Heavy Dumbbell + Bench or Standing",
        betweenExerciseRest: 60,
        generalFormCue: "Hold dumbbell overhead with both hands. Lower deep behind your neck for a full stretch.",
        demoImage: "/images/exercises/double-arm-overhead-extension.png",
        sets: [
          { setNumber: 1, reps: "7-12 Reps", restSeconds: 45, notes: "Feel the deep stretch at the bottom" },
          { setNumber: 2, reps: "7-12 Reps", restSeconds: 45, notes: "Smooth press to the ceiling" },
          { setNumber: 3, reps: "7-12 Reps", restSeconds: 45, notes: "Heavy loading with clean form" },
          { setNumber: 4, reps: "7-12 Reps", restSeconds: 45, notes: "Final grinding burnout set" },
        ],
        howToPerform: {
          setup: [
            "Sit on a bench with back support or stand tall with your core braced.",
            "Press a dumbbell overhead holding the top plate with both hands cupped in a diamond shape."
          ],
          execution: [
            "Lower the dumbbell behind your head by bending only at your elbows.",
            "Feel a deep, comfortable stretch in the back of your arms at the bottom position.",
            "Press the dumbbell back up overhead until your arms are straight."
          ],
          proTips: [
            "Keep your elbows pointed forward rather than letting them flare wide.",
            "Brace your abs so your lower back does not arch excessively."
          ],
          commonMistakes: [
            "Flaring elbows excessively wide, which strains the shoulders.",
            "Short-changing the bottom stretch."
          ]
        }
      }
    ]
  }
];

// -------------------------------------------------------------
// PRE-WORKOUT STRETCHES (Dynamic Mobility & Preparation)
// -------------------------------------------------------------
export const PRE_WORKOUT_STRETCHES: StretchItem[] = [
  {
    id: "dynamic-arm-swings",
    name: "Dynamic Arm Swings & Chest Openers",
    targetArea: "Chest, Shoulders & Upper Back",
    durationOrReps: "15 reps / 45 seconds",
    instruction: "Swing arms horizontally across chest, alternating which arm crosses over top. Open arms wide to feel a dynamic stretch across pectorals.",
    type: "dynamic"
  },
  {
    id: "leg-swings-front-lateral",
    name: "Leg Swings (Front-to-Back & Lateral)",
    targetArea: "Hamstrings, Quads, Hip Flexors & Adductors",
    durationOrReps: "12 reps per leg / 60 seconds",
    instruction: "Hold a wall or post for balance. Swing one leg smoothly forward and backward, then swing side-to-side across your body.",
    type: "dynamic"
  },
  {
    id: "worlds-greatest-stretch",
    name: "World's Greatest Stretch (Lunge + Thoracic Reach)",
    targetArea: "Hips, Groin, Hamstrings, Thoracic Spine",
    durationOrReps: "5 reps per side / 60 seconds",
    instruction: "Step forward into a deep lunge. Place hands on floor inside front foot, then reach your inside arm up toward the ceiling with torso rotation.",
    type: "dynamic"
  },
  {
    id: "cat-cow-mobility",
    name: "Cat-Cow Spinal Decompression",
    targetArea: "Entire Spine, Core & Pelvis",
    durationOrReps: "10 slow cycles / 45 seconds",
    instruction: "On hands and knees, inhale as you drop your belly and lift your chest/gaze (Cow). Exhale as you arch your spine to ceiling and tuck chin (Cat).",
    type: "dynamic"
  },
  {
    id: "shoulder-band-dislocates",
    name: "Shoulder Band / PVC Pass-Throughs",
    targetArea: "Shoulder Girdle & Rotator Cuff",
    durationOrReps: "12 - 15 smooth passes",
    instruction: "Grip a resistance band or PVC pipe with wide grip. Keeping arms straight, rotate smoothly up, overhead, and behind your back.",
    type: "dynamic"
  }
];

// -------------------------------------------------------------
// POST-WORKOUT STRETCHES (Static Flexibility & Recovery)
// -------------------------------------------------------------
export const POST_WORKOUT_STRETCHES: StretchItem[] = [
  {
    id: "doorway-chest-stretch",
    name: "Doorway Pec & Bicep Stretch",
    targetArea: "Pectoralis Major & Biceps",
    durationOrReps: "35 - 45 seconds per side",
    instruction: "Place forearm and elbow against a doorframe at 90 degrees. Step forward gently until you feel a deep stretch across chest and shoulder.",
    type: "static"
  },
  {
    id: "kneeling-quad-hip-flexor",
    name: "Kneeling Quad & Hip Flexor Stretch",
    targetArea: "Quadriceps & Psoas",
    durationOrReps: "40 - 50 seconds per leg",
    instruction: "Kneel on one knee with other foot planted forward. Tuck tailbone under and lean hips slightly forward until front thigh stretches deeply.",
    type: "static"
  },
  {
    id: "single-leg-hamstring-stretch",
    name: "Single-Leg Hamstring Stretch",
    targetArea: "Hamstrings & Calves",
    durationOrReps: "35 - 45 seconds per leg",
    instruction: "Place one heel on an elevated step or bench with knee straight and foot flexed. Hinge forward from hips with a flat back.",
    type: "static"
  },
  {
    id: "pigeon-glute-stretch",
    name: "Pigeon Pose / Glute Stretch",
    targetArea: "Glutes & Piriformis",
    durationOrReps: "45 - 60 seconds per side",
    instruction: "From push-up position, bring right knee behind right wrist with shin angled across mat. Lower hips toward floor and breathe deeply.",
    type: "static"
  },
  {
    id: "overhead-tricep-lat-stretch",
    name: "Overhead Tricep & Lat Stretch",
    targetArea: "Triceps Long Head & Latissimus",
    durationOrReps: "30 - 45 seconds per arm",
    instruction: "Reach one arm overhead and bend elbow so hand drops behind neck. Use opposite hand to gently pull elbow back and inward.",
    type: "static"
  },
  {
    id: "childs-pose-lat-reach",
    name: "Child's Pose with Lateral Reach",
    targetArea: "Lower Back, Lats & Hips",
    durationOrReps: "60 seconds hold",
    instruction: "Kneel and sit back onto heels, extending arms out forward on the floor. Walk hands to the right side to stretch left lat, then switch.",
    type: "static"
  }
];

// -------------------------------------------------------------
// 20-MINUTE CARDIO PROTOCOL (Consistent Every Workout Day)
// -------------------------------------------------------------
export const CARDIO_PROTOCOL: CardioProtocol = {
  durationMinutes: 20,
  preferredActivity: "StairMaster (Stepmill)",
  preferredActivityDetails: "Continuous stepping at steady moderate-high effort. Keep hands lightly resting for safety without leaning heavy bodyweight onto handrails.",
  alternativeActivities: [
    {
      name: "Incline Treadmill Walk",
      setting: "12% - 15% Incline @ 3.0 - 3.5 MPH",
      benefit: "Zero joint impact on knees, heavy glute & calf burn, high caloric burn."
    },
    {
      name: "Assault AirBike",
      setting: "Steady aerobic pace (50-60 RPM)",
      benefit: "Full-body cardio involving upper pushing/pulling and lower drive."
    },
    {
      name: "Rowing Machine (Ergometer)",
      setting: "Damper 4-6, steady 22-26 strokes/min",
      benefit: "Posterior chain recruitment and cardiovascular endurance."
    },
    {
      name: "Outdoor / Track Tempo Jog",
      setting: "Zone 2 - Zone 3 conversational pace",
      benefit: "Classic aerobic baseline conditioning and mental refresh."
    }
  ],
  intensityCue: "Maintain a steady moderate-to-high intensity (Zone 2 - Zone 3, roughly 65-75% max HR) where talking in full sentences becomes difficult. Any fairly intense 20-minute cardio can be used as an alternative.",
  targetHeartRateZone: "130 - 155 BPM (depending on age & conditioning)"
};

// -------------------------------------------------------------
// DEDICATED ABS ROUTINE (Alternating Workout Days)
// -------------------------------------------------------------
export const ABS_ROUTINE: FinisherRoutine = {
  type: "abs",
  title: "Dedicated Abs Protocol",
  badge: "Core Hypertrophy",
  tagline: "Trunk stability, deep rectus abdominis, and serratus development",
  description: "Performs on alternating workout days (Day 1, Day 3, Day 5, etc.). High focus on abdominal flexion under controlled tension rather than neck pull.",
  frequencyRule: "Alternates with Calves across workout days (Day 1 = Abs, Day 2 = Calves, Day 3 = Abs, Day 4 = Calves)",
  exercises: [
    {
      id: "hanging-leg-raises",
      name: "Hanging or Captain's Chair Leg Raises",
      targetMuscle: "Lower Abdominals & Hip Flexors",
      sets: 3,
      reps: "12 - 15 Reps",
      restSeconds: 45,
      cue: "Roll your pelvis upward toward your sternum; don't just swing your legs with momentum.",
      notes: "Can be done on a pull-up bar hanging or in the captain's chair with forearm supports."
    },
    {
      id: "kneeling-cable-crunch",
      name: "Kneeling Cable Crunches",
      targetMuscle: "Rectus Abdominis (Upper & Mid Core)",
      sets: 3,
      reps: "15 - 20 Reps",
      restSeconds: 45,
      cue: "Hold rope handles by your ears. Curl your ribcage down toward your knees like a shrimp.",
      notes: "Keep your hips high and still; isolate movement to the spine curling."
    },
    {
      id: "ab-wheel-rollouts",
      name: "Ab Wheel Rollouts / Weighted Plank",
      targetMuscle: "Transverse Abdominis & Deep Core Wall",
      sets: 3,
      reps: "10 - 12 Reps or 60s Hold",
      restSeconds: 45,
      cue: "Maintain slight posterior pelvic tilt. Roll forward only as far as you can control without sagging back.",
      notes: "If ab wheel is unavailable, substitute with a 60-second strict front elbow plank."
    }
  ]
};

// -------------------------------------------------------------
// DEDICATED CALVES ROUTINE (Alternating Workout Days)
// -------------------------------------------------------------
export const CALVES_ROUTINE: FinisherRoutine = {
  type: "calves",
  title: "Dedicated Calf Raises Protocol",
  badge: "Calf Hypertrophy",
  tagline: "Gastrocnemius and soleus development with deep stretch and peak squeeze",
  description: "Performs on alternating workout days (Day 2, Day 4, Day 6, etc.). Calves require a full 2-second pause at the bottom stretch to eliminate Achilles tendon rebound.",
  frequencyRule: "Alternates with Abs across workout days (Day 1 = Abs, Day 2 = Calves, Day 3 = Abs, Day 4 = Calves)",
  exercises: [
    {
      id: "standing-calf-raises",
      name: "Standing Machine Calf Raises",
      targetMuscle: "Gastrocnemius (Diamond Calf Peak)",
      sets: 4,
      reps: "15 - 20 Reps",
      restSeconds: 45,
      cue: "Lower heels deep below platform for 2s pause. Drive up onto big toes and squeeze hard for 1s.",
      notes: "Zero bouncing. The bottom stretch is where muscle micro-tears stimulate new growth."
    },
    {
      id: "seated-calf-raises",
      name: "Seated Calf Raise Machine",
      targetMuscle: "Soleus (Deep Lower Calf Width)",
      sets: 3,
      reps: "12 - 15 Reps",
      restSeconds: 45,
      cue: "Knees bent at 90 degrees isolate the soleus muscle. Smooth tempo with full range of motion.",
      notes: "Adjust pad comfortably over lower thighs right above knees."
    },
    {
      id: "single-leg-bodyweight-elevated-raises",
      name: "Single-Leg Elevated Dumbbell Calf Raise",
      targetMuscle: "Calf Stabilizers & Unilateral Symmetry",
      sets: 3,
      reps: "15 Reps / Leg",
      restSeconds: 30,
      cue: "Hold 1 dumbbell in working side hand. Stand on edge of plate or step. Full extension.",
      notes: "Switch legs with no rest between sides to maintain high metabolic density."
    }
  ]
};

// -------------------------------------------------------------
// FULL MONTH (28-DAY) REUSABLE SCHEDULE GENERATOR
// -------------------------------------------------------------
// Maintains the client requirement:
// Workout 1 = Abs
// Workout 2 = Calves
// Workout 3 = Abs
// Workout 4 = Calves
// Continuous rotation throughout all scheduled workouts!
// -------------------------------------------------------------
const SPLIT_SEQUENCE: { splitId: WorkoutDay["id"]; splitName: string; focus: string }[] = [
  { splitId: "chest-day", splitName: "Chest Day", focus: "Upper, Mid & Lower Pectorals" },
  { splitId: "back-day", splitName: "Back Day", focus: "V-Taper Lats & Mid-Back Thickness" },
  { splitId: "shoulder-day", splitName: "Shoulder Day", focus: "3D Deltoid Caps & Posture" },
  { splitId: "leg-day", splitName: "Leg Day", focus: "Quads, Hamstrings & Glutes" },
  { splitId: "arm-day", splitName: "Arm Day", focus: "Biceps, Brachialis & Triceps" },
];

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function generateMonthWorkoutSchedule(totalDays: number = 28): ScheduledWorkoutDay[] {
  const schedule: ScheduledWorkoutDay[] = [];
  let workoutCounter = 0; // Tracks actual training workouts (1, 2, 3...)
  let splitIndex = 0;

  for (let day = 1; day <= totalDays; day++) {
    const dayOfWeekIndex = (day - 1) % 7;
    const dayOfWeek = DAYS_OF_WEEK[dayOfWeekIndex];

    // Schedule 5 training days (Mon-Fri) and 2 rest days (Sat-Sun) or continuous
    const isRest = dayOfWeek === "Saturday" || dayOfWeek === "Sunday";

    if (isRest) {
      schedule.push({
        workoutNumber: 0,
        dayOfWeek,
        dayName: `Day ${day}`,
        splitId: "rest" as any,
        splitName: "Active Recovery & Mobility",
        focus: "Rest, 20-min gentle walk or foam rolling",
        coreOrCalf: "none",
        cardioMinutes: 20,
        isRest: true
      });
    } else {
      workoutCounter += 1;
      const split = SPLIT_SEQUENCE[splitIndex % SPLIT_SEQUENCE.length];
      splitIndex += 1;

      // Exact client requirement:
      // Workout 1 = Abs
      // Workout 2 = Calves
      // Workout 3 = Abs
      // Workout 4 = Calves
      const coreOrCalf: "abs" | "calves" = workoutCounter % 2 === 1 ? "abs" : "calves";

      schedule.push({
        workoutNumber: workoutCounter,
        dayOfWeek,
        dayName: `Day ${day}`,
        splitId: split.splitId,
        splitName: split.splitName,
        focus: split.focus,
        coreOrCalf,
        cardioMinutes: 20,
        isRest: false
      });
    }
  }

  return schedule;
}

export const FULL_MONTH_SCHEDULE = generateMonthWorkoutSchedule(28);

// -------------------------------------------------------------
// HELPER QUERY FUNCTIONS
// -------------------------------------------------------------
export function getAllExercises(): Exercise[] {
  return WORKOUT_DAYS.flatMap((day) => day.exercises);
}

export function getExerciseBySlug(slug: string): Exercise | undefined {
  return getAllExercises().find((ex) => ex.slug === slug || ex.id === slug);
}

export function getWorkoutDayById(id: string): WorkoutDay | undefined {
  return WORKOUT_DAYS.find((day) => day.id === id || day.slug === id);
}

export function getFinisherRoutineForWorkout(workoutNumber: number): FinisherRoutine {
  // Odd workout number = Abs, Even workout number = Calves
  return workoutNumber % 2 === 1 ? ABS_ROUTINE : CALVES_ROUTINE;
}

export function getAdjacentExercises(currentSlug: string): { prev: Exercise | null; next: Exercise | null } {
  const all = getAllExercises();
  const index = all.findIndex((ex) => ex.slug === currentSlug || ex.id === currentSlug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}
