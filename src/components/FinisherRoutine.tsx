"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Flame, 
  Repeat, 
  Timer, 
  Play, 
  CheckCircle2, 
  Circle, 
  ArrowRightLeft, 
  Lightbulb, 
  Target 
} from "lucide-react";
import { 
  ABS_ROUTINE, 
  CALVES_ROUTINE, 
  FinisherRoutine as FinisherRoutineType 
} from "@/data/workoutData";

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

  const currentRoutine = activeType === "abs" ? ABS_ROUTINE : CALVES_ROUTINE;

  const toggleSet = (exerciseId: string, setNumber: number) => {
    const key = `${exerciseId}-${setNumber}`;
    setCompletedSets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="card relative overflow-hidden bg-neutral-900/90 border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 transition-all">
      {/* Background Glow */}
      <div className={`absolute top-0 left-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none ${
        activeType === "abs" ? "bg-amber-600/10" : "bg-red-600/10"
      }`} />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`badge badge-sm font-bold uppercase tracking-wider ${
              activeType === "abs" ? "badge-warning" : "badge-error"
            }`}>
              {currentRoutine.badge}
            </span>
            <span className="badge badge-neutral badge-sm text-neutral-300 font-mono">
              Workout #{workoutIndex} Scheduled Finisher
            </span>
            <span className="badge badge-outline badge-xs text-neutral-400">
              Alternates Every Workout Day
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {currentRoutine.title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            {currentRoutine.tagline}
          </p>
        </div>

        {/* Routine toggle switch (Abs vs Calves) */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <div className="join bg-neutral-950 p-1 rounded-2xl border border-neutral-800">
            <button
              onClick={() => setActiveType("abs")}
              className={`join-item btn btn-xs sm:btn-sm font-bold uppercase tracking-wider text-xs ${
                activeType === "abs" 
                  ? "btn-warning text-black font-extrabold" 
                  : "btn-ghost text-neutral-400 hover:text-white"
              }`}
            >
              Abs (Odd Days)
            </button>
            <button
              onClick={() => setActiveType("calves")}
              className={`join-item btn btn-xs sm:btn-sm font-bold uppercase tracking-wider text-xs ${
                activeType === "calves" 
                  ? "btn-error text-white font-extrabold" 
                  : "btn-ghost text-neutral-400 hover:text-white"
              }`}
            >
              Calves (Even Days)
            </button>
          </div>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="my-5 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-start gap-3 text-xs">
        <ArrowRightLeft className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <div className="text-neutral-300 leading-relaxed">
          <strong className="text-white font-semibold">Automatic Alternation Rule: </strong>
          {currentRoutine.frequencyRule}. Today is scheduled for <strong className="text-white uppercase">{activeType}</strong>. You can switch tabs anytime.
        </div>
      </div>

      {/* Routine Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {currentRoutine.exercises.map((ex, index) => {
          return (
            <div
              key={ex.id}
              className="card bg-black/60 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between hover:border-neutral-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-neutral badge-xs font-mono font-bold text-neutral-400">
                    MOVE 0{index + 1}
                  </span>
                  <span className="badge badge-outline badge-xs text-red-400 font-mono">
                    {ex.sets} Working Sets
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
                  {ex.name}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1 mb-3">
                  <Target className="w-3 h-3 text-neutral-500" />
                  <span>{ex.targetMuscle}</span>
                </div>

                <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs mb-3 font-mono">
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <Repeat className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{ex.reps}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <Timer className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{ex.restSeconds}s Rest</span>
                  </div>
                </div>

                {/* Coach Form Cue */}
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 mb-4 text-xs text-neutral-300 leading-relaxed">
                  <div className="text-[10px] font-mono uppercase text-red-400 font-bold mb-0.5 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-red-500" /> Form Cue
                  </div>
                  &quot;{ex.cue}&quot;
                </div>
              </div>

              {/* Set Check-off Boxes & Timer Button */}
              <div className="pt-3 border-t border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                  <span>Check off sets:</span>
                  {onStartRestTimer && (
                    <button
                      type="button"
                      onClick={() => onStartRestTimer(ex.restSeconds, ex.name)}
                      className="btn btn-xs btn-outline btn-error gap-1 text-[10px]"
                    >
                      <Play className="w-2.5 h-2.5" />
                      {ex.restSeconds}s Timer
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {Array.from({ length: ex.sets }).map((_, i) => {
                    const setNum = i + 1;
                    const isDone = !!completedSets[`${ex.id}-${setNum}`];
                    return (
                      <button
                        key={setNum}
                        onClick={() => toggleSet(ex.id, setNum)}
                        className={`btn btn-xs text-[10px] font-mono font-bold transition-all ${
                          isDone 
                            ? "btn-success text-white" 
                            : "btn-neutral text-neutral-400 hover:text-white"
                        }`}
                      >
                        S{setNum} {isDone ? "✓" : ""}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
