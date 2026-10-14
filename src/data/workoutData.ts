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
  dayId: "leg-day" | "arm-day";
  dayName: string;
  title: string;
  subtitle: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  betweenExerciseRest: number; // in seconds
  generalFormCue: string;
  demoImage: string;
  sets: ExerciseSet[];
  howToPerform: {
    setup: string[];
    execution: string[];
    proTips: string[];
    commonMistakes: string[];
  };
}

export interface WorkoutDay {
  id: "leg-day" | "arm-day";
  slug: string;
  name: string;
  tagline: string;
  totalExercises: number;
  estimatedDuration: string;
  targetIntensity: string;
  badge: string;
  exercises: Exercise[];
}

export const WORKOUT_DAYS: WorkoutDay[] = [
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
            "Slowly lower the weight until your legs are nearly straight."
          ],
          proTips: [
            "Pull your toes up toward your shins during the curl for a deeper burn.",
            "Keep your stomach and hips pressed into the bench the whole time."
          ],
          commonMistakes: [
            "Arching your lower back to yank the weight up.",
            "Stopping halfway instead of getting a full curl."
          ]
        }
      },
      {
        id: "squats",
        slug: "squats",
        dayId: "leg-day",
        dayName: "Leg Day",
        title: "Squats",
        subtitle: "Full Lower Body & Core Power",
        primaryMuscles: ["Quads", "Glutes"],
        secondaryMuscles: ["Hamstrings", "Lower Back", "Core"],
        equipment: "Barbell / Squat Rack / Smith Machine",
        betweenExerciseRest: 90,
        generalFormCue: "Brace your core tight, keep chest up, and squat down until thighs are parallel to floor.",
        demoImage: "/images/exercises/squats.png",
        sets: [
          { setNumber: 1, reps: "8-12 Reps", restSeconds: 60, notes: "Moderate weight to check form" },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 60, notes: "Solid rhythm and depth" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 60, notes: "Heavy working set" },
          { setNumber: 4, reps: "15 Reps", restSeconds: 60, notes: "Finisher set with high reps and pure focus" },
        ],
        howToPerform: {
          setup: [
            "Rest the bar securely across your upper back muscles (not on your neck).",
            "Stand with feet shoulder-width apart, toes turned slightly out.",
            "Take a deep breath into your belly and brace your stomach like you are taking a punch."
          ],
          execution: [
            "Bend at your knees and hips together, pushing your knees outward in line with your toes.",
            "Lower down until your thighs are at least parallel to the floor.",
            "Push through your whole foot to drive smoothly back up to standing."
          ],
          proTips: [
            "Keep your chest proud and eyes looking straight ahead.",
            "On the final 15-rep set, choose a safe weight that allows clean depth."
          ],
          commonMistakes: [
            "Letting your knees cave inward toward each other.",
            "Bending forward from your waist instead of sitting down between your hips."
          ]
        }
      },
      {
        id: "inner-hip-abductions",
        slug: "inner-hip-abductions",
        dayId: "leg-day",
        dayName: "Leg Day",
        title: "Inner Hip Abductions",
        subtitle: "Inner Thighs (Adductors) Strengthening",
        primaryMuscles: ["Inner Thighs (Adductors)"],
        secondaryMuscles: ["Groin Stabilizers"],
        equipment: "Hip Adductor Machine",
        betweenExerciseRest: 45,
        generalFormCue: "Squeeze pads together smoothly. Do not slam the weights together in the middle.",
        demoImage: "/images/exercises/inner-hip-abductions.png",
        sets: [
          { setNumber: 1, reps: "15-20 Reps", restSeconds: 30, notes: "Squeeze and hold for 1 second" },
          { setNumber: 2, reps: "15-20 Reps", restSeconds: 30, notes: "Steady pace with no resting" },
          { setNumber: 3, reps: "15-20 Reps", restSeconds: 30, notes: "Keep tension on the muscles" },
          { setNumber: 4, reps: "15-20 Reps", restSeconds: 30, notes: "Finish all 20 reps strong" },
        ],
        howToPerform: {
          setup: [
            "Sit with your back flat against the seat pad.",
            "Open your legs wide to a comfortable stretch position."
          ],
          execution: [
            "Use your inner thighs to pull your knees inward until the pads meet.",
            "Hold the pads together for a solid 1 second squeeze.",
            "Return wide slowly and under control without letting the weights clang."
          ],
          proTips: [
            "Inner thighs build overall leg thickness and keep your hips injury-free.",
            "Keep your feet relaxed so your thighs do the actual work."
          ],
          commonMistakes: [
            "Using fast jerking motions or bouncing the pads together.",
            "Leaning forward off the seat back."
          ]
        }
      },
      {
        id: "outer-hip-abductions",
        slug: "outer-hip-abductions",
        dayId: "leg-day",
        dayName: "Leg Day",
        title: "Outer Hip Abductions",
        subtitle: "Side Glutes & Hip Stability",
        primaryMuscles: ["Side Glutes (Glute Medius)"],
        secondaryMuscles: ["Hip Stabilizers"],
        equipment: "Hip Abductor Machine",
        betweenExerciseRest: 45,
        generalFormCue: "Push out through the sides of your knees, not your feet.",
        demoImage: "/images/exercises/outer-hip-abductions.png",
        sets: [
          { setNumber: 1, reps: "15-20 Reps", restSeconds: 30, notes: "Wide outward drive" },
          { setNumber: 2, reps: "15-20 Reps", restSeconds: 30, notes: "Hold the squeeze at full width" },
          { setNumber: 3, reps: "15-20 Reps", restSeconds: 30, notes: "Stay in full control" },
          { setNumber: 4, reps: "15-20 Reps", restSeconds: 30, notes: "Burnout set to full fatigue" },
        ],
        howToPerform: {
          setup: [
            "Set the pads on the outside of your knees.",
            "Sit tall with your back flat against the backrest."
          ],
          execution: [
            "Push your knees outward as wide as you can against the resistance.",
            "Hold at the widest point for 1 second to feel your side glutes fire.",
            "Bring your knees back in slowly without letting the weight stack rest."
          ],
          proTips: [
            "A slight lean forward from the hips can make you feel your glutes even more.",
            "Drive through your knees rather than turning your feet outward."
          ],
          commonMistakes: [
            "Pushing with your ankles instead of your knees.",
            "Letting the weights snap back together without controlling the return."
          ]
        }
      },
      {
        id: "lunges",
        slug: "lunges",
        dayId: "leg-day",
        dayName: "Leg Day",
        title: "Lunges",
        subtitle: "Single-Leg Balance & Glute Burn",
        primaryMuscles: ["Quads", "Glutes"],
        secondaryMuscles: ["Hamstrings", "Calves", "Core Balance"],
        equipment: "Dumbbells or Bodyweight",
        betweenExerciseRest: 75,
        generalFormCue: "Take a long step, bend both knees to 90 degrees, and touch back knee gently to the floor.",
        demoImage: "/images/exercises/lunges.png",
        sets: [
          { setNumber: 1, reps: "30 Steps", restSeconds: 60, notes: "15 steps on each leg" },
          { setNumber: 2, reps: "40 Steps", restSeconds: 60, notes: "20 steps on each leg (peak endurance)" },
          { setNumber: 3, reps: "30 Steps", restSeconds: 75, notes: "Weighted or bodyweight steps" },
          { setNumber: 4, reps: "30 Steps", restSeconds: 75, notes: "Final mental toughness test" },
        ],
        howToPerform: {
          setup: [
            "Stand tall holding dumbbells at your sides (or hands on hips for bodyweight).",
            "Keep your shoulders back and look straight ahead."
          ],
          execution: [
            "Step forward with a long stride, dropping your back knee straight down toward the ground.",
            "Both knees should bend to roughly 90 degrees at the bottom.",
            "Push through your front heel to step up into the next lunge."
          ],
          proTips: [
            "Keep your feet hip-width apart like you are walking on train tracks, not a tightrope.",
            "Never bang your back knee onto the hard floor; lower it gently."
          ],
          commonMistakes: [
            "Taking steps that are too short, which puts excess pressure on your front knee.",
            "Slouching your chest forward over your thigh."
          ]
        }
      },
      {
        id: "inverted-leg-press",
        slug: "inverted-leg-press",
        dayId: "leg-day",
        dayName: "Leg Day",
        title: "Inverted Leg Press",
        subtitle: "Heavy Leg Sled Press (45 Degree or Vertical)",
        primaryMuscles: ["Quads", "Glutes"],
        secondaryMuscles: ["Hamstrings"],
        equipment: "45-Degree Leg Press or Vertical Sled Machine",
        betweenExerciseRest: 60,
        generalFormCue: "Never lock your knees at the top! Keep smooth continuous tension on your thighs.",
        demoImage: "/images/exercises/inverted-leg-press.png",
        sets: [
          { setNumber: 1, reps: "8-12 Reps", restSeconds: 60, notes: "Deep, controlled lower" },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 60, notes: "Steady smooth tempo" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 60, notes: "Heavy working weight" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 60, notes: "Max effort final working set" },
        ],
        howToPerform: {
          setup: [
            "Sit deep into the seat with your back and hips firmly pressed against the padding.",
            "Place your feet shoulder-width apart in the center of the platform."
          ],
          execution: [
            "Release safety handles and lower the sled smoothly until your knees bend to about 90 degrees.",
            "Do not allow your lower back or tailbone to round off the seat pad.",
            "Press through your heels and mid-foot to push the sled back up, stopping just before locking your knees."
          ],
          proTips: [
            "Always keep a soft bend in your knees at the top to protect your joints.",
            "Hold the side handles tight to keep your rear glued into the seat."
          ],
          commonMistakes: [
            "Snapping and locking your knees straight under heavy weight.",
            "Letting the weight push your hips off the pad at the bottom."
          ]
        }
      }
    ]
  },
  {
    id: "arm-day",
    slug: "arm-day",
    name: "Arm Day",
    tagline: "Build bigger biceps and horseshoe triceps",
    totalExercises: 6,
    estimatedDuration: "50 - 60 min",
    targetIntensity: "Hard effort (leave 0-1 rep in the tank)",
    badge: "Arm Builder",
    exercises: [
      {
        id: "combined-bicep-hammer-curl",
        slug: "combined-bicep-hammer-curl",
        dayId: "arm-day",
        dayName: "Arm Day",
        title: "Combined Bicep + Hammer Curl",
        subtitle: "Front Arms & Forearms Combo",
        primaryMuscles: ["Biceps", "Forearms"],
        secondaryMuscles: ["Shoulders"],
        equipment: "Dumbbells",
        betweenExerciseRest: 75,
        generalFormCue: "Keep your elbows pinned to your ribs. Do not swing your body.",
        demoImage: "/images/exercises/combined-bicep-hammer-curl.png",
        sets: [
          { setNumber: 1, reps: "10 Reps", restSeconds: 45, notes: "Combined regular curl and hammer curl warmup" },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 45, notes: "Strict form with zero body swing" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 45, notes: "Heavy dumbbell challenge" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 45, notes: "Final grinding set to full bicep pump" },
        ],
        howToPerform: {
          setup: [
            "Stand tall with a dumbbell in each hand, arms resting by your sides.",
            "Roll your shoulders back, chest up, core braced."
          ],
          execution: [
            "Curl up with palms turning upward toward the ceiling to flex your bicep peak.",
            "Lower slowly, then curl with palms facing each other (hammer grip) to hit your forearms.",
            "Keep your elbows locked in place next to your ribs like door hinges."
          ],
          proTips: [
            "Turning your pinky slightly outward at the top gives the greatest bicep squeeze.",
            "Lower the dumbbells on a slow 2-second count."
          ],
          commonMistakes: [
            "Swinging your back to throw the dumbbells up.",
            "Letting your elbows drift forward in front of your body."
          ]
        }
      },
      {
        id: "standing-barbell-curl",
        slug: "standing-barbell-curl",
        dayId: "arm-day",
        dayName: "Arm Day",
        title: "Standing Barbell Bicep Curl",
        subtitle: "Classic Bicep Mass Builder",
        primaryMuscles: ["Biceps (Both Heads)"],
        secondaryMuscles: ["Forearms"],
        equipment: "Straight Barbell or EZ Curl Bar",
        betweenExerciseRest: 60,
        generalFormCue: "Keep upper arms vertical. Squeeze your biceps hard at the top.",
        demoImage: "/images/exercises/standing-barbell-curl.png",
        sets: [
          { setNumber: 1, reps: "8-12 Reps", restSeconds: 45, notes: "Smooth warm-up working set" },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 45, notes: "Strict tempo: 2 seconds down, 1 second up" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 45, notes: "Heavy working weight" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 45, notes: "Push past the burn on your last rep" },
        ],
        howToPerform: {
          setup: [
            "Grip the barbell underhand, hands shoulder-width apart.",
            "Stand upright with feet shoulder-width, knees slightly soft, core tight."
          ],
          execution: [
            "Curl the barbell upward in a smooth arc toward your upper chest.",
            "Squeeze your biceps hard at the top for 1 full second.",
            "Lower the barbell under control until your arms are almost completely straight."
          ],
          proTips: [
            "Keep your wrists straight and firm throughout the curl.",
            "Do not lean backward as the bar goes up."
          ],
          commonMistakes: [
            "Using hips or lower back to swing the bar up.",
            "Dropping the bar down quickly with no resistance on the descent."
          ]
        }
      },
      {
        id: "preacher-curl",
        slug: "preacher-curl",
        dayId: "arm-day",
        dayName: "Arm Day",
        title: "Preacher Curl on Curl Pad",
        subtitle: "Strict Bicep Isolation (Zero Cheating)",
        primaryMuscles: ["Biceps (Inner Peak)"],
        secondaryMuscles: ["Forearms"],
        equipment: "Preacher Bench + EZ Curl Bar",
        betweenExerciseRest: 60,
        generalFormCue: "Rest armpits right over the top of the pad. Do not lift off the bench.",
        demoImage: "/images/exercises/preacher-curl.png",
        sets: [
          { setNumber: 1, reps: "8-12 Reps", restSeconds: 45, notes: "Strict tempo on the sloped pad" },
          { setNumber: 2, reps: "8-10 Reps", restSeconds: 45, notes: "Heavier weight with solid control" },
          { setNumber: 3, reps: "8-10 Reps", restSeconds: 45, notes: "High intensity working set" },
          { setNumber: 4, reps: "8-10 Reps", restSeconds: 45, notes: "Final grinding set to complete exhaustion" },
        ],
        howToPerform: {
          setup: [
            "Adjust the seat so your armpits rest comfortably over the top edge of the pad.",
            "The back of your arms should rest flat against the cushion."
          ],
          execution: [
            "Hold the EZ bar with an underhand grip and curl upward toward your shoulders.",
            "Squeeze your biceps tightly at the top without lifting your arms off the pad.",
            "Lower the bar slowly until your arms are nearly straight, but stop just before full lockout."
          ],
          proTips: [
            "Never bounce the bar off the bottom or hyperextend your elbows.",
            "Keep your upper body relaxed and let the biceps do 100% of the lifting."
          ],
          commonMistakes: [
            "Letting the bar drop fast and jarring your elbow joints.",
            "Leaning back off the seat to help lift the weight."
          ]
        }
      },
      {
        id: "tricep-pushdown-cable",
        slug: "tricep-pushdown-cable",
        dayId: "arm-day",
        dayName: "Arm Day",
        title: "Cable Tricep Pushdown (with Bar)",
        subtitle: "Back of Arm (Triceps) Horseshoe Builder",
        primaryMuscles: ["Back of Arm (Triceps)"],
        secondaryMuscles: ["Forearm Grip"],
        equipment: "Cable Station + Straight or Angled Bar",
        betweenExerciseRest: 60,
        generalFormCue: "Pin your elbows to your sides. Push straight down until your arms are completely straight.",
        demoImage: "/images/exercises/tricep-pushdown-cable.png",
        sets: [
          { setNumber: 1, reps: "15 Reps", restSeconds: 45, notes: "Warm-up set to fill triceps with blood" },
          { setNumber: 2, reps: "8-12 Reps", restSeconds: 30, notes: "Short rest high-tempo set" },
          { setNumber: 3, reps: "8-12 Reps", restSeconds: 30, notes: "Heavy push set" },
          { setNumber: 4, reps: "8-12 Reps", restSeconds: 45, notes: "Hard squeeze at full lockout on every rep" },
        ],
        howToPerform: {
          setup: [
            "Set the cable pulley to the top position and clip on a bar handle.",
            "Grip the bar overhand, hands shoulder-width apart, and lean slightly forward at your hips."
          ],
          execution: [
            "Keep your elbows locked firmly against the sides of your ribs.",
            "Push the bar down until your arms are fully straight, squeezing your triceps hard.",
            "Slowly let the bar come back up to chest level, keeping your elbows fixed in place."
          ],
          proTips: [
            "Push through the heel of your palms for the strongest tricep contraction.",
            "Do not let your shoulders roll forward as you push."
          ],
          commonMistakes: [
            "Flaring your elbows out or letting them swing up and down.",
            "Using your body weight to press the bar down instead of your arms."
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

export function getAllExercises(): Exercise[] {
  return WORKOUT_DAYS.flatMap((day) => day.exercises);
}

export function getExerciseBySlug(slug: string): Exercise | undefined {
  return getAllExercises().find((ex) => ex.slug === slug || ex.id === slug);
}

export function getWorkoutDayById(id: string): WorkoutDay | undefined {
  return WORKOUT_DAYS.find((day) => day.id === id || day.slug === id);
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
