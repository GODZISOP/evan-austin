"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Flame, Dumbbell, ArrowRight, Zap } from "lucide-react";
import { usePathname } from "next/navigation";
import { WORKOUT_DAYS } from "@/data/workoutData";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<"leg-day" | "arm-day">("leg-day");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProgramsDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click or Escape key (antislop R-32)
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

  const legDay = WORKOUT_DAYS.find(d => d.id === "leg-day")!;
  const armDay = WORKOUT_DAYS.find(d => d.id === "arm-day")!;
  const currentDayData = activeDay === "leg-day" ? legDay : armDay;

  const dayIcons = {
    "leg-day": <Flame className="w-3.5 h-3.5" />,
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
          className="hidden md:flex gap-8 items-center text-[10px] font-bold uppercase tracking-widest pointer-events-auto"
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

          {/* Programs with Mega Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onMouseEnter={() => setProgramsDropdownOpen(true)}
              onClick={() => setProgramsDropdownOpen(!programsDropdownOpen)}
              className={`flex items-center gap-1.5 cursor-pointer transition-colors ${
                programsDropdownOpen ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              Programs
              <motion.span
                animate={{ rotate: programsDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-3 h-3" />
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
                  className="absolute top-full right-[-200px] mt-4 w-[600px] bg-[#0c0c0c] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-[200]"
                >
                  {/* Dropdown Header */}
                  <div className="px-5 pt-4 pb-3 border-b border-white/8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-red-500" />
                      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-300 font-bold">
                        Training Splits
                      </span>
                    </div>
                    <Link
                      href="/programs"
                      onClick={() => setProgramsDropdownOpen(false)}
                      className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors"
                    >
                      View All <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Day Tab Switcher */}
                  <div className="flex border-b border-white/8">
                    {[legDay, armDay].map((day) => (
                      <button
                        key={day.id}
                        onClick={() => setActiveDay(day.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-mono uppercase tracking-widest font-bold transition-all ${
                          activeDay === day.id
                            ? "text-red-500 bg-red-600/8 border-b-2 border-red-500"
                            : "text-neutral-500 hover:text-neutral-300"
                        }`}
                      >
                        {dayIcons[day.id as "leg-day" | "arm-day"]}
                        {day.name}
                        <span className="text-[9px] opacity-60">({day.totalExercises})</span>
                      </button>
                    ))}
                  </div>

                  {/* Exercise Grid */}
                  <div className="p-4 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="grid grid-cols-2 gap-2.5">
                      {currentDayData.exercises.map((exercise, i) => (
                        <motion.div
                          key={exercise.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.2 }}
                        >
                          <Link
                            href={`/workouts/${exercise.slug}`}
                            onClick={() => setProgramsDropdownOpen(false)}
                            className="group flex items-center gap-3 p-2.5 rounded-xl bg-white/3 hover:bg-white/7 border border-white/5 hover:border-red-500/25 transition-all duration-200"
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

                  {/* Footer CTA */}
                  <div className="px-4 py-3 border-t border-white/8 bg-gradient-to-r from-red-950/20 to-transparent">
                    <Link
                      href="/programs"
                      onClick={() => setProgramsDropdownOpen(false)}
                      className="flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-[11px] font-bold text-white">Full Training Protocol</div>
                        <div className="text-[10px] text-neutral-500">Sets · Reps · Rest Timers · Form Guides</div>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-red-600 group-hover:bg-red-500 transition-colors text-white text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                        Open <ArrowRight className="w-3 h-3" />
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
            onClick={() => setMobileMenuOpen(true)}
            className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </motion.div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-[110] bg-black/97 backdrop-blur-xl flex flex-col overflow-y-auto"
          >
            <div className="flex justify-end p-6">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex flex-col px-8 pb-12 gap-0">
              {/* Regular links */}
              {[
                { label: "About", href: "/#about" },
                { label: "Services", href: "/services" },
                { label: "Transformations", href: "/#transformations" },
                { label: "Gallery", href: "/#gallery" },
                { label: "Contact", href: "/contact" },
              ].map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="border-b border-white/8"
                >
                  <Link href={link.href} onClick={() => setMobileMenuOpen(false)}>
                    <span className="block py-5 text-2xl font-bold uppercase tracking-widest text-white hover:text-red-500 transition-colors">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* Programs: mobile expanded list */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="border-b border-white/8"
              >
                <div className="py-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold uppercase tracking-widest text-red-500">Programs</span>
                    <Link href="/programs" onClick={() => setMobileMenuOpen(false)}>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                        View All <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  </div>

                  {/* Day Tabs Mobile */}
                  <div className="flex gap-2 mb-4">
                    {[legDay, armDay].map((day) => (
                      <button
                        key={day.id}
                        onClick={() => setActiveDay(day.id)}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all ${
                          activeDay === day.id
                            ? "bg-red-600 text-white"
                            : "bg-white/5 text-neutral-400"
                        }`}
                      >
                        {day.name}
                      </button>
                    ))}
                  </div>

                  {/* Exercises mobile list */}
                  <div className="grid grid-cols-1 gap-2">
                    {currentDayData.exercises.map((exercise) => (
                      <Link
                        key={exercise.id}
                        href={`/workouts/${exercise.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
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
                          <div className="text-[10px] text-neutral-500 truncate">{exercise.primaryMuscles[0]}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-600 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
