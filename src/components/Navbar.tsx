"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const driftUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const } }
  };

  const menuVariants = {
    closed: { opacity: 0, y: "-100%" },
    open: { opacity: 1, y: "0%", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }
  };

  const navLinks = [
    { label: "About", href: "/#about" },
    { label: "Transformations", href: "/#transformations" },
    { label: "Programs", href: "/#programs" },
    { label: "Gallery", href: "/#gallery" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[100] px-6 lg:px-12 py-6 flex justify-between items-center transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md shadow-sm border-b border-white/5' : 'bg-transparent'} text-white pointer-events-none`}>
        <motion.div 
          initial="hidden" animate="visible" variants={driftUp} transition={{ delay: 0.1 }}
          className="flex items-center pointer-events-auto mix-blend-normal"
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
          className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest pointer-events-auto mix-blend-normal"
        >
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              <span className="cursor-pointer hover:text-red-500 transition-colors">{link.label}</span>
            </Link>
          ))}
        </motion.div>

        {/* Mobile Toggle */}
        <motion.div 
          initial="hidden" animate="visible" variants={driftUp} transition={{ delay: 0.2 }}
          className="md:hidden pointer-events-auto mix-blend-normal"
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
            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col items-center gap-8 text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                >
                  <Link href={link.href}>
                    <span className="text-3xl font-bold uppercase tracking-widest text-white hover:text-red-500 transition-colors">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
