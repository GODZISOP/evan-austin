"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Exercise } from "@/data/workoutData";
import { RestTimer } from "@/components/WorkoutPrograms";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Play, 
  Maximize2, 
  ArrowLeft,
  X,
  Target,
  Repeat,
  Timer,
  Lightbulb,
  AlertTriangle,
  Dumbbell,
  ShieldCheck
} from "lucide-react";

interface ExerciseDetailViewProps {
  exercise: Exercise;
  prevExercise: Exercise | null;
  nextExercise: Exercise | null;
}

// Consistent cinematic easing curve
const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

// Professional Muscle Anatomy Visual with Targeted Muscle Red Neon Glow
const MuscleAnatomyVisual = ({ 
  exercise 
}: { 
  exercise: Exercise 
}) => {
  // Comprehensive muscle activation analysis for every split & finisher
  const pStr = (exercise.primaryMuscles || []).join(" ").toLowerCase();
  const sStr = (exercise.secondaryMuscles || []).join(" ").toLowerCase();
  const idStr = `${exercise.id} ${exercise.slug || ""} ${exercise.dayId || ""} ${exercise.title || ""}`.toLowerCase();
  
  const check = (keywords: string[]) => {
    const isPrimary = keywords.some(k => pStr.includes(k) || idStr.includes(k));
    const isSecondary = keywords.some(k => sStr.includes(k));
    return { isPrimary, isSecondary, isActive: isPrimary || isSecondary };
  };

  const shoulders = check(["shoulder", "delt", "lateral raise", "face pull", "rotator", "infraspinatus", "teres minor"]);
  const traps = check(["trap", "rhomboid", "middle back", "upper back"]);
  const chest = check(["chest", "pec", "pectoral"]);
  const back = check(["lat", "back", "row", "pull-up", "pulldown", "teres major", "erector"]);
  const abs = check(["abs", "abdomin", "core", "oblique", "plank", "crunch", "hanging-leg"]);
  const biceps = check(["bicep", "curl", "brachialis"]);
  const triceps = check(["tricep", "skull", "pushdown", "dip"]);
  const forearms = check(["forearm", "wrist"]);
  const glutes = check(["glute", "hip thrust", "pelvis", "outer thigh", "lunge"]);
  const quads = check(["quad", "leg ext", "squat", "leg press", "adductor"]);
  const hamstrings = check(["hamstring", "leg curl", "deadlift", "rdl"]);
  const calves = check(["calf", "calves", "gastrocnemius", "soleus"]);

  // Fallback to dayId if primary didn't match keyword
  if (!shoulders.isPrimary && !chest.isPrimary && !back.isPrimary && !quads.isPrimary && !biceps.isPrimary && !triceps.isPrimary && !abs.isPrimary && !calves.isPrimary) {
    if (exercise.dayId === "shoulder-day") shoulders.isPrimary = true;
    else if (exercise.dayId === "chest-day") chest.isPrimary = true;
    else if (exercise.dayId === "back-day") back.isPrimary = true;
    else if (exercise.dayId === "leg-day") quads.isPrimary = true;
    else if (exercise.dayId === "arm-day") { biceps.isPrimary = true; triceps.isPrimary = true; }
    else if (idStr.includes("abs")) abs.isPrimary = true;
    else if (idStr.includes("calf") || idStr.includes("calves")) calves.isPrimary = true;
  }

  // Pinpoint overlay position based on primary target
  let pinTop = "30%";
  let pinLabel = exercise.primaryMuscles[0] || "Target Muscle";

  if (shoulders.isPrimary) {
    pinTop = "24%";
  } else if (traps.isPrimary) {
    pinTop = "19%";
  } else if (chest.isPrimary) {
    pinTop = "29%";
  } else if (back.isPrimary) {
    pinTop = "34%";
  } else if (biceps.isPrimary || triceps.isPrimary) {
    pinTop = "38%";
  } else if (abs.isPrimary) {
    pinTop = "46%";
  } else if (glutes.isPrimary) {
    pinTop = "56%";
  } else if (quads.isPrimary || hamstrings.isPrimary) {
    pinTop = "68%";
  } else if (calves.isPrimary) {
    pinTop = "83%";
  }

  const getStyle = (status: { isPrimary: boolean; isSecondary: boolean; isActive: boolean }) => {
    if (status.isPrimary) {
      return {
        fill: "#ef4444",
        className: "transition-all duration-300 animate-pulse text-red-500 fill-red-500"
      };
    }
    if (status.isSecondary) {
      return {
        fill: "#dc2626",
        className: "transition-all duration-300 text-red-600 fill-red-600/90"
      };
    }
    return {
      fill: "#262626",
      className: "transition-all duration-300 text-neutral-800 fill-neutral-800"
    };
  };

  const shoulderStyle = getStyle(shoulders);
  const trapStyle = getStyle(traps);
  const chestStyle = getStyle(chest);
  const backStyle = getStyle(back);
  const absStyle = getStyle(abs);
  const bicepStyle = getStyle(biceps);
  const tricepStyle = getStyle(triceps);
  const forearmStyle = getStyle(forearms);
  const gluteStyle = getStyle(glutes);
  const quadStyle = getStyle(quads);
  const hamstringStyle = getStyle(hamstrings);
  const calfStyle = getStyle(calves);

  return (
    <div className="card relative w-full rounded-2xl bg-neutral-950 p-6 flex flex-col items-center justify-center overflow-hidden border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.08)]">
      {/* Background Radial Red Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.18),transparent_70%)] pointer-events-none" />

      {/* SVG Silhouette Schematic */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, delay: 0.1, ease: CINEMATIC_EASE }}
        className="relative w-52 h-72 flex items-center justify-center my-1"
      >
        <svg
          viewBox="0 0 200 310"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Vivid Red Neon Glow Filter */}
            <filter id="neon-red-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Head & Neck */}
          <circle cx="100" cy="28" r="16" fill="#262626" />
          <rect x="94" y="45" width="12" height="12" rx="3" fill="#262626" />

          {/* Trapezius / Upper Back Collar */}
          <polygon 
            points="76,58 100,52 124,58 138,72 62,72" 
            fill={trapStyle.fill}
            filter={traps.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={trapStyle.className}
          />

          {/* Shoulders / Deltoids (Left & Right) */}
          <path 
            d="M48 74 C44 84, 44 98, 52 108 C58 108, 64 96, 62 82 C62 76, 56 72, 48 74 Z" 
            fill={shoulderStyle.fill}
            filter={shoulders.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={shoulderStyle.className}
          />
          <path 
            d="M152 74 C156 84, 156 98, 148 108 C142 108, 136 96, 138 82 C138 76, 144 72, 152 74 Z" 
            fill={shoulderStyle.fill}
            filter={shoulders.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={shoulderStyle.className}
          />

          {/* Latissimus Dorsi (Wings Flaring from Torso Sides) */}
          <path 
            d="M54 104 L66 98 L66 138 L52 130 Z" 
            fill={backStyle.fill}
            filter={back.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={backStyle.className}
          />
          <path 
            d="M146 104 L134 98 L134 138 L148 130 Z" 
            fill={backStyle.fill}
            filter={back.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={backStyle.className}
          />

          {/* Chest & Torso (Left & Right Pectorals) */}
          <path 
            d="M66 74 H98 V110 C82 112, 68 106, 66 94 Z" 
            fill={chestStyle.fill}
            filter={chest.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={chestStyle.className}
          />
          <path 
            d="M102 74 H134 C132 94, 118 106, 102 110 Z" 
            fill={chestStyle.fill}
            filter={chest.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={chestStyle.className}
          />

          {/* Abdominals & Core (6-Pack segmented plates) */}
          <g filter={abs.isPrimary ? "url(#neon-red-glow)" : undefined} className={absStyle.className}>
            {/* Upper Abs */}
            <rect x="73" y="114" width="24" height="13" rx="2" fill={absStyle.fill} />
            <rect x="103" y="114" width="24" height="13" rx="2" fill={absStyle.fill} />
            {/* Mid Abs */}
            <rect x="73" y="130" width="24" height="13" rx="2" fill={absStyle.fill} />
            <rect x="103" y="130" width="24" height="13" rx="2" fill={absStyle.fill} />
            {/* Lower Abs */}
            <path d="M73 146 H97 V164 L76 164 Z" fill={absStyle.fill} />
            <path d="M103 146 H127 L124 164 H103 Z" fill={absStyle.fill} />
            {/* Obliques */}
            <path d="M56 134 L69 134 L70 164 L60 160 Z" fill={absStyle.fill} />
            <path d="M144 134 L131 134 L130 164 L140 160 Z" fill={absStyle.fill} />
          </g>

          {/* Biceps (Upper Arm Front/Inner) */}
          <path 
            d="M48 102 C44 112, 44 126, 50 134 C55 134, 58 122, 57 110 Z" 
            fill={bicepStyle.fill}
            filter={biceps.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={bicepStyle.className}
          />
          <path 
            d="M152 102 C156 112, 156 126, 150 134 C145 134, 142 122, 143 110 Z" 
            fill={bicepStyle.fill}
            filter={biceps.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={bicepStyle.className}
          />

          {/* Triceps (Upper Arm Lateral/Back) */}
          <path 
            d="M38 98 C34 108, 36 122, 42 130 C45 130, 48 118, 46 104 Z" 
            fill={tricepStyle.fill}
            filter={triceps.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={tricepStyle.className}
          />
          <path 
            d="M162 98 C166 108, 164 122, 158 130 C155 130, 152 118, 154 104 Z" 
            fill={tricepStyle.fill}
            filter={triceps.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={tricepStyle.className}
          />

          {/* Forearms */}
          <path 
            d="M34 132 L48 134 L43 172 L30 168 Z" 
            fill={forearmStyle.fill}
            filter={forearms.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={forearmStyle.className}
          />
          <path 
            d="M166 132 L152 134 L157 172 L170 168 Z" 
            fill={forearmStyle.fill}
            filter={forearms.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={forearmStyle.className}
          />
          <circle cx="36" cy="178" r="6" fill="#262626" />
          <circle cx="164" cy="178" r="6" fill="#262626" />

          {/* Pelvis & Glutes */}
          <polygon 
            points="70,166 130,166 124,194 76,194" 
            fill={gluteStyle.fill}
            filter={glutes.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={gluteStyle.className}
          />

          {/* Left Leg - Quads & Hamstrings */}
          <path 
            d="M68 198 H94 L87 250 H60 Z" 
            fill={quads.isPrimary || quads.isSecondary ? quadStyle.fill : hamstrings.isPrimary || hamstrings.isSecondary ? hamstringStyle.fill : "#262626"}
            filter={quads.isPrimary || hamstrings.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={quads.isPrimary || hamstrings.isPrimary ? "transition-all duration-300 animate-pulse text-red-500 fill-red-500" : undefined}
          />

          {/* Right Leg - Quads & Hamstrings */}
          <path 
            d="M106 198 H132 L140 250 H113 Z" 
            fill={quads.isPrimary || quads.isSecondary ? quadStyle.fill : hamstrings.isPrimary || hamstrings.isSecondary ? hamstringStyle.fill : "#262626"}
            filter={quads.isPrimary || hamstrings.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={quads.isPrimary || hamstrings.isPrimary ? "transition-all duration-300 animate-pulse text-red-500 fill-red-500" : undefined}
          />

          {/* Left Calf */}
          <path 
            d="M58 254 C52 270, 54 286, 58 294 H78 C82 286, 84 270, 80 254 Z" 
            fill={calfStyle.fill}
            filter={calves.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={calfStyle.className}
          />

          {/* Right Calf */}
          <path 
            d="M142 254 C148 270, 146 286, 142 294 H122 C118 286, 116 270, 120 254 Z" 
            fill={calfStyle.fill}
            filter={calves.isPrimary ? "url(#neon-red-glow)" : undefined}
            className={calfStyle.className}
          />

          {/* Feet */}
          <path d="M56 296 H80 L76 304 H52 Z" fill="#262626" />
          <path d="M144 296 H120 L124 304 H148 Z" fill="#262626" />
        </svg>

        {/* Anatomical Target Pin Overlay (Always Visible with Glowing Red Radar) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.2, ease: CINEMATIC_EASE }}
          style={{ top: pinTop }}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center"
        >
          {/* Pulsing red radar ring */}
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-500 opacity-70"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 border-2 border-white shadow-[0_0_14px_#ef4444]"></span>
          </div>
          <div className="mt-1 px-2.5 py-0.5 rounded-full bg-red-950/95 border border-red-500 text-red-200 text-[10px] font-mono font-bold uppercase tracking-wider shadow-[0_0_18px_rgba(239,68,68,0.5)] whitespace-nowrap">
            {pinLabel}
          </div>
        </motion.div>
      </motion.div>

      {/* Target Focus Description with Vivid Red Glow Banner */}
      <div className="mt-3 text-center px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/70 border border-red-500/50 text-xs font-bold text-white uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>PRIMARY TARGET: <span className="text-red-400 font-extrabold">{exercise.primaryMuscles.join(", ")}</span></span>
        </div>
        {exercise.secondaryMuscles.length > 0 && (
          <div className="text-[11px] text-neutral-400 mt-1.5">
            Secondary: <span className="text-neutral-300">{exercise.secondaryMuscles.join(", ")}</span>
          </div>
        )}
      </div>

      {/* Activation Status Legend */}
      <div className="mt-3 pt-3 border-t border-white/[0.06] w-full flex items-center justify-center gap-4 text-[10px] text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444] animate-pulse" />
          <span className="text-neutral-300 font-medium">Primary Focus</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-700" />
          <span>Assisting</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neutral-700" />
          <span>Resting</span>
        </span>
      </div>
    </div>
  );
};

export default function ExerciseDetailView({ 
  exercise, 
  prevExercise, 
  nextExercise 
}: ExerciseDetailViewProps) {
  const [completedSets, setCompletedSets] = useState<Record<number, boolean>>({});
  const [activeTimer, setActiveTimer] = useState<{ seconds: number; setNumber: number } | null>(null);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);

  // Parallax ref for exercise demonstration image
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"]
  });
  // Subtle 20–30px parallax
  const imageParallaxY = useTransform(imageScrollProgress, [0, 1], [-25, 25]);

  // Keyboard accessibility: Escape closes lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsImageLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSetCompleted = (setNumber: number) => {
    setCompletedSets((prev) => ({
      ...prev,
      [setNumber]: !prev[setNumber]
    }));
  };

  const totalCompleted = Object.values(completedSets).filter(Boolean).length;
  const progressPercent = Math.round((totalCompleted / exercise.sets.length) * 100);

  // Coordinated Page Load Animation Variants
  const pageContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04
      }
    }
  };

  const pageItemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.65, ease: CINEMATIC_EASE } 
    }
  };

  const mainHeadingVariants = {
    hidden: { 
      opacity: 0, 
      y: 60, 
      scale: 0.97,
      filter: "blur(8px)" 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: CINEMATIC_EASE } 
    }
  };

  return (
    <motion.div 
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-5xl"
    >
      
      {/* 1. Top Breadcrumbs */}
      <motion.div 
        variants={pageItemVariants}
        className="flex flex-wrap items-center justify-between gap-4 mb-8 pt-2 pb-4 border-b border-white/[0.08]"
      >
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/programs" className="hover:text-white transition-colors">Workouts</Link>
          <span>/</span>
          <span className="text-red-500 font-medium">{exercise.dayName}</span>
          <span>/</span>
          <span className="text-white truncate max-w-[220px] font-medium">{exercise.title}</span>
        </div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
          <Link 
            href="/programs"
            className="btn btn-sm btn-ghost gap-2 text-xs text-neutral-300 hover:text-white group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>All Workouts</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* 2 & 3 & 4. Header: Badges, Title, Subtitle, Progress */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          {/* Workout Badges */}
          <motion.div variants={pageItemVariants} className="flex flex-wrap items-center gap-2.5 mb-3 text-xs">
            <span className="badge badge-error font-semibold uppercase tracking-wider">
              {exercise.dayName}
            </span>
            <span className="badge badge-neutral text-neutral-300">
              {exercise.equipment}
            </span>
            <span className="text-neutral-400 text-xs">
              Between-Move Rest: {exercise.betweenExerciseRest}s
            </span>
          </motion.div>

          {/* Main Exercise Title - Stronger reveal with blur and scale */}
          <motion.h1 
            variants={mainHeadingVariants}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2"
          >
            {exercise.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={pageItemVariants}
            className="text-base text-neutral-400 max-w-2xl"
          >
            {exercise.subtitle}
          </motion.p>
        </div>

        {/* 5. Session Progress */}
        <motion.div 
          variants={pageItemVariants}
          className="card p-3.5 bg-neutral-900/80 border border-white/[0.06] shrink-0 min-w-[200px]"
        >
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 font-medium">
            <span>Session Progress</span>
            <span className="text-red-500 font-bold font-mono">{totalCompleted} of {exercise.sets.length} Sets</span>
          </div>
          <progress 
            className="progress progress-error w-full h-2" 
            value={progressPercent} 
            max="100" 
          />
        </motion.div>
      </div>

      {/* 6. Training Note Callout (Animate once on scroll enter) */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.65, ease: CINEMATIC_EASE }}
        className="card relative overflow-hidden mb-10 p-5 bg-neutral-900/60 border border-white/[0.06] flex flex-row items-start gap-4"
      >
        {/* Subtle red glow sweep on scroll enter */}
        <motion.div
          initial={{ x: "-100%" }}
          whileInView={{ x: "200%" }}
          viewport={{ once: false }}
          transition={{ duration: 1.1, delay: 0.15, ease: "easeInOut" }}
          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-red-600/10 to-transparent pointer-events-none"
        />

        <motion.div
          initial={{ scale: 0.5, rotate: -15 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: false }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-9 h-9 rounded-xl bg-red-600/15 text-red-500 flex items-center justify-center shrink-0 mt-0.5"
        >
          <Lightbulb className="w-4 h-4 text-red-500" />
        </motion.div>

        <div className="flex-grow">
          <div className="badge badge-error badge-xs uppercase tracking-wider font-bold mb-1">
            Training Note
          </div>
          <p className="text-base font-semibold text-white leading-snug">
            &quot;Make sure weight is heavy enough to make the last rep of each set difficult.&quot;
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            Choose a working weight where you have 0 to 1 clean reps left in reserve.
          </p>
        </div>
      </motion.div>

      {/* 7. LARGE EXERCISE DEMONSTRATION IMAGE & START/FINISH FORM CARDS */}
      {exercise.demoImage && (
        <motion.div 
          ref={imageContainerRef}
          initial={{ opacity: 0, y: 70, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
          className="mb-12 space-y-6"
        >
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-red-500" />
                Exercise Infographic Demonstration
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsImageLightboxOpen(true)}
                className="btn btn-ghost btn-xs gap-1.5 text-neutral-400 hover:text-white"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full View</span>
              </motion.button>
            </div>

            <div 
              onClick={() => setIsImageLightboxOpen(true)}
              className="card relative rounded-3xl overflow-hidden bg-neutral-950 cursor-pointer group shadow-2xl flex items-center justify-center border border-white/5"
            >
              {/* Red/black cinematic reveal overlay that slides across on scroll */}
              <motion.div
                initial={{ x: "0%" }}
                whileInView={{ x: "100%" }}
                viewport={{ once: false }}
                transition={{ duration: 0.85, ease: CINEMATIC_EASE }}
                className="absolute inset-0 z-20 bg-gradient-to-r from-red-950 via-black to-black pointer-events-none"
              />

              {/* Parallax Image */}
              <motion.img
                style={{ y: imageParallaxY }}
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.95, ease: CINEMATIC_EASE }}
                src={exercise.demoImage}
                alt={`${exercise.title} Demonstration`}
                className="w-full object-contain max-h-[620px] transition-transform duration-500 group-hover:scale-[1.01]"
              />

              {/* Hover Action Indicator */}
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <motion.span 
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false }}
                  className="btn btn-sm btn-neutral backdrop-blur-sm shadow-xl gap-2 text-white"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Tap to expand fullscreen
                </motion.span>
              </div>
            </div>
          </div>

          {/* Start & Finish Position Form Cards (If Available) */}
          {exercise.startPositionImage && exercise.finishPositionImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Position Card */}
              <div className="card rounded-2xl bg-neutral-950/80 border border-white/[0.08] p-3 overflow-hidden shadow-lg group hover:border-red-500/40 transition-colors">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    Start Position (Setup)
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">STEP 01</span>
                </div>
                <div className="relative rounded-xl overflow-hidden bg-black/50 aspect-square flex items-center justify-center border border-white/5">
                  <img 
                    src={exercise.startPositionImage} 
                    alt={`${exercise.title} Start Position`}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Finish Position Card */}
              <div className="card rounded-2xl bg-neutral-950/80 border border-red-500/20 p-3 overflow-hidden shadow-lg group hover:border-red-500/50 transition-colors">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-[11px] font-bold text-red-300 uppercase tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Finish Position (Peak Squeeze)
                  </span>
                  <span className="text-[10px] text-red-400 font-mono">STEP 02</span>
                </div>
                <div className="relative rounded-xl overflow-hidden bg-black/50 aspect-square flex items-center justify-center border border-white/5">
                  <img 
                    src={exercise.finishPositionImage} 
                    alt={`${exercise.title} Finish Position`}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* 8. 2-Column Section: Anatomy from LEFT, Sets & Reps from RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">
        
        {/* LEFT COLUMN: Muscle Anatomy (Animate from LEFT: x -50px, scale 0.97) */}
        <motion.div 
          initial={{ opacity: 0, x: -50, scale: 0.97 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
          className="lg:col-span-5 space-y-6"
        >
          <div>
            <div className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-red-500" />
              Target Muscle Anatomy
            </div>

            <MuscleAnatomyVisual exercise={exercise} />
          </div>

          {/* Muscles Targeted Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.55, delay: 0.15, ease: CINEMATIC_EASE }}
            className="card p-5 bg-neutral-900/60 border border-white/[0.06] space-y-3"
          >
            <div>
              <div className="text-xs text-neutral-400 mb-1.5 font-medium">Primary Focus:</div>
              <div className="flex flex-wrap gap-2">
                {exercise.primaryMuscles.map((muscle) => (
                  <span 
                    key={muscle}
                    className="badge bg-red-950/70 border border-red-500/40 text-red-200 font-semibold text-xs py-3 shadow-[0_0_12px_rgba(239,68,68,0.25)] flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            {exercise.secondaryMuscles.length > 0 && (
              <div className="pt-2 border-t border-white/[0.06]">
                <div className="text-xs text-neutral-400 mb-1.5 font-medium">Stabilizers & Assisting:</div>
                <div className="flex flex-wrap gap-2">
                  {exercise.secondaryMuscles.map((muscle) => (
                    <span 
                      key={muscle}
                      className="badge badge-outline text-neutral-300 text-xs py-2.5"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN: Sets & Reps Tracker (Animate from RIGHT: x 50px, Staggered Cards) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
          className="lg:col-span-7 space-y-6"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2">
                <Repeat className="w-4 h-4 text-red-500" />
                Sets & Reps
              </span>
              <span className="text-xs text-neutral-500">
                {exercise.sets.length} Total Working Sets
              </span>
            </div>

            {/* Staggered Set Cards */}
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.07
                  }
                }
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              className="space-y-2.5"
            >
              {exercise.sets.map((set) => {
                const isCompleted = !!completedSets[set.setNumber];

                return (
                  <motion.div
                    key={set.setNumber}
                    variants={{
                      hidden: { opacity: 0, x: 30, scale: 0.97 },
                      visible: { 
                        opacity: 1, 
                        x: 0, 
                        scale: 1,
                        transition: { duration: 0.5, ease: CINEMATIC_EASE } 
                      }
                    }}
                    whileHover={{ 
                      y: -4, 
                      scale: 1.01,
                      transition: { type: "spring", stiffness: 400, damping: 25 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSetCompleted(set.setNumber)}
                    animate={{
                      boxShadow: isCompleted 
                        ? "0 0 25px -4px rgba(16, 185, 129, 0.25)" 
                        : "0 0 0px 0px rgba(0, 0, 0, 0)"
                    }}
                    className={`card cursor-pointer p-4 border transition-colors flex flex-row items-center justify-between ${
                      isCompleted 
                        ? "bg-emerald-950/20 border-emerald-600/40"
                        : "bg-neutral-900/70 border-white/[0.06] hover:bg-neutral-900 hover:border-white/[0.12]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-7 h-7 rounded-lg bg-neutral-950 flex items-center justify-center text-xs font-mono font-bold text-neutral-300">
                        0{set.setNumber}
                      </div>
                      <div>
                        <div className="text-base font-bold text-white flex items-center gap-2">
                          <span>{set.reps}</span>
                        </div>
                        {set.notes && (
                          <div className="text-xs text-neutral-400">
                            {set.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-neutral-400 flex items-center gap-1">
                        <Timer className="w-3.5 h-3.5 text-neutral-500" />
                        {set.restSeconds}s
                      </span>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTimer({
                            seconds: set.restSeconds,
                            setNumber: set.setNumber
                          });
                        }}
                        className="btn btn-xs btn-outline btn-error gap-1 text-[10px] group"
                      >
                        <Play className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                        <span>Timer</span>
                      </motion.button>

                      {/* Animated Spring Checkmark */}
                      <div className="pl-1">
                        {isCompleted ? (
                          <motion.div
                            key="completed-icon"
                            initial={{ scale: 0, rotate: -60 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 350, damping: 22 }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          </motion.div>
                        ) : (
                          <Circle className="w-5 h-5 text-neutral-600 hover:text-neutral-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Between Exercise Transition Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.55, delay: 0.15, ease: CINEMATIC_EASE }}
              className="card mt-3 p-3.5 bg-neutral-950 border border-white/[0.06] flex flex-row items-center justify-between text-xs"
            >
              <span className="text-neutral-400">
                Rest before next exercise: <strong className="text-white font-mono">{exercise.betweenExerciseRest}s</strong>
              </span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTimer({
                  seconds: exercise.betweenExerciseRest,
                  setNumber: 0
                })}
                className="btn btn-xs btn-error text-white font-bold"
              >
                Start {exercise.betweenExerciseRest}s Rest
              </motion.button>
            </motion.div>
          </div>

          {/* 9. Form & Technique Breakdown (Staggered: Heading → Setup → Execution → Tip/Mistake) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.65, ease: CINEMATIC_EASE }}
            className="card p-6 bg-neutral-900/60 border border-white/[0.06] space-y-5"
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.06]">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>Form & Technique Breakdown</span>
            </h3>

            {/* Setup */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.1, ease: CINEMATIC_EASE }}
            >
              <div className="text-xs uppercase text-neutral-400 font-bold tracking-wider mb-2">
                Setup
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                {exercise.howToPerform.setup.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Execution */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.15, ease: CINEMATIC_EASE }}
            >
              <div className="text-xs uppercase text-neutral-400 font-bold tracking-wider mb-2">
                Execution
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                {exercise.howToPerform.execution.slice(0, 3).map((e, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Pro Tips & Mistakes (Coach Tip from left, Mistake from right ~20–30px) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <motion.div 
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.2, ease: CINEMATIC_EASE }}
                className="card p-3.5 bg-neutral-950 border border-white/[0.06]"
              >
                <div className="text-xs font-bold text-red-400 mb-1 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-red-500" />
                  Coach Tip
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {exercise.howToPerform.proTips[0] || "Focus on controlling the eccentric phase and squeezing at the peak."}
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.2, ease: CINEMATIC_EASE }}
                className="card p-3.5 bg-neutral-950 border border-white/[0.06]"
              >
                <div className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Mistake to Avoid
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {exercise.howToPerform.commonMistakes[0] || "Avoid using momentum or swinging the body to heave the weight."}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* 10. Next & Previous Exercise Navigation (Left & Right Entrance + Hover Arrows) */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/[0.08] mb-12"
      >
        {prevExercise ? (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <Link
              href={`/workouts/${prevExercise.slug}`}
              className="card group p-4 bg-neutral-900/70 hover:bg-neutral-900 border border-white/[0.06] hover:border-neutral-700 transition-all flex flex-row items-center gap-3.5"
            >
              <div className="btn btn-circle btn-sm btn-neutral group-hover:btn-error transition-transform group-hover:-translate-x-1 duration-200">
                <ChevronLeft className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-neutral-400">Previous Exercise</div>
                <div className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                  {prevExercise.title}
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <div className="card p-4 bg-neutral-950/40 border border-white/[0.04] opacity-40">
            <div className="text-[11px] text-neutral-500">First Exercise of Split</div>
            <div className="text-sm text-neutral-400 font-semibold">{exercise.title}</div>
          </div>
        )}

        {nextExercise ? (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <Link
              href={`/workouts/${nextExercise.slug}`}
              className="card group p-4 bg-neutral-900/70 hover:bg-neutral-900 border border-white/[0.06] hover:border-neutral-700 transition-all flex flex-row items-center justify-between text-right"
            >
              <div className="text-left sm:text-right flex-grow">
                <div className="text-[11px] text-neutral-400">Next Exercise</div>
                <div className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                  {nextExercise.title}
                </div>
              </div>
              <div className="btn btn-circle btn-sm btn-neutral group-hover:btn-error shrink-0 ml-3.5 transition-transform group-hover:translate-x-1 duration-200">
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        ) : (
          <div className="card p-4 bg-neutral-950/40 border border-white/[0.04] opacity-40 text-right">
            <div className="text-[11px] text-neutral-500">Split Completed</div>
            <div className="text-sm text-neutral-400 font-semibold">Great Session!</div>
          </div>
        )}
      </motion.div>

      {/* Floating Active Rest Timer */}
      <AnimatePresence>
        {activeTimer && (
          <RestTimer 
            seconds={activeTimer.seconds} 
            exerciseName={exercise.title}
            setNumber={activeTimer.setNumber}
            onClose={() => setActiveTimer(null)} 
          />
        )}
      </AnimatePresence>

      {/* 11. Fullscreen Lightbox Modal (Blur backdrop & Spring scale container) */}
      <AnimatePresence>
        {isImageLightboxOpen && exercise.demoImage && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsImageLightboxOpen(false)}
            className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 sm:p-8"
          >
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsImageLightboxOpen(false)}
              className="btn btn-circle btn-sm btn-neutral absolute top-6 right-6 z-10"
              aria-label="Close fullscreen view"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[92vh] flex items-center justify-center"
            >
              <img 
                src={exercise.demoImage} 
                alt={exercise.title} 
                className="max-h-[88vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
