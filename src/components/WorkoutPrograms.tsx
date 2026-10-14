"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  WORKOUT_DAYS, 
  Exercise, 
  WorkoutDay 
} from "@/data/workoutData";
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  AlertTriangle, 
  Activity, 
  X, 
  Sparkles,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Check,
  Search,
  SlidersHorizontal,
  Dumbbell,
  Target,
  Repeat,
  Timer,
  Lightbulb,
  ExternalLink,
  BookOpen
} from "lucide-react";

// Interactive Rest Timer Floating Bar Component (DaisyUI styled)
export const RestTimer = ({ 
  seconds, 
  onClose,
  exerciseName,
  setNumber
}: { 
  seconds: number; 
  onClose: () => void;
  exerciseName: string;
  setNumber: number;
}) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isRunning, setIsRunning] = useState(true);

  // Synchronize when seconds changes
  const [prevSeconds, setPrevSeconds] = useState(seconds);
  if (prevSeconds !== seconds) {
    setPrevSeconds(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);
  }

  // Keyboard accessibility: Escape key dismisses timer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          try {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AudioContextClass) {
              const ctx = new AudioContextClass();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.setValueAtTime(880, ctx.currentTime);
              gain.gain.setValueAtTime(0.2, ctx.currentTime);
              osc.start();
              osc.stop(ctx.currentTime + 0.3);
            }
          } catch {
            // Audio context fallback
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const progress = ((seconds - timeLeft) / seconds) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.96 }}
      className="card fixed bottom-6 right-6 z-[200] max-w-sm w-[calc(100%-3rem)] bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/60 p-4 shadow-2xl text-white"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Timer className={`w-4 h-4 ${timeLeft === 0 ? "text-emerald-400" : "text-red-500 animate-pulse"}`} />
          <span className="badge badge-neutral text-[10px] font-mono uppercase tracking-wider font-semibold">
            Stopwatch {setNumber > 0 ? `Set ${setNumber}` : "Rest"}
          </span>
        </div>
        <button 
          onClick={onClose} 
          className="btn btn-ghost btn-circle btn-xs text-neutral-400 hover:text-white"
          aria-label="Close timer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="min-w-0 pr-3">
          <div className="text-xs font-bold truncate text-neutral-100">{exerciseName}</div>
          <div className="text-[11px] text-neutral-400">
            {timeLeft > 0 ? "Catch your breath & prepare for next set" : "Rest complete! Begin your set"}
          </div>
        </div>

        <div className="text-3xl font-mono font-bold tracking-tight text-white shrink-0">
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </div>
      </div>

      {/* DaisyUI Progress Bar */}
      <progress 
        className={`progress w-full h-2 mb-3 ${timeLeft === 0 ? "progress-success" : "progress-error"}`} 
        value={progress} 
        max="100" 
      />

      {/* Timer Controls with DaisyUI Buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800">
        <div className="flex gap-2">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className="btn btn-sm btn-neutral text-xs"
          >
            {isRunning ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Resume</>}
          </button>
          <button 
            onClick={() => { setTimeLeft(seconds); setIsRunning(true); }}
            className="btn btn-sm btn-ghost btn-circle text-xs text-neutral-300"
            title="Reset timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <button 
          onClick={onClose} 
          className="btn btn-ghost btn-xs text-neutral-400 hover:text-white"
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  );
};

// Modal For "How To Perform" & Form Guide (DaisyUI styled)
export const ExerciseGuideModal = ({ 
  exercise, 
  onClose 
}: { 
  exercise: Exercise | null; 
  onClose: () => void; 
}) => {
  useEffect(() => {
    if (!exercise) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [exercise, onClose]);

  if (!exercise) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[250] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          onClick={(e) => e.stopPropagation()}
          className="card relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-neutral-800 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-neutral gap-1.5 text-xs font-medium py-1">
                  <Dumbbell className="w-3.5 h-3.5 text-red-500" />
                  {exercise.equipment}
                </span>
                <span className="badge badge-outline text-xs text-neutral-400">
                  {exercise.sets.length} Sets Total
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">{exercise.title}</h3>
              <p className="text-sm text-neutral-400 mt-0.5">{exercise.subtitle}</p>
            </div>
            <button 
              onClick={onClose}
              className="btn btn-ghost btn-circle btn-sm text-neutral-400 hover:text-white"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Target Chips */}
          <div className="card bg-neutral-950/80 border border-neutral-800 p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-neutral-400 font-medium mb-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-red-500" />
                  Main Muscle Worked
                </div>
                <div className="text-sm font-semibold text-white">
                  {exercise.primaryMuscles.join(", ")}
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-400 font-medium mb-1 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-neutral-400" />
                  Assisting Muscles
                </div>
                <div className="text-sm text-neutral-300">
                  {exercise.secondaryMuscles.join(", ")}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-neutral-300 font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                How to Set Up
              </h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                {exercise.howToPerform.setup.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-red-500 font-mono font-bold shrink-0">{idx + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-neutral-300 font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                How to Perform
              </h4>
              <ul className="space-y-2 text-sm text-neutral-300">
                {exercise.howToPerform.execution.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-red-500 font-mono font-bold shrink-0">{idx + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="card bg-neutral-950/70 border border-neutral-800 p-4">
                <div className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-red-500" />
                  Coach Evan&apos;s Tip
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-300 leading-relaxed">
                  {exercise.howToPerform.proTips.map((tip, i) => (
                    <li key={i}>• {tip}</li>
                  ))}
                </ul>
              </div>

              <div className="card bg-neutral-950/70 border border-neutral-800 p-4">
                <div className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Mistakes to Avoid
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-300 leading-relaxed">
                  {exercise.howToPerform.commonMistakes.map((mistake, i) => (
                    <li key={i}>• {mistake}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/workouts/${exercise.slug}`}
              onClick={onClose}
              className="btn btn-sm btn-ghost gap-2 text-xs font-semibold text-neutral-300 hover:text-white"
            >
              <span>Open Full Visual Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={onClose}
              className="btn btn-sm btn-error text-white font-bold"
            >
              Ready to Lift
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main Workout Programs Component
export default function WorkoutPrograms() {
  const [selectedDay, setSelectedDay] = useState<"leg-day" | "arm-day">("leg-day");
  const [collapsedExercises, setCollapsedExercises] = useState<Record<string, boolean>>({});
  const [activeTimer, setActiveTimer] = useState<{ seconds: number; exerciseName: string; setNumber: number } | null>(null);
  const [activeModalExercise, setActiveModalExercise] = useState<Exercise | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [filterType, setFilterType] = useState<"all" | "machine" | "freeweight">("all");
  
  // Custom dropdown states
  const [openDayDropdown, setOpenDayDropdown] = useState(false);
  const [openExerciseJump, setOpenExerciseJump] = useState(false);
  const [openFilterDropdown, setOpenFilterDropdown] = useState(false);
  const [highlightedExerciseId, setHighlightedExerciseId] = useState<string | null>(null);

  const dayDropdownRef = useRef<HTMLDivElement>(null);
  const exerciseDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dayDropdownRef.current && !dayDropdownRef.current.contains(e.target as Node)) {
        setOpenDayDropdown(false);
      }
      if (exerciseDropdownRef.current && !exerciseDropdownRef.current.contains(e.target as Node)) {
        setOpenExerciseJump(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node)) {
        setOpenFilterDropdown(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDayDropdown(false);
        setOpenExerciseJump(false);
        setOpenFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const currentWorkout = WORKOUT_DAYS.find((d) => d.id === selectedDay) || WORKOUT_DAYS[0];

  const toggleExerciseCollapse = (exerciseId: string) => {
    setCollapsedExercises((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const handleExpandAll = () => {
    setCollapsedExercises({});
  };

  const handleCollapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    currentWorkout.exercises.forEach((ex) => {
      allCollapsed[ex.id] = true;
    });
    setCollapsedExercises(allCollapsed);
  };

  const toggleSetCompleted = (exerciseId: string, setNumber: number) => {
    const key = `${exerciseId}-${setNumber}`;
    setCompletedSets((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleJumpToExercise = (exerciseId: string) => {
    setCollapsedExercises((prev) => ({
      ...prev,
      [exerciseId]: false
    }));
    setHighlightedExerciseId(exerciseId);
    setTimeout(() => {
      const el = document.getElementById(`exercise-${exerciseId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
    setTimeout(() => {
      setHighlightedExerciseId(null);
    }, 3000);
  };

  const calculateDayProgress = () => {
    let totalSets = 0;
    let finished = 0;
    currentWorkout.exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        totalSets++;
        if (completedSets[`${ex.id}-${s.setNumber}`]) {
          finished++;
        }
      });
    });
    return totalSets > 0 ? Math.round((finished / totalSets) * 100) : 0;
  };

  // Filter exercises cleanly
  const filteredExercises = currentWorkout.exercises.filter((ex) => {
    if (filterType === "all") return true;
    if (filterType === "machine") return ex.equipment.toLowerCase().includes("machine") || ex.equipment.toLowerCase().includes("cable") || ex.equipment.toLowerCase().includes("sled");
    if (filterType === "freeweight") return ex.equipment.toLowerCase().includes("barbell") || ex.equipment.toLowerCase().includes("dumbbell");
    return true;
  });

  return (
    <section id="programs" className="relative w-full bg-[#070708] text-white py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="badge badge-error badge-outline gap-2 mb-3 py-3 px-4 font-mono text-xs uppercase tracking-wider font-semibold">
            <Flame className="w-3.5 h-3.5 text-red-500" />
            <span>Evan Austin Training Split</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            Daily Workout <span className="text-red-600">Workouts</span>
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            Follow Evan&apos;s exact personal workout routines. Track your working sets, use the built-in rest timers, 
            and tap any movement for simple, clear form instructions.
          </p>
        </div>

        {/* Coach Evan's Core Rule Card (DaisyUI Alert/Card) */}
        <div className="card max-w-3xl mx-auto mb-10 bg-neutral-900 border border-neutral-800 shadow-2xl p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-grow">
              <div className="badge badge-error badge-sm uppercase tracking-wider font-bold mb-1">
                Coach Evan&apos;s Weight Rule
              </div>
              <p className="text-base sm:text-lg font-bold text-white leading-snug">
                &quot;Make sure your weight is heavy enough so the last rep of each set feels difficult.&quot;
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                If the last repetition feels too easy, increase the weight on your next set.
              </p>
            </div>
          </div>
        </div>

        {/* Workout Control Bar: Split Selector, Jump & Filter (DaisyUI Styled) */}
        <div className="card bg-neutral-900/80 border border-neutral-800 p-4 sm:p-5 mb-8 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-red-500" />
              <span className="text-xs uppercase tracking-wider text-neutral-300 font-bold">
                Workout Controls
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExpandAll}
                className="btn btn-xs btn-neutral text-neutral-300"
              >
                Expand All
              </button>
              <button
                onClick={handleCollapseAll}
                className="btn btn-xs btn-neutral text-neutral-300"
              >
                Collapse All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Split Switcher */}
            <div className="relative" ref={dayDropdownRef}>
              <button
                type="button"
                onClick={() => setOpenDayDropdown(!openDayDropdown)}
                className="btn btn-sm btn-outline bg-neutral-950 border-neutral-800 w-full justify-between font-normal text-left"
              >
                <div className="flex items-center gap-2 truncate">
                  <Flame className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="font-bold text-sm text-white">{currentWorkout.name}</span>
                  <span className="text-xs text-neutral-400">({currentWorkout.totalExercises})</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openDayDropdown ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {openDayDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="card absolute top-full left-0 mt-2 w-full z-50 bg-neutral-900 border border-neutral-700 shadow-2xl p-2 space-y-1"
                  >
                    {WORKOUT_DAYS.map((day) => {
                      const isSelected = selectedDay === day.id;
                      return (
                        <button
                          key={day.id}
                          onClick={() => {
                            setSelectedDay(day.id);
                            setOpenDayDropdown(false);
                          }}
                          className={`btn btn-sm w-full justify-between text-left text-xs ${
                            isSelected ? "btn-error text-white font-bold" : "btn-ghost text-neutral-300"
                          }`}
                        >
                          <div>{day.name}</div>
                          <span className="badge badge-neutral badge-xs">{day.totalExercises} Moves</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Jump to Exercise */}
            <div className="relative" ref={exerciseDropdownRef}>
              <button
                type="button"
                onClick={() => setOpenExerciseJump(!openExerciseJump)}
                className="btn btn-sm btn-outline bg-neutral-950 border-neutral-800 w-full justify-between font-normal text-left"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="text-xs text-neutral-300 truncate">Jump to Exercise...</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openExerciseJump ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {openExerciseJump && (
                  <motion.div 
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="card absolute top-full left-0 mt-2 w-full z-50 max-h-64 overflow-y-auto bg-neutral-900 border border-neutral-700 shadow-2xl p-2 space-y-1"
                  >
                    {currentWorkout.exercises.map((ex, idx) => (
                      <button
                        key={ex.id}
                        onClick={() => {
                          handleJumpToExercise(ex.id);
                          setOpenExerciseJump(false);
                        }}
                        className="btn btn-sm btn-ghost w-full justify-between text-left text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-red-500 font-mono font-bold">{idx + 1}.</span>
                          <span className="text-neutral-200 truncate">{ex.title}</span>
                        </div>
                        <span className="badge badge-neutral badge-xs">{ex.sets.length} Sets</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Movement Filter */}
            <div className="relative" ref={filterDropdownRef}>
              <button
                type="button"
                onClick={() => setOpenFilterDropdown(!openFilterDropdown)}
                className="btn btn-sm btn-outline bg-neutral-950 border-neutral-800 w-full justify-between font-normal text-left"
              >
                <div className="flex items-center gap-2 truncate">
                  <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="text-xs text-neutral-300 capitalize">
                    {filterType === "all" ? "All Equipment" : filterType === "machine" ? "Machines & Cables" : "Barbells & Dumbbells"}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openFilterDropdown ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {openFilterDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="card absolute top-full left-0 mt-2 w-full z-50 bg-neutral-900 border border-neutral-700 shadow-2xl p-2 space-y-1"
                  >
                    {[
                      { id: "all" as const, label: "All Equipment (Complete Day)" },
                      { id: "freeweight" as const, label: "Barbells & Dumbbells Only" },
                      { id: "machine" as const, label: "Machines & Cables Only" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setFilterType(f.id);
                          setOpenFilterDropdown(false);
                        }}
                        className={`btn btn-sm w-full justify-between text-left text-xs ${
                          filterType === f.id ? "btn-error text-white font-bold" : "btn-ghost text-neutral-300"
                        }`}
                      >
                        <span>{f.label}</span>
                        {filterType === f.id && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Day Selector Buttons & Session Progress (DaisyUI Join & Progress) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-800">
          <div className="join w-full sm:w-auto">
            {WORKOUT_DAYS.map((day) => {
              const isActive = selectedDay === day.id;
              return (
                <button
                  key={day.id}
                  onClick={() => setSelectedDay(day.id)}
                  className={`btn join-item btn-sm font-semibold uppercase tracking-wider flex-1 sm:flex-initial ${
                    isActive ? "btn-error text-white" : "btn-neutral text-neutral-400 hover:text-white"
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-neutral-500"}`} />
                  <span>{day.name}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Time: {currentWorkout.estimatedDuration}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Done:</span>
              <progress 
                className="progress progress-error w-20 h-2.5" 
                value={calculateDayProgress()} 
                max="100" 
              />
              <span className="font-bold text-red-500 font-mono">{calculateDayProgress()}%</span>
            </div>
          </div>
        </div>

        {/* Exercise List Boxes (DaisyUI Cards) */}
        <div className="space-y-4">
          {filteredExercises.map((exercise, index) => {
            const isCollapsed = !!collapsedExercises[exercise.id];
            const isHighlighted = highlightedExerciseId === exercise.id;

            return (
              <div
                key={exercise.id}
                id={`exercise-${exercise.id}`}
                className={`card bg-neutral-900/80 border transition-all duration-200 overflow-hidden shadow-xl ${
                  isHighlighted 
                    ? "border-red-500 ring-2 ring-red-500" 
                    : "border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {/* Card Header Accordion Trigger */}
                <div 
                  onClick={() => toggleExerciseCollapse(exercise.id)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="badge badge-error badge-sm font-mono font-bold shrink-0">
                      0{index + 1}
                    </span>

                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-white hover:text-red-400 transition-colors truncate">
                        {exercise.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-neutral-400">
                        <span className="inline-flex items-center gap-1">
                          <Dumbbell className="w-3 h-3 text-neutral-500" />
                          {exercise.equipment}
                        </span>
                        <span>•</span>
                        <span className="text-neutral-300 font-medium">
                          {exercise.sets.length} Sets Total
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/workouts/${exercise.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="btn btn-xs sm:btn-sm btn-error text-white font-semibold hidden sm:inline-flex"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Full Guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>

                    <div className="btn btn-circle btn-xs btn-neutral text-neutral-400">
                      {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>

                {/* Accordion Body */}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-neutral-800/80"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* LEFT COLUMN: Overview, Muscles, Cue, and Guide Link */}
                        <div className="lg:col-span-5 space-y-4">
                          <div>
                            <p className="text-xs text-neutral-400 mb-3">{exercise.subtitle}</p>

                            <div className="space-y-2">
                              <div className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5 text-red-500" />
                                Main Muscle Worked:
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {exercise.primaryMuscles.map((muscle) => (
                                  <span 
                                    key={muscle}
                                    className="badge badge-neutral text-xs font-medium"
                                  >
                                    {muscle}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Coach Tip Box */}
                          <div className="card bg-neutral-950/70 border border-neutral-800 p-3.5">
                            <div className="text-xs font-bold text-red-400 mb-1 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-red-500" />
                              Key Execution Cue
                            </div>
                            <p className="text-xs text-neutral-300 leading-relaxed">
                              &quot;{exercise.generalFormCue}&quot;
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            <Link
                              href={`/workouts/${exercise.slug}`}
                              className="btn btn-sm btn-error text-white font-bold flex-1"
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>View Form Guide & Photo</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => setActiveModalExercise(exercise)}
                              className="btn btn-sm btn-neutral text-neutral-200"
                            >
                              <span>Step-by-Step Cues</span>
                            </button>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Set-by-Set Targets & Rest Timers */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wider text-neutral-300 font-bold flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-red-500" />
                              Working Sets & Targets
                            </span>
                            <span className="text-xs text-neutral-400">
                              Tap to check off
                            </span>
                          </div>

                          {/* Sets Grid (DaisyUI Cards) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {exercise.sets.map((set) => {
                              const key = `${exercise.id}-${set.setNumber}`;
                              const isCompleted = !!completedSets[key];

                              return (
                                <div 
                                  key={set.setNumber}
                                  onClick={() => toggleSetCompleted(exercise.id, set.setNumber)}
                                  className={`card cursor-pointer p-3.5 border transition-all ${
                                    isCompleted 
                                      ? "bg-emerald-950/20 border-emerald-600/40" 
                                      : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="badge badge-outline badge-xs font-mono font-bold text-neutral-300">
                                      SET {set.setNumber}
                                    </span>
                                    
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-neutral-600 hover:text-neutral-400" />
                                    )}
                                  </div>

                                  <div className="flex items-baseline justify-between mb-2">
                                    <div className="text-lg font-bold text-white flex items-center gap-1.5">
                                      <Repeat className="w-3.5 h-3.5 text-neutral-500" />
                                      {set.reps}
                                    </div>
                                    <div className="text-xs text-neutral-400 flex items-center gap-1 font-mono">
                                      <Timer className="w-3 h-3 text-neutral-500" />
                                      {set.restSeconds}s
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                                    <span className="text-[11px] text-neutral-400 truncate pr-2">
                                      {set.notes || "Standard set"}
                                    </span>

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveTimer({
                                          seconds: set.restSeconds,
                                          exerciseName: exercise.title,
                                          setNumber: set.setNumber
                                        });
                                      }}
                                      className="btn btn-xs btn-outline btn-error gap-1 text-[10px]"
                                    >
                                      <Play className="w-2.5 h-2.5" />
                                      Timer
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Between Exercise Transition Bar */}
                          <div className="card bg-neutral-950 border border-neutral-800 p-3 flex flex-row items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-neutral-300">
                              <Clock className="w-3.5 h-3.5 text-red-500" />
                              <span>Rest Before Next Exercise: <strong>{exercise.betweenExerciseRest} sec</strong></span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTimer({
                                  seconds: exercise.betweenExerciseRest,
                                  exerciseName: `Transition: ${exercise.title}`,
                                  setNumber: 0
                                });
                              }}
                              className="btn btn-xs btn-error text-white font-bold"
                            >
                              Start Rest
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>

      {/* Floating Rest Timer */}
      <AnimatePresence>
        {activeTimer && (
          <RestTimer
            seconds={activeTimer.seconds}
            exerciseName={activeTimer.exerciseName}
            setNumber={activeTimer.setNumber}
            onClose={() => setActiveTimer(null)}
          />
        )}
      </AnimatePresence>

      {/* Exercise Guide Modal */}
      <ExerciseGuideModal 
        exercise={activeModalExercise}
        onClose={() => setActiveModalExercise(null)}
      />
    </section>
  );
}
