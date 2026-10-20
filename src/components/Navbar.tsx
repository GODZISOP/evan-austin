"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  Menu, 
  X, 
  ChevronDown, 
  Flame, 
  Dumbbell, 
  ArrowRight, 
  Zap, 
  Layers, 
  Target, 
  Activity, 
  Sparkles,
  HeartPulse
} from "lucide-react";
import { usePathname } from "next/navigation";
import { WORKOUT_DAYS } from "@/data/workoutData";
import { playTimerSound } from "@/utils/sound";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<string>("chest-day");
  const [mobileWorkoutsOpen, setMobileWorkoutsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProgramsDropdownOpen(false);
    setMobileWorkoutsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProgramsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProgramsDropdownOpen(false);
        setMobileMenuOpen(false);
        setMobileWorkoutsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const driftUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const } }
  };

  const menuVariants = {
    closed: { opacity: 0, y: "-100%" },
    open: { opacity: 1, y: "0%", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }
  };

  const currentDayData = WORKOUT_DAYS.find(d => d.id === activeDay) || WORKOUT_DAYS[0];

  const dayIcons: Record<string, React.ReactNode> = {
    "chest-day": <Flame className="w-3.5 h-3.5" />,
    "back-day": <Layers className="w-3.5 h-3.5" />,
    "shoulder-day": <Target className="w-3.5 h-3.5" />,
    "leg-day": <Activity className="w-3.5 h-3.5" />,
    "arm-day": <Dumbbell className="w-3.5 h-3.5" />,
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] px-6 lg:px-12 py-5 flex justify-between items-center transition-all duration-300 ${
          scrolled ? "bg-black/85 backdrop-blur-md shadow-sm border-b border-white/5" : "bg-transparent"
        } text-white pointer-events-none`}
      >
        {/* Logo */}
        <motion.div
          initial="hidden" animate="visible" variants={driftUp} transition={{ delay: 0.1 }}
          className="flex items-center pointer-events-auto"
        >
          <Link href="/">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <div className="w-4 h-4 bg-red-600 rounded-sm transform rotate-45" />
            </div>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <motion.div
          initial="hidden" animate="visible" variants={driftUp} transition={{ delay: 0.2 }}
          className="hidden md:flex gap-8 items-center text-xs font-bold uppercase tracking-widest pointer-events-auto"
        >
          <Link href="/#about">
            <span className="cursor-pointer hover:text-red-500 transition-colors">About</span>
          </Link>
          <Link href="/services">
            <span className="cursor-pointer hover:text-red-500 transition-colors">Services</span>
          </Link>
          <Link href="/#transformations">
            <span className="cursor-pointer hover:text-red-500 transition-colors">Transformations</span>
          </Link>

          {/* Workouts with Mega Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onMouseEnter={() => {
                playTimerSound("select");
                setProgramsDropdownOpen(true);
              }}
              onClick={() => {
                playTimerSound("select");
                setProgramsDropdownOpen(!programsDropdownOpen);
              }}
              className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                programsDropdownOpen ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              Workouts
              <motion.span
                animate={{ rotate: programsDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </motion.span>
            </button>

            {/* Mega Dropdown */}
            <AnimatePresence>
              {programsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onMouseLeave={() => setProgramsDropdownOpen(false)}
                  className="absolute top-full right-[-140px] lg:right-[-180px] mt-4 w-[660px] bg-[#0c0c0c] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-[200]"
                >
                  {/* Dropdown Header */}
                  <div className="px-5 pt-4 pb-3 border-b border-white/8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-red-500" />
                      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-300 font-bold">
                        Evan Austin Splits ({WORKOUT_DAYS.length} Days)
                      </span>
                    </div>
                    <Link
                      href="/programs"
                      onClick={() => setProgramsDropdownOpen(false)}
                      className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors"
                    >
                      Full Month Protocol <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Day Tab Switcher - All 5 Days */}
                  <div className="flex border-b border-white/8 bg-neutral-950/60 overflow-x-auto">
                    {WORKOUT_DAYS.map((day) => (
                      <button
                        key={day.id}
                        onClick={() => {
                          playTimerSound("select");
                          setActiveDay(day.id);
                        }}
                        className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2.5 px-2 text-[10px] font-mono uppercase tracking-wider font-bold transition-all ${
                          activeDay === day.id
                            ? "text-red-500 bg-red-600/10 border-b-2 border-red-500"
                            : "text-neutral-500 hover:text-neutral-300"
                        }`}
                      >
                        {dayIcons[day.id] || <Flame className="w-3.5 h-3.5" />}
                        <span className="truncate">{day.name.replace(" Day", "")}</span>
                        <span className="text-[9px] opacity-60">({day.totalExercises})</span>
                      </button>
                    ))}
                  </div>

                  {/* Exercise Grid */}
                  <div className="p-4 max-h-[380px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="grid grid-cols-2 gap-2.5">
                      {currentDayData.exercises.map((exercise, i) => (
                        <motion.div
                          key={exercise.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.18 }}
                        >
                          <Link
                            href={`/workouts/${exercise.slug}`}
                            onClick={() => {
                              playTimerSound("select");
                              setProgramsDropdownOpen(false);
                            }}
                            className="group flex items-center gap-3 p-2.5 rounded-xl bg-white/3 hover:bg-white/7 border border-white/5 hover:border-red-500/30 transition-all duration-200"
                          >
                            {/* Exercise Image */}
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-900 border border-white/8 shrink-0 relative">
                              {exercise.demoImage ? (
                                <Image
                                  src={exercise.demoImage}
                                  alt={exercise.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="56px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Dumbbell className="w-5 h-5 text-neutral-600" />
                                </div>
                              )}
                            </div>

                            {/* Exercise Info */}
                            <div className="flex-1 min-w-0">
                              <div className="text-[11px] font-bold text-white group-hover:text-red-400 transition-colors leading-tight truncate">
                                {exercise.title}
                              </div>
                              <div className="text-[10px] text-neutral-400 mt-0.5 truncate">
                                {exercise.primaryMuscles[0]}
                              </div>
                              <div className="flex items-center gap-1 mt-1.5">
                                <span className="text-[9px] font-mono text-neutral-300 bg-white/10 px-1.5 py-0.5 rounded-full">
                                  {exercise.sets.length} sets
                                </span>
                              </div>
                            </div>

                            <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Program Features Strip Mention */}
                  <div className="px-4 py-2.5 bg-neutral-950 border-t border-white/8 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                    <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-neutral-300">
                      <div className="text-amber-400 font-bold">ABS / CALVES</div>
                      <div className="text-[9px] text-neutral-500">Alternating Daily</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-neutral-300">
                      <div className="text-red-400 font-bold">20M CARDIO</div>
                      <div className="text-[9px] text-neutral-500">StairMaster Daily</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-neutral-300">
                      <div className="text-cyan-400 font-bold">STRETCHES</div>
                      <div className="text-[9px] text-neutral-500">Pre & Post Stretches</div>
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div className="px-4 py-3 border-t border-white/8 bg-gradient-to-r from-red-950/25 to-transparent">
                    <Link
                      href="/programs"
                      onClick={() => setProgramsDropdownOpen(false)}
                      className="flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-[11px] font-bold text-white">Full 28-Day Month Blueprint</div>
                        <div className="text-[10px] text-neutral-500">5 Splits · Abs/Calves Alternating · 20m Cardio · Stretches</div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-red-600 group-hover:bg-red-500 transition-colors text-white text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                        Open Schedule <ArrowRight className="w-3 h-3" />
                      </div>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/#gallery">
            <span className="cursor-pointer hover:text-red-500 transition-colors">Gallery</span>
          </Link>
          <Link href="/contact">
            <span className="cursor-pointer hover:text-red-500 transition-colors">Contact</span>
          </Link>
        </motion.div>

        {/* Mobile Toggle */}
        <motion.div
          initial="hidden" animate="visible" variants={driftUp} transition={{ delay: 0.2 }}
          className="md:hidden pointer-events-auto"
        >
          <button
            onClick={() => {
              playTimerSound("select");
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="text-white hover:text-red-500 transition-colors p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </motion.div>
      </header>

      {/* Mobile Drawer (Fullscreen) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed" animate="open" exit="closed" variants={menuVariants}
            className="fixed inset-0 bg-[#050505] z-50 flex flex-col justify-between p-8 pt-28 md:hidden overflow-y-auto"
          >
            {/* Top Red Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[80px] pointer-events-none rounded-full" />

            <div className="flex flex-col gap-2 relative z-10">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Link
                  href="/#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-2xl font-bold uppercase tracking-widest text-white hover:text-red-500 transition-colors border-b border-white/8"
                >
                  About
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <Link
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-2xl font-bold uppercase tracking-widest text-white hover:text-red-500 transition-colors border-b border-white/8"
                >
                  Services
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Link
                  href="/#transformations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-2xl font-bold uppercase tracking-widest text-white hover:text-red-500 transition-colors border-b border-white/8"
                >
                  Transformations
                </Link>
              </motion.div>

              {/* Workouts: Collapsible Mobile Dropdown */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="border-b border-white/8"
              >
                <button
                  type="button"
                  onClick={() => {
                    playTimerSound("select");
                    setMobileWorkoutsOpen(!mobileWorkoutsOpen);
                  }}
                  className="w-full flex items-center justify-between py-4 text-2xl font-bold uppercase tracking-widest text-white hover:text-red-500 transition-colors text-left"
                >
                  <span className={mobileWorkoutsOpen ? "text-red-500" : ""}>Workouts</span>
                  <motion.div
                    animate={{ rotate: mobileWorkoutsOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="p-1.5 rounded-full bg-white/5 border border-white/10"
                  >
                    <ChevronDown className="w-5 h-5 text-neutral-300" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {mobileWorkoutsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden pb-4"
                    >
                      <div className="pt-2 pb-3 flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold">
                          All 5 Splits ({WORKOUT_DAYS.length} Days)
                        </span>
                        <Link href="/programs" onClick={() => setMobileMenuOpen(false)}>
                          <span className="text-[11px] font-mono uppercase tracking-wider text-red-500 flex items-center gap-1 font-bold">
                            View All <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </Link>
                      </div>

                      {/* Day Tabs Mobile (All 5 days) */}
                      <div className="grid grid-cols-3 gap-1.5 mb-3">
                        {WORKOUT_DAYS.map((day) => (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => {
                              playTimerSound("select");
                              setActiveDay(day.id);
                            }}
                            className={`py-2 px-2 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1 ${
                              activeDay === day.id
                                ? "bg-red-600 text-white"
                                : "bg-white/5 text-neutral-400 hover:text-white"
                            }`}
                          >
                            {dayIcons[day.id] || <Flame className="w-3 h-3" />}
                            <span className="truncate">{day.name.replace(" Day", "")}</span>
                          </button>
                        ))}
                      </div>

                      {/* Mobile Added Features Badge */}
                      <div className="mb-3 p-2 rounded-xl bg-white/[0.03] border border-white/8 flex items-center justify-around text-[10px] font-mono text-neutral-300">
                        <span className="text-amber-400 font-bold">Abs/Calves</span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-red-400 font-bold">20m Cardio</span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-cyan-400 font-bold">Stretches</span>
                      </div>

                      {/* Exercises mobile list */}
                      <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-1">
                        {currentDayData.exercises.map((exercise) => (
                          <Link
                            key={exercise.id}
                            href={`/workouts/${exercise.slug}`}
                            onClick={() => {
                              playTimerSound("select");
                              setMobileMenuOpen(false);
                            }}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/4 border border-white/8 hover:border-red-500/30 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-900 shrink-0 relative">
                              {exercise.demoImage ? (
                                <Image
                                  src={exercise.demoImage}
                                  alt={exercise.title}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Dumbbell className="w-4 h-4 text-neutral-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-white truncate">{exercise.title}</div>
                              <div className="text-[10px] text-neutral-400 truncate">{exercise.primaryMuscles[0]}</div>
                            </div>
                            <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                              {exercise.sets.length} sets
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Link
                  href="/#gallery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-2xl font-bold uppercase tracking-widest text-white hover:text-red-500 transition-colors border-b border-white/8"
                >
                  Gallery
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-2xl font-bold uppercase tracking-widest text-white hover:text-red-500 transition-colors"
                >
                  Contact
                </Link>
              </motion.div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-8 border-t border-white/10 relative z-10 flex flex-col gap-4">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 rounded-xl bg-red-600 text-white font-bold text-center uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                Book Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex justify-between items-center text-xs text-neutral-500 uppercase tracking-widest font-mono">
                <span>Evan Austin</span>
                <span>Elite Physique</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
