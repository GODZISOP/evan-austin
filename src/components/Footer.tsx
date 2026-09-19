"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

const ScrollRevealCharacter = ({ children, progress, range }: { children: ReactNode, progress: any, range: [number, number] }) => {
  const color = useTransform(progress, range, ["#222222", "#ffffff"]);
  return <motion.span style={{ color }}>{children}</motion.span>;
};

export default function Footer() {
  const { scrollYProgress } = useScroll();
  const text = "EVAN AUSTIN";
  const characters = text.split("");

  return (
    <footer className="w-full bg-[#050505] pt-24 pb-12 border-t border-white/10 overflow-hidden relative">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-24">
          {/* Brand */}
          <div className="md:col-span-2 flex flex-col items-start">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-red-600 rounded-sm transform rotate-45" />
            </div>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed mb-6 font-light">
              Personalized coaching for people who are ready to get stronger, move better, and become the most disciplined version of themselves. No shortcuts. No excuses. Just progress.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-6">Navigation</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li><Link href="/#about" className="text-white/80 hover:text-red-500 transition-colors">About</Link></li>
              <li><Link href="/#programs" className="text-white/80 hover:text-red-500 transition-colors">Programs</Link></li>
              <li><Link href="/#gallery" className="text-white/80 hover:text-red-500 transition-colors">Gallery</Link></li>
              <li><Link href="/contact" className="text-white/80 hover:text-red-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-6">Connect</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li><a href="https://instagram.com/defiantly_jack3d" target="_blank" rel="noreferrer" className="text-white/80 hover:text-red-500 transition-colors">Instagram</a></li>
              <li><a href="mailto:contact@evanaustin.com" className="text-white/80 hover:text-red-500 transition-colors">Email</a></li>
            </ul>
          </div>
        </div>

        {/* Big Text */}
        <div className="w-full flex justify-center mb-12">
          <h2 className="text-[12vw] font-bold leading-none tracking-tighter select-none text-center whitespace-nowrap">
            {characters.map((char, i) => {
              // Map the 0.85 to 1.0 scroll range across all characters
              const start = 0.85 + (i / characters.length) * 0.15;
              const end = 0.85 + ((i + 1) / characters.length) * 0.15;
              return (
                <ScrollRevealCharacter key={i} progress={scrollYProgress} range={[start, end]}>
                  {char}
                </ScrollRevealCharacter>
              );
            })}
          </h2>
        </div>

        {/* Copyright */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/30 pt-8 border-t border-white/5">
          <p>© {new Date().getFullYear()} EVAN AUSTIN. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
