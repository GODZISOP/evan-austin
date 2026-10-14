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

// Professional Muscle Anatomy Visual with Targeted Muscle Pulse
const MuscleAnatomyVisual = ({ 
  exercise 
}: { 
  exercise: Exercise 
}) => {
  const isBicep = exercise.id.includes("bicep") || exercise.id.includes("curl");
  const isTricep = exercise.id.includes("tricep") || exercise.id.includes("skull");
  
  const isQuads = exercise.id.includes("leg-ext") || exercise.id.includes("squat") || exercise.id.includes("press");
  const isHamstrings = exercise.id.includes("hamstring");
  const isGlutes = exercise.id.includes("outer") || exercise.id.includes("lunge");
  const isAdductor = exercise.id.includes("inner");

  return (
    <div className="card relative w-full rounded-2xl bg-neutral-950 p-6 flex flex-col items-center justify-center overflow-hidden border border-white/[0.06]">
      {/* Background Subtle Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.12),transparent_70%)] pointer-events-none" />

      {/* SVG Silhouette Schematic */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, delay: 0.1, ease: CINEMATIC_EASE }}
        className="relative w-48 h-64 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 200 300"
          className="w-full h-full text-neutral-800"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head & Neck */}
          <circle cx="100" cy="35" r="18" className="text-neutral-800" />
          <path d="M92 53 H108 V62 H92 Z" className="text-neutral-800" />

          {/* Shoulders / Traps */}
          <path d="M70 65 Q100 60 130 65 L145 78 L55 78 Z" className="text-neutral-800" />

          {/* Chest & Torso */}
          <path d="M60 80 H140 L132 140 H68 Z" className="text-neutral-800" />

          {/* Abdominals / Core */}
          <path d="M72 142 H128 L122 175 H78 Z" className="text-neutral-800" />

          {/* Left Arm (Viewer Left) */}
          <motion.path 
            d="M52 82 L38 125 L48 130 L60 90 Z" 
            initial={isBicep || isTricep ? { opacity: 0.4, scale: 0.9 } : undefined}
            whileInView={isBicep || isTricep ? { opacity: 1, scale: [0.9, 1.04, 1] } : undefined}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: 0.25, ease: CINEMATIC_EASE }}
            className={`transition-colors duration-300 ${
              isBicep ? "text-red-500 fill-red-500" : isTricep ? "text-red-600/80 fill-red-600/80" : "text-neutral-800"
            }`} 
          />
          <path d="M36 128 L28 170 L38 172 L46 132 Z" className="text-neutral-800" />

          {/* Right Arm (Viewer Right) */}
          <motion.path 
            d="M148 82 L162 125 L152 130 L140 90 Z" 
            initial={isBicep || isTricep ? { opacity: 0.4, scale: 0.9 } : undefined}
            whileInView={isBicep || isTricep ? { opacity: 1, scale: [0.9, 1.04, 1] } : undefined}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: 0.25, ease: CINEMATIC_EASE }}
            className={`transition-colors duration-300 ${
              isBicep ? "text-red-500 fill-red-500" : isTricep ? "text-red-600/80 fill-red-600/80" : "text-neutral-800"
            }`} 
          />
          <path d="M164 128 L172 170 L162 172 L154 132 Z" className="text-neutral-800" />

          {/* Pelvis / Hips */}
          <motion.path 
            d="M75 177 H125 L135 200 H65 Z" 
            initial={isGlutes || isAdductor ? { opacity: 0.4, scale: 0.9 } : undefined}
            whileInView={isGlutes || isAdductor ? { opacity: 1, scale: [0.9, 1.04, 1] } : undefined}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: 0.25, ease: CINEMATIC_EASE }}
            className={`transition-colors duration-300 ${
              isGlutes || isAdductor ? "text-red-500 fill-red-500" : "text-neutral-800"
            }`} 
          />

          {/* Left Leg - Quads/Hamstrings */}
          <motion.path 
            d="M68 202 L60 250 L86 250 L92 202 Z" 
            initial={isQuads || isHamstrings ? { opacity: 0.4, scale: 0.9 } : undefined}
            whileInView={isQuads || isHamstrings ? { opacity: 1, scale: [0.9, 1.04, 1] } : undefined}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: 0.25, ease: CINEMATIC_EASE }}
            className={`transition-colors duration-300 ${
              isQuads ? "text-red-500 fill-red-500" : isHamstrings ? "text-orange-500 fill-orange-500" : "text-neutral-800"
            }`} 
          />
          {/* Left Calf */}
          <path d="M62 254 L58 290 L78 290 L84 254 Z" className="text-neutral-800" />

          {/* Right Leg - Quads/Hamstrings */}
          <motion.path 
            d="M108 202 L114 250 L140 250 L132 202 Z" 
            initial={isQuads || isHamstrings ? { opacity: 0.4, scale: 0.9 } : undefined}
            whileInView={isQuads || isHamstrings ? { opacity: 1, scale: [0.9, 1.04, 1] } : undefined}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: 0.25, ease: CINEMATIC_EASE }}
            className={`transition-colors duration-300 ${
              isQuads ? "text-red-500 fill-red-500" : isHamstrings ? "text-orange-500 fill-orange-500" : "text-neutral-800"
            }`} 
          />
          {/* Right Calf */}
          <path d="M116 254 L122 290 L142 290 L138 254 Z" className="text-neutral-800" />
        </svg>

        {/* Anatomical Target Pin Overlay */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.35, ease: CINEMATIC_EASE }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {exercise.dayId === "leg-day" && (
            <div className="absolute top-[72%] w-24 h-12 border border-red-500/40 rounded-full bg-red-600/10 backdrop-blur-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="badge badge-error badge-xs font-mono">
                {exercise.primaryMuscles[0]}
              </span>
            </div>
          )}

          {exercise.dayId === "arm-day" && (
            <div className="absolute top-[38%] w-36 h-10 border border-red-500/40 rounded-full bg-red-600/10 backdrop-blur-[1px] flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="badge badge-error badge-xs font-mono">
                {exercise.primaryMuscles[0]}
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Target Focus Description */}
      <div className="mt-4 text-center">
        <div className="text-xs font-bold text-white uppercase tracking-wider">
          Primary Target: <span className="text-red-500">{exercise.primaryMuscles.join(", ")}</span>
        </div>
        {exercise.secondaryMuscles.length > 0 && (
          <div className="text-[11px] text-neutral-400 mt-0.5">
            Secondary: {exercise.secondaryMuscles.join(", ")}
          </div>
        )}
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

      {/* 7. LARGE EXERCISE DEMONSTRATION IMAGE (Animate on scroll enter) */}
      {exercise.demoImage && (
        <motion.div 
          ref={imageContainerRef}
          initial={{ opacity: 0, y: 70, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: CINEMATIC_EASE }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-red-500" />
              Exercise Demonstration
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
                    className="badge badge-neutral text-white text-xs font-semibold py-3"
                  >
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
