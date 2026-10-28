"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Dumbbell, 
  Target, 
  Repeat, 
  Timer, 
  Lightbulb, 
  Layers,
  ArrowRightLeft,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { 
  ABS_ROUTINE, 
  CALVES_ROUTINE, 
  FinisherRoutine as FinisherRoutineType,
  FinisherExercise
} from "@/data/workoutData";
import { playTimerSound } from "@/utils/sound";

interface FinisherRoutineProps {
  workoutIndex?: number; // 1-indexed, e.g. 1 for Day 1, 2 for Day 2, etc.
  onStartRestTimer?: (seconds: number, exerciseName: string) => void;
}

export default function FinisherRoutine({
  workoutIndex = 1,
  onStartRestTimer
}: FinisherRoutineProps) {
  // Client requirement: Workout Day 1 = Abs, Day 2 = Calves, Day 3 = Abs, Day 4 = Calves
  const defaultRoutineType: "abs" | "calves" = workoutIndex % 2 === 1 ? "abs" : "calves";
  const [activeType, setActiveType] = useState<"abs" | "calves">(defaultRoutineType);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [collapsedExercises, setCollapsedExercises] = useState<Record<string, boolean>>({});

  const currentRoutine = activeType === "abs" ? ABS_ROUTINE : CALVES_ROUTINE;

  const toggleExerciseCollapse = (exerciseId: string) => {
    setCollapsedExercises((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const toggleSetCompleted = (exerciseId: string, setNumber: number) => {
    const key = `${exerciseId}-${setNumber}`;
    setCompletedSets((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const calculateProgress = () => {
    let total = 0;
    let completed = 0;
    currentRoutine.exercises.forEach((ex) => {
      total += ex.sets;
      for (let s = 1; s <= ex.sets; s++) {
        if (completedSets[`${ex.id}-${s}`]) completed++;
      }
    });
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <div id="finisher-routine" className="space-y-6">
      {/* Section Header with Day Switcher Tabs */}
      <div className="card bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 rounded-3xl shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`badge badge-sm font-bold uppercase tracking-wider ${
                activeType === "abs" ? "badge-error text-white" : "badge-error text-white"
              }`}>
                Phase 03: Finisher
              </span>
              <span className="badge badge-neutral badge-sm text-neutral-300 font-mono">
                Workout #{workoutIndex} Scheduled
              </span>
              <span className="badge badge-outline badge-xs text-neutral-400">
                Alternates Daily (Abs ↔ Calves)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {currentRoutine.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              {currentRoutine.tagline}
            </p>
          </div>

          {/* Routine Switcher Tab Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
            <div className="join bg-neutral-950 p-1 rounded-2xl border border-neutral-800">
              <button
                onClick={() => {
                  playTimerSound("select");
                  setActiveType("abs");
                }}
                className={`join-item btn btn-xs sm:btn-sm font-bold uppercase tracking-wider text-xs gap-1.5 ${
                  activeType === "abs" 
                    ? "btn-error text-white font-extrabold" 
                    : "btn-ghost text-neutral-400 hover:text-white"
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${activeType === "abs" ? "text-white" : "text-neutral-500"}`} />
                <span>Abs (5 Exercises)</span>
              </button>
              <button
                onClick={() => {
                  playTimerSound("select");
                  setActiveType("calves");
                }}
                className={`join-item btn btn-xs sm:btn-sm font-bold uppercase tracking-wider text-xs gap-1.5 ${
                  activeType === "calves" 
                    ? "btn-error text-white font-extrabold" 
                    : "btn-ghost text-neutral-400 hover:text-white"
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${activeType === "calves" ? "text-white" : "text-neutral-500"}`} />
                <span>Calves (2 Exercises)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress & Meta Bar */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <ArrowRightLeft className="w-3.5 h-3.5 text-red-500" />
            <span>
              Follow strictly in sequence (01 → 0{currentRoutine.exercises.length}).
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Est. 12 - 15 min</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Done:</span>
              <progress 
                className="progress progress-error w-20 h-2.5" 
                value={calculateProgress()} 
                max="100" 
              />
              <span className="font-bold text-red-500 font-mono">{calculateProgress()}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise List Boxes (Exact DaisyUI & Accordion Theme from WorkoutPrograms) */}
      <div className="space-y-4">
        {currentRoutine.exercises.map((exercise, index) => {
          const isCollapsed = !!collapsedExercises[exercise.id];

          return (
            <div
              key={exercise.id}
              id={`finisher-${exercise.id}`}
              className="card bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all duration-200 overflow-hidden shadow-xl"
            >
              {/* Card Header Accordion Trigger */}
              <div 
                onClick={() => {
                  playTimerSound("click");
                  toggleExerciseCollapse(exercise.id);
                }}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="badge badge-error badge-sm font-mono font-bold shrink-0">
                    0{index + 1}
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-white hover:text-red-400 transition-colors truncate">
                      {exercise.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-neutral-400">
                      <span className="inline-flex items-center gap-1">
                        <Dumbbell className="w-3 h-3 text-neutral-500" />
                        {exercise.equipment}
                      </span>
                      <span>•</span>
                      <span className="text-neutral-300 font-medium">
                        {exercise.sets} Sets Total ({exercise.reps})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
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
                      
                      {/* LEFT COLUMN: Overview, Muscles, Cue, and Photo/Diagram */}
                      <div className="lg:col-span-5 space-y-4">
                        {/* Exercise Photo / Diagram */}
                        {exercise.demoImage && (
                          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/60 border border-neutral-800 group">
                            <img
                              src={exercise.demoImage}
                              alt={exercise.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-2 left-3 right-3 text-xs text-white/90 font-medium drop-shadow-md">
                              {exercise.name} Demonstration
                            </div>
                          </div>
                        )}

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

                        {/* Action Buttons: Exact same as other sections */}
                        <div className="pt-1">
                          <Link
                            href={`/workouts/${exercise.slug}`}
                            onClick={() => playTimerSound("select")}
                            className="btn btn-sm btn-error text-white font-bold w-full flex items-center justify-center gap-2"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>View Form Guide & Diagram</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
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

                        {/* Sets Grid (Exact DaisyUI Cards) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {exercise.setDetails.map((set) => {
                            const key = `${exercise.id}-${set.setNumber}`;
                            const isCompleted = !!completedSets[key];

                            return (
                              <div 
                                key={set.setNumber}
                                onClick={() => {
                                  playTimerSound("click");
                                  toggleSetCompleted(exercise.id, set.setNumber);
                                }}
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
                                    <Timer className="w-3.5 h-3.5 text-neutral-500" />
                                    {set.restSeconds}s
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                                  <span className="text-[11px] text-neutral-400 truncate pr-2">
                                    {set.notes || "Strict execution"}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playTimerSound("start");
                                      if (onStartRestTimer) {
                                        onStartRestTimer(set.restSeconds, `${exercise.name} (Set ${set.setNumber})`);
                                      }
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
                        {exercise.betweenExerciseRest > 0 ? (
                          <div className="card bg-neutral-950 border border-neutral-800 p-3 flex flex-row items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-neutral-300">
                              <Clock className="w-3.5 h-3.5 text-red-500" />
                              <span>Rest Before Next Move: <strong>{exercise.betweenExerciseRest} sec</strong></span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                playTimerSound("start");
                                if (onStartRestTimer) {
                                  onStartRestTimer(exercise.betweenExerciseRest, `Transition Rest: Move 0${index + 2}`);
                                }
                              }}
                              className="btn btn-xs btn-error text-white font-bold"
                            >
                              Start Rest
                            </button>
                          </div>
                        ) : (
                          <div className="card bg-neutral-950/60 border border-neutral-800/60 p-3 text-center text-xs text-neutral-400 font-mono">
                            ✓ Grand Finisher of Routine Completed
                          </div>
                        )}
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
  );
}
