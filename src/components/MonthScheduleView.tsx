"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Flame, 
  HeartPulse, 
  Dumbbell, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  Info
} from "lucide-react";
import { 
  FULL_MONTH_SCHEDULE, 
  ScheduledWorkoutDay, 
  WorkoutDay 
} from "@/data/workoutData";

interface MonthScheduleViewProps {
  currentDayId?: string;
  onSelectDay?: (splitId: WorkoutDay["id"], workoutNumber: number) => void;
}

export default function MonthScheduleView({
  currentDayId,
  onSelectDay
}: MonthScheduleViewProps) {
  const [selectedWeek, setSelectedWeek] = useState<number>(1); // 1, 2, 3, 4

  const week1 = FULL_MONTH_SCHEDULE.slice(0, 7);
  const week2 = FULL_MONTH_SCHEDULE.slice(7, 14);
  const week3 = FULL_MONTH_SCHEDULE.slice(14, 21);
  const week4 = FULL_MONTH_SCHEDULE.slice(21, 28);

  const weeks = [
    { number: 1, label: "Week 1 (Days 1-7)", days: week1 },
    { number: 2, label: "Week 2 (Days 8-14)", days: week2 },
    { number: 3, label: "Week 3 (Days 15-21)", days: week3 },
    { number: 4, label: "Week 4 (Days 22-28)", days: week4 },
  ];

  const currentWeekDays = weeks.find((w) => w.number === selectedWeek)?.days || week1;

  return (
    <div className="card bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-error badge-sm font-bold uppercase tracking-wider gap-1 text-white">
              <Calendar className="w-3.5 h-3.5" />
              Full Month Blueprint
            </span>
            <span className="badge badge-neutral badge-sm text-neutral-300 font-mono">
              28-Day Progressive Cycle
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Automated Monthly Workout Rotation
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Strict client alternating cycle: Workout 1 = Abs, Workout 2 = Calves, Workout 3 = Abs, Workout 4 = Calves, continuously sequenced through all 4 weeks with 20 min cardio on every training day.
          </p>
        </div>

        {/* Week Selector Tabs */}
        <div className="join bg-neutral-950 p-1 rounded-2xl border border-neutral-800 self-start sm:self-center shrink-0">
          {[1, 2, 3, 4].map((wk) => (
            <button
              key={wk}
              onClick={() => setSelectedWeek(wk)}
              className={`join-item btn btn-xs sm:btn-sm font-bold font-mono ${
                selectedWeek === wk 
                  ? "btn-error text-white font-extrabold" 
                  : "btn-ghost text-neutral-400 hover:text-white"
              }`}
            >
              Week {wk}
            </button>
          ))}
        </div>
      </div>

      {/* Rule Notice */}
      <div className="my-5 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-neutral-300">
          <Info className="w-4 h-4 text-red-500 shrink-0" />
          <span>
            <strong>Month Sequence:</strong> Every lifting day includes 20m Cardio + alternates between <strong>Abs</strong> (Odd Workouts) and <strong>Calves</strong> (Even Workouts).
          </span>
        </div>
      </div>

      {/* 7-Day Week Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {currentWeekDays.map((day) => {
          const isTraining = !day.isRest;
          const isAbs = day.coreOrCalf === "abs";
          const isCalves = day.coreOrCalf === "calves";
          const isCurrentActive = day.splitId === currentDayId;

          return (
            <div
              key={day.dayName}
              onClick={() => {
                if (isTraining && onSelectDay && day.splitId !== "rest") {
                  onSelectDay(day.splitId as WorkoutDay["id"], day.workoutNumber);
                }
              }}
              className={`card p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isCurrentActive 
                  ? "border-red-500 bg-red-950/20 ring-1 ring-red-500" 
                  : isTraining 
                    ? "bg-black/60 border-neutral-800 hover:border-neutral-700 cursor-pointer group" 
                    : "bg-neutral-950/40 border-neutral-900 text-neutral-500"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-neutral-400">
                    {day.dayName}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {day.dayOfWeek.slice(0, 3)}
                  </span>
                </div>

                {isTraining ? (
                  <>
                    <div className="badge badge-error badge-xs font-mono font-bold mb-2 text-white">
                      Workout #{day.workoutNumber}
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors leading-snug mb-1">
                      {day.splitName}
                    </h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 mb-3">
                      {day.focus}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="badge badge-neutral badge-xs font-mono text-neutral-500 mb-2">
                      Rest Day
                    </div>
                    <h4 className="text-sm font-bold text-neutral-400 mb-1">
                      Active Recovery
                    </h4>
                    <p className="text-[11px] text-neutral-600 line-clamp-2 mb-3">
                      Mobility & Walk
                    </p>
                  </>
                )}
              </div>

              {/* Bottom tags */}
              <div className="pt-3 border-t border-neutral-800/80 space-y-1.5">
                {isTraining && (
                  <>
                    {/* Finisher Rotation Tag */}
                    <div className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold flex items-center justify-between ${
                      isAbs 
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30" 
                        : "bg-red-500/15 text-red-300 border border-red-500/30"
                    }`}>
                      <span>Finisher:</span>
                      <span className="uppercase">{day.coreOrCalf}</span>
                    </div>

                    {/* Cardio Tag */}
                    <div className="px-2 py-0.5 rounded-md bg-neutral-900 text-[10px] text-neutral-400 flex items-center justify-between font-mono">
                      <span>Cardio:</span>
                      <span className="text-white font-bold">20 Min</span>
                    </div>
                  </>
                )}

                {!isTraining && (
                  <div className="text-[10px] font-mono text-neutral-600 text-center py-1">
                    Light Recovery
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
