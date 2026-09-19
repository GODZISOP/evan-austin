"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    goals: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const driftUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col pt-32 pb-24">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-red-600/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 flex-grow flex flex-col lg:flex-row gap-16 lg:gap-24 mt-8 lg:mt-16">
        
        {/* Left Column: Heading & Info */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:w-1/2 flex flex-col justify-center"
        >
          <motion.div variants={driftUp} className="mb-4">
            <span className="text-red-500 font-mono text-sm tracking-widest uppercase">Take Action</span>
          </motion.div>
          
          <motion.h1 
            variants={driftUp}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none mb-8"
          >
            START YOUR<br />JOURNEY
          </motion.h1>
          
          <motion.p 
            variants={driftUp}
            className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-md mb-12"
          >
            Whether you are looking to build strength, drop fat, or completely overhaul your lifestyle, the first step starts here. No excuses.
          </motion.p>
          
          <motion.div variants={driftUp} className="flex flex-col gap-6">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Email</h4>
              <a href="mailto:contact@evanaustin.com" className="text-xl hover:text-red-500 transition-colors">contact@evanaustin.com</a>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Instagram</h4>
              <a href="https://instagram.com/defiantly_jack3d" target="_blank" rel="noreferrer" className="text-xl hover:text-red-500 transition-colors">@defiantly_jack3d</a>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={driftUp}
          className="lg:w-1/2 flex flex-col justify-center"
        >
          {isSubmitted ? (
            <div className="bg-[#121212] border border-white/10 p-12 rounded-2xl flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3 className="text-3xl font-bold mb-4">Request Received</h3>
              <p className="text-white/60">I'll be in touch shortly to discuss your game plan.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-4">Full Name</label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    className="bg-[#121212] border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-red-500 focus:bg-white/5 transition-all"
                    placeholder="Evan Austin"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-4">Phone</label>
                  <input 
                    type="tel" 
                    id="phone"
                    required
                    className="bg-[#121212] border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-red-500 focus:bg-white/5 transition-all"
                    placeholder="(555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-4">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  required
                  className="bg-[#121212] border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-red-500 focus:bg-white/5 transition-all"
                  placeholder="contact@evanaustin.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="goals" className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-4">Your Goals</label>
                <textarea 
                  id="goals"
                  required
                  rows={4}
                  className="bg-[#121212] border border-white/10 rounded-3xl px-6 py-5 text-white focus:outline-none focus:border-red-500 focus:bg-white/5 transition-all resize-none"
                  placeholder="Tell me about your current fitness level and what you want to achieve..."
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="group w-full md:w-auto self-start mt-4 bg-red-600 hover:bg-red-500 disabled:bg-red-900 text-white rounded-full px-10 py-5 flex items-center justify-center gap-4 transition-all duration-300 font-bold tracking-widest text-xs uppercase"
              >
                {isSubmitting ? 'SENDING...' : 'APPLY FOR COACHING'}
                {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          )}
        </motion.div>

      </div>
    </main>
  );
}
