"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Circle, 
  Timer, 
  Target, 
  Sparkles,
  Play,
  RotateCcw
} from "lucide-react";
import { StretchItem } from "@/data/workoutData";

interface StretchingSectionProps {
  title: string;
  subtitle: string;
  badge: string;
  phase: "pre" | "post";
  stretches: StretchItem[];
  onAllCompleted?: (completed: boolean) => void;
}

export default function StretchingSection({
  title,
  subtitle,
  badge,
  phase,
  stretches,
  onAllCompleted
}: StretchingSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [completedStretches, setCompletedStretches] = useState<Record<string, boolean>>({});
  const [activeStretchTimer, setActiveStretchTimer] = useState<{ id: string; seconds: number; total: number } | null>(null);

  const toggleStretch = (id: string) => {
    const nextState = { ...completedStretches, [id]: !completedStretches[id] };
    setCompletedStretches(nextState);
    if (onAllCompleted) {
      const allDone = stretches.every((s) => nextState[s.id]);
      onAllCompleted(allDone);
    }
  };

  const completedCount = stretches.filter((s) => completedStretches[s.id]).length;
  const progressPercent = Math.round((completedCount / stretches.length) * 100);

  return (
    <div className="card bg-neutral-900/80 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl transition-all">
      {/* Header bar / Accordion trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            phase === "pre" 
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" 
              : "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
          }`}>
            <Activity className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`badge badge-sm font-bold uppercase tracking-wider ${
                phase === "pre" ? "badge-warning" : "badge-info"
              }`}>
                {badge}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {stretches.length} Stretches
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-neutral-300">
              {completedCount}/{stretches.length} Done
            </span>
            <div className="w-24 h-1.5 bg-neutral-800 rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full transition-all duration-300 ${
                  phase === "pre" ? "bg-amber-500" : "bg-cyan-500"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="btn btn-circle btn-sm btn-neutral text-neutral-300">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Accordion Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-neutral-800/80 px-5 pb-6 pt-4 sm:px-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {stretches.map((stretch, index) => {
                const isCompleted = !!completedStretches[stretch.id];

                return (
                  <div
                    key={stretch.id}
                    onClick={() => toggleStretch(stretch.id)}
                    className={`card p-4 rounded-2xl border cursor-pointer transition-all ${
                      isCompleted 
                        ? "bg-emerald-950/20 border-emerald-500/40" 
                        : "bg-black/50 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="badge badge-neutral badge-xs font-mono font-bold text-neutral-400">
                          0{index + 1}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-snug">
                          {stretch.name}
                        </h4>
                      </div>

                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-neutral-600 hover:text-neutral-400 shrink-0" />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                      <span className="badge badge-ghost badge-sm text-neutral-300 gap-1 font-mono">
                        <Timer className="w-3 h-3 text-red-500" />
                        {stretch.durationOrReps}
                      </span>
                      <span className="badge badge-neutral badge-sm text-neutral-400 gap-1">
                        <Target className="w-3 h-3 text-neutral-500" />
                        {stretch.targetArea}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {stretch.instruction}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
