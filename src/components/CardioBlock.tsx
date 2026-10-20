"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, 
  HeartPulse, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Compass, 
  Clock, 
  Info 
} from "lucide-react";
import { CARDIO_PROTOCOL, CardioProtocol } from "@/data/workoutData";
import { playTimerSound } from "@/utils/sound";

interface CardioBlockProps {
  cardio?: CardioProtocol;
  onComplete?: (completed: boolean) => void;
}

export default function CardioBlock({ 
  cardio = CARDIO_PROTOCOL,
  onComplete 
}: CardioBlockProps) {
  const [selectedAlternative, setSelectedAlternative] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  
  // 20-minute countdown timer (20 * 60 = 1200 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsCompleted(true);
            playTimerSound("complete");
            if (onComplete) onComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining, onComplete]);

  const toggleTimer = () => {
    if (!isTimerRunning) {
      playTimerSound("start");
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(20 * 60);
  };

  const handleToggleComplete = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    if (onComplete) onComplete(nextState);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = Math.round(((20 * 60 - secondsRemaining) / (20 * 60)) * 100);

  return (
    <div className="card relative overflow-hidden bg-neutral-900/90 border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 transition-all">
      {/* Red ambient highlight glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-error badge-sm uppercase tracking-wider font-bold gap-1 text-white">
              <HeartPulse className="w-3.5 h-3.5" />
              Required Daily Protocol
            </span>
            <span className="badge badge-neutral badge-sm text-neutral-300 font-mono">
              20 Minutes
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            20-Minute Post-Lift Cardio
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Every single workout day concludes with 20 minutes of steady-state aerobic conditioning to maximize metabolic expenditure and cardiovascular endurance.
          </p>
        </div>

        {/* Completion status button */}
        <button
          onClick={handleToggleComplete}
          className={`btn btn-sm sm:btn-md gap-2 font-bold transition-all shrink-0 ${
            isCompleted 
              ? "btn-success text-white shadow-lg shadow-emerald-950/40" 
              : "btn-outline border-neutral-700 text-neutral-300 hover:border-red-500 hover:text-white"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Cardio Done!</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 text-neutral-400" />
              <span>Mark 20 Min Done</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content Grid: Preferred Option vs Timer & Alternatives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        
        {/* Preferred Cardio Box (StairMaster) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="card bg-black/60 border border-red-500/30 p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-500 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Primary / Preferred Option
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  {cardio.preferredActivity}
                </h4>
                <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                  {cardio.preferredActivityDetails}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center shrink-0 text-red-500">
                <Flame className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                Target Duration: <strong className="text-white">20 Min Flat</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-red-500" />
                Target HR: <strong className="text-white">{cardio.targetHeartRateZone}</strong>
              </span>
            </div>
          </div>

          {/* Coach's Intensity Guidance Rule */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-start gap-3 text-xs">
            <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="text-neutral-300 leading-relaxed">
              <strong className="text-white font-semibold">Intensity Cue: </strong>
              {cardio.intensityCue}
            </div>
          </div>

          {/* Acceptable Alternatives Accordion */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold mb-2.5 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-red-500" />
              Approved 20-Minute Alternatives:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cardio.alternativeActivities.map((alt, index) => {
                const isSelected = selectedAlternative === index;
                return (
                  <div
                    key={alt.name}
                    onClick={() => setSelectedAlternative(isSelected ? null : index)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-red-950/20 border-red-500/50 text-white" 
                        : "bg-black/40 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                    }`}
                  >
                    <div className="font-bold text-white mb-0.5 flex items-center justify-between">
                      <span>{alt.name}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">20m</span>
                    </div>
                    <div className="text-[11px] text-red-400 font-mono truncate">{alt.setting}</div>
                    {isSelected && (
                      <p className="mt-2 pt-2 border-t border-white/10 text-[11px] text-neutral-400">
                        {alt.benefit}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Built-in Interactive 20-Min Cardio Stopwatch */}
        <div className="lg:col-span-5">
          <div className="card bg-neutral-950 border border-neutral-800 p-6 rounded-2xl text-center space-y-5">
            <div className="text-xs uppercase tracking-widest text-neutral-400 font-bold font-mono">
              Live Cardio Countdown
            </div>

            {/* Circular Timer Visual Display */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="text-neutral-800"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="text-red-600 transition-all duration-500"
                  strokeWidth="6"
                  strokeDasharray={276}
                  strokeDashoffset={276 - (276 * progressPercent) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                  {formatTime(secondsRemaining)}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono mt-1">
                  {progressPercent}% Complete
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={toggleTimer}
                className={`btn btn-sm gap-2 font-bold text-white px-5 ${
                  isTimerRunning ? "btn-warning" : "btn-error"
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{secondsRemaining === 20 * 60 ? "Start 20m" : "Resume"}</span>
                  </>
                )}
              </button>

              <button
                onClick={resetTimer}
                className="btn btn-sm btn-outline border-neutral-700 text-neutral-400 hover:text-white"
                title="Reset timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <p className="text-[11px] text-neutral-500">
              Timer continues while you step or pedal. You can also manually check off the section above.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
