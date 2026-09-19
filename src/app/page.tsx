"use client";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Search, Maximize, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const ScrollRevealWord = ({ children, progress, range, colors = ["#525252", "#ffffff"], className }: { children: React.ReactNode, progress: any, range: [number, number], colors?: string[], className?: string }) => {
  const color = useTransform(progress, range, colors);
  return <motion.span style={{ color }} className={className}>{children}</motion.span>;
};

const JourneySection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeCard, setActiveCard] = useState(1); // 1 is the middle card initially

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cardTransition = { duration: 1.0, ease: [0.22, 1, 0.36, 1] as const }; // faster transition for clicks

  const baseVariants = {
    left: { 
      x: isMobile ? "-30%" : "-110%", 
      y: isMobile ? "8%" : "8%", 
      rotateY: isMobile ? 175 : 165, 
      rotateZ: isMobile ? -8 : -6, 
      scale: 1,
      transition: cardTransition 
    },
    right: { 
      x: isMobile ? "30%" : "110%", 
      y: isMobile ? "12%" : "8%", 
      rotateY: isMobile ? 185 : 195, 
      rotateZ: isMobile ? 8 : 6, 
      scale: 1,
      transition: cardTransition 
    },
    middle: { 
      x: "0%", 
      y: isMobile ? "0%" : "-4%", 
      scale: isMobile ? 1 : 1.05, 
      rotateY: 180, 
      rotateZ: 0,
      transition: cardTransition 
    }
  };

  const getCardStyle = (index: number) => {
    let visibleVariant = baseVariants.right;
    let zIndex = 10;
    
    if (index === activeCard) {
      visibleVariant = baseVariants.middle;
      zIndex = 30;
    } else if (index === (activeCard + 1) % 3) {
      visibleVariant = baseVariants.right; // Next card
      zIndex = 20;
    } else {
      visibleVariant = baseVariants.left; // Prev card
      zIndex = 10;
    }
    
    return {
      variants: {
        hidden: { x: "0%", y: "0%", rotateY: 0, rotateZ: 0, scale: 1 },
        visible: visibleVariant
      },
      zIndex
    };
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveCard((activeCard - 1 + 3) % 3);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveCard((activeCard + 1) % 3);
  };

  return (
    <section className="relative min-h-screen w-full bg-[#050505] overflow-hidden flex flex-col items-center justify-center py-24 lg:py-32">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] lg:w-[1200px] h-[800px] lg:h-[1200px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] as const }}
        className="text-3xl md:text-5xl lg:text-7xl text-white font-serif tracking-tight mb-12 md:mb-16 z-10 px-4 text-center"
      >
        Where are you <span className="italic text-neutral-400 font-light">in</span> your fitness journey?
      </motion.h2>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.4 }}
        style={{ perspective: 1200 }} 
        className="relative w-[260px] md:w-[320px] lg:w-[360px] h-[360px] md:h-[440px] lg:h-[500px] z-10 flex items-center justify-center mt-4 md:mt-8"
      >
        
        {/* Left Card: BUILD YOUR FOUNDATION (Index 0) */}
        <motion.div 
          variants={getCardStyle(0).variants}
          onClick={(e) => activeCard === 0 ? handleNext(e) : setActiveCard(0)}
          style={{ transformStyle: "preserve-3d", zIndex: getCardStyle(0).zIndex }}
          className="absolute inset-0 origin-bottom cursor-pointer group"
        >
          {/* Front Face (Red Cover) */}
          <div className="absolute inset-0 bg-[#d92323] rounded-2xl shadow-[0_0_50px_rgba(217,35,35,0.4)] [backface-visibility:hidden]" />
          
          {/* Back Face (Gray Content) */}
          <div className="absolute inset-0 bg-[#e6e6e6] rounded-2xl p-8 lg:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
             <div className="mb-auto w-full flex justify-between items-start text-black relative z-10">
               <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>
               <div className="text-right">
                 <div className="text-2xl font-bold tracking-tight">$49</div>
                 <div className="text-[10px] uppercase tracking-widest opacity-60 font-bold">/month</div>
               </div>
             </div>
             <div className="relative z-10">
               <h3 className="text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight tracking-tight">BUILD YOUR<br/>FOUNDATION</h3>
               <p className="text-xs lg:text-sm text-black/60 font-medium leading-relaxed">New to training? Build the fundamentals, learn proper movement, develop confidence, and create habits that actually last.</p>
             </div>
          </div>
        </motion.div>

        {/* Right Card: BREAK YOUR PLATEAU (Index 2) */}
        <motion.div 
          variants={getCardStyle(2).variants}
          onClick={(e) => activeCard === 2 ? handleNext(e) : setActiveCard(2)}
          style={{ transformStyle: "preserve-3d", zIndex: getCardStyle(2).zIndex }}
          className="absolute inset-0 origin-bottom cursor-pointer group"
        >
          {/* Front Face (Red Cover) */}
          <div className="absolute inset-0 bg-[#d92323] rounded-2xl shadow-[0_0_50px_rgba(217,35,35,0.4)] [backface-visibility:hidden]" />
          
          {/* Back Face (Dark Content) */}
          <div className="absolute inset-0 bg-[#121212] rounded-2xl p-8 lg:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
             <div className="mb-auto w-full flex justify-between items-start text-white opacity-80 relative z-10">
               <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c0 4.97-4.03 9-9 9 4.97 0 9 4.03 9 9 0-4.97 4.03-9 9-9-4.97 0-9-4.03-9-9z"/></svg>
               <div className="text-right opacity-100">
                 <div className="text-2xl font-bold tracking-tight">$149</div>
                 <div className="text-[10px] uppercase tracking-widest opacity-60 font-bold">/month</div>
               </div>
             </div>
             <div className="relative z-10">
               <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">BREAK YOUR<br/>PLATEAU</h3>
               <p className="text-xs lg:text-sm text-white/50 font-medium leading-relaxed">Training hard but not seeing the progress you expect? We'll identify what's holding you back and build a strategy.</p>
             </div>
          </div>
        </motion.div>

        {/* Middle Card: PROGRESSIVE OVERLOAD (Index 1) */}
        <motion.div 
          variants={getCardStyle(1).variants}
          onClick={(e) => activeCard === 1 ? handleNext(e) : setActiveCard(1)}
          style={{ transformStyle: "preserve-3d", zIndex: getCardStyle(1).zIndex }}
          className="absolute inset-0 origin-bottom cursor-pointer group"
        >
          {/* Front Face (Red Cover) */}
          <div className="absolute inset-0 bg-[#d92323] rounded-2xl shadow-[0_30px_60px_rgba(217,35,35,0.4)] [backface-visibility:hidden]" />
          
          {/* Back Face (Red Content) */}
          <div className="absolute inset-0 bg-[#d92323] rounded-2xl p-8 lg:p-10 shadow-[0_30px_60px_rgba(217,35,35,0.4)] flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
             <div className="mb-auto w-full flex justify-between items-start text-white relative z-10">
               <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="17" r="2.5"/><circle cx="18" cy="17" r="2.5"/></svg>
               <div className="text-right">
                 <div className="text-2xl font-bold tracking-tight">$99</div>
                 <div className="text-[10px] uppercase tracking-widest opacity-80 font-bold">/month</div>
               </div>
             </div>
             <div className="relative z-10">
               <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">PROGRESSIVE<br/>OVERLOAD</h3>
               <p className="text-xs lg:text-sm text-white/90 font-medium leading-relaxed">Consistently pushing the boundaries of your performance. No shortcuts. No excuses. Just progress.</p>
             </div>
          </div>
        </motion.div>

        {/* Invisible Tap Zones for Mobile */}
        {isMobile && (
          <>
            <div 
              className="absolute top-0 bottom-0 left-[-40%] w-[50%] z-[100]" 
              onClick={handlePrev}
            />
            <div 
              className="absolute top-0 bottom-0 right-[-40%] w-[50%] z-[100]" 
              onClick={handleNext}
            />
          </>
        )}

      </motion.div>
    </section>
  );
};

const albums = [
  {
    id: "01",
    title: "COACH EVAN",
    count: "DEFIANTLY JACK3D",
    images: [
      "/images/media_1789842395998.png",
      "/images/media_1789842373916.png"
    ]
  },
  {
    id: "02",
    title: "ASPIRE",
    count: "TO INSPIRE",
    images: [
      "/images/media_1789842357428.png",
      "/images/media_1789842333302.png"
    ]
  },
  {
    id: "03",
    title: "SUPERHERO",
    count: "ADHD FOCUS",
    images: [
      "/images/media_1789842314508.png",
      "/images/media_1789842395998.png"
    ]
  },
  {
    id: "04",
    title: "GO HARD",
    count: "OR GO HOME",
    images: [
      "/images/media_1789842373916.png",
      "/images/media_1789842357428.png"
    ]
  },
  {
    id: "05",
    title: "OZARKS",
    count: "LIFESTYLE",
    images: [
      "/images/media_1789842333302.png",
      "/images/media_1789842314508.png"
    ]
  }
];

const GallerySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // STRICTLY NO STICKY WRAPPER. NO EMPTY SPACE.
  // We map the animation exactly to the section entering the screen!
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"]
  });

  const [activeIndex, setActiveIndex] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const activeAlbum = albums[activeIndex];
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % albums.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + albums.length) % albums.length);

  // HELLO Text fades out and slides up as section enters (0.1 to 0.4)
  const helloOpacity = useTransform(scrollYProgress, [0.1, 0.4], [1, 0]);
  const helloY = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "-50%"]);

  // Bottom Text comes up from bottom tied perfectly to scroll (0.6 to 1.0)
  const bottomTextY = useTransform(scrollYProgress, [0.6, 1.0], ["100%", "0%"]);
  const bottomTextOpacity = useTransform(scrollYProgress, [0.6, 1.0], [0, 1]);

  // Gallery Controls fade in (0.8 to 1.0)
  const controlsOpacity = useTransform(scrollYProgress, [0.8, 1.0], [0, 1]);

  return (
    // Strictly h-screen. Absolutely no sticky wrapper, meaning ZERO empty space.
    <section ref={containerRef} className="relative w-full h-screen bg-[#050505] overflow-hidden flex flex-col justify-center">
        
        {/* Top Nav inside section */}
        <div className="absolute top-0 left-0 w-full p-8 hidden md:flex justify-between text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/50 z-50">
          <div>EVAN AUSTIN</div>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors hidden sm:block">INSTAGRAM</span>
            <span className="text-white">GALLERY</span>
            <span className="hover:text-white cursor-pointer transition-colors hidden sm:block">CONTACT</span>
          </div>
        </div>

        {/* HELLO Text Overlay */}
        <motion.div 
           style={{ opacity: helloOpacity, y: helloY }}
           className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40"
         >
            <h1 className="text-[50px] md:text-[120px] leading-[0.8] font-light text-white tracking-tighter text-center mix-blend-normal md:mix-blend-difference will-change-transform">
              HELLO, I'M<br/>
              <span className="italic font-serif">EVAN</span><br/>
              AUSTIN
            </h1>
        </motion.div>

        {/* MAIN GALLERY CONTAINER - always rendered, no DOM swapping! */}
        <div className="relative w-full h-[60vh] flex items-center justify-center px-8 md:px-16 z-30">
          <div className="w-full h-full flex items-center gap-4 overflow-x-auto snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {albums.map((album, idx) => {
              const isActive = idx === activeIndex;
              // Center is 1. If idx=0, diff=1. If idx=2, diff=-1.
              const diff = 1 - idx; 
              
              // Dynamic transforms for each card!
              // When scroll is 0.2 (stacked): x = diff * 120%, rotate = 0
              // When scroll is 0.6 (fanning): x = diff * 60%, rotate = diff * 8
              // When scroll is 1.0 (settled): x = 0%, rotate = 0
              const xTransform = useTransform(
                scrollYProgress, 
                [0.2, 0.6, 1.0], 
                [`${diff * (isMobile ? 70 : 120)}%`, `${diff * (isMobile ? 35 : 60)}%`, "0%"]
              );
              const rotateTransform = useTransform(
                scrollYProgress, 
                [0.2, 0.6, 1.0], 
                [0, diff * -8, 0] // Negative to make left card tilt left, right card tilt right
              );
              const zIndex = idx === 1 ? 10 : 0;

              return (
                <div
                  key={album.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative flex flex-col shrink-0 cursor-pointer snap-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'w-[240px] md:w-[320px] h-[90%] md:h-full' : 'w-[160px] md:w-[240px] h-[65%]'}`}
                  style={{ zIndex }}
                >
                  <motion.div 
                    style={{ x: xTransform, rotateZ: rotateTransform }}
                    className="w-full h-full relative flex flex-col gap-4 will-change-transform"
                  >
                     {isActive ? (
                       isMobile ? (
                         <img src={album.images[0]} className="w-full h-full object-cover object-top grayscale transition-all duration-700 rounded-sm shadow-2xl" />
                       ) : (
                         <>
                           <img src={album.images[0]} className="w-full h-1/2 object-cover object-top grayscale hover:grayscale-0 transition-all duration-700 rounded-sm shadow-2xl" />
                           <img src={album.images[1]} className="w-full h-1/2 object-cover object-top grayscale hover:grayscale-0 transition-all duration-700 rounded-sm shadow-2xl" />
                         </>
                       )
                     ) : (
                       <img src={album.images[0]} className="w-full h-full object-cover object-top grayscale opacity-50 hover:opacity-100 transition-all duration-700 rounded-sm shadow-xl" />
                     )}
                  </motion.div>
                  
                  {/* Small text below card */}
                  <motion.div 
                    style={{ x: xTransform, opacity: controlsOpacity }}
                    className="mt-6 flex flex-col items-center"
                  >
                    <span className="text-[10px] tracking-[0.2em] text-white/80 uppercase">{album.title}</span>
                    <span className="text-[8px] tracking-widest text-white/40 mt-1">{album.count}</span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Controls */}
        <motion.div style={{ opacity: controlsOpacity }} className="absolute inset-0 pointer-events-none z-[100]">
           <div className="absolute left-1/2 -translate-x-1/2 bottom-[120px] md:bottom-12 flex gap-4 z-20 pointer-events-auto">
             <button onClick={handlePrev} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-colors">
               <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
             </button>
             <button onClick={handleNext} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-colors">
               <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
             </button>
           </div>
        </motion.div>

        {/* Massive Bottom Typography linked perfectly to scroll! */}
        <motion.div style={{ y: bottomTextY, opacity: bottomTextOpacity }} className="absolute bottom-4 md:bottom-8 left-0 w-full px-4 md:px-12 flex justify-between items-baseline select-none pointer-events-none z-0 will-change-transform">
          <div className="text-[100px] md:text-[240px] leading-none font-light text-white tracking-tighter transition-all duration-500">
            {activeAlbum.id}
          </div>
          <div className="text-[40px] md:text-[140px] lg:text-[180px] leading-none font-light text-white tracking-tighter uppercase whitespace-nowrap transition-all duration-500">
            {activeAlbum.title}
          </div>
        </motion.div>

    </section>
  );
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants: smooth, ease-out, subtle upward/sideways drift (30px/20px), duration 0.7s
  const duration = 0.7;
  const ease = [0.21, 0.47, 0.32, 0.98] as const; // Smooth ease-out curve

  const driftFromLeft = {
    hidden: { opacity: 0, x: -30, y: 20 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration, ease } }
  };

  const driftFromRight = {
    hidden: { opacity: 0, x: 30, y: 20 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration, ease } }
  };

  const driftUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration, ease } }
  };

  const scaleUpFromBottom = {
    hidden: { opacity: 0, y: 100, scale: 0.6 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const } } // Slow, premium ease-out
  };

  const headingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ["start 85%", "center 35%"]
  });

  const headingText = "I'm a coach, athlete, and believer in doing the work when nobody is watching. No shortcuts. No excuses. Just progress.";
  const headingWords = headingText.split(" ");

  return (
    <main className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* SECTION: Personal Palace */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black py-20 lg:py-0">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 bg-black">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: 'url("/images/hero2.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'left top',
            }}
          />
        </div>

        {/* Content Container (Triggers all children when in view) */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          className="container mx-auto px-6 lg:px-16 relative z-20 flex flex-col lg:flex-row items-center justify-end h-full"
        >
          
          {/* Text (Right Side) */}
          <div className="max-w-xl w-full text-center lg:text-left lg:ml-auto mt-20 lg:mt-0 lg:mr-16">
            <motion.div 
              variants={driftFromRight} transition={{ delay: 0.1 }}
              className="inline-flex items-center px-1 py-1 pr-4 mb-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-semibold tracking-wider text-white shadow-xl"
            >
              <span className="text-white bg-red-600 px-3 py-1 rounded-full mr-3 uppercase text-[10px] tracking-widest font-bold">Evan</span> 
              COACH. ATHLETE. MENTOR.
            </motion.div>
            
            <motion.h2 
              variants={driftFromRight} transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-white text-glow"
            >
              BUILD THE BODY. <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">BUILD THE MIND.</span>
            </motion.h2>
            
            <motion.p 
              variants={driftFromRight} transition={{ delay: 0.3 }}
              className="text-base md:text-lg lg:text-xl text-white/70 max-w-md mx-auto lg:mx-0 font-light leading-relaxed mb-12 lg:mb-0"
            >
              Personalized coaching for people who are ready to get stronger, move better, and become the most disciplined version of themselves.
            </motion.p>
          </div>

          {/* Left Floating Actions (Left Side) */}
          <div className="flex flex-row lg:flex-col gap-4 lg:absolute lg:left-16 lg:top-1/2 lg:-translate-y-1/2 flex-wrap justify-center">
             <motion.button 
               variants={driftFromLeft} transition={{ delay: 0.1 }}
               className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform text-xs md:text-sm"
             >
               Train
             </motion.button>
             <motion.button 
               variants={driftFromLeft} transition={{ delay: 0.2 }}
               className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center font-medium hover:bg-white/20 transition-colors text-xs md:text-sm"
             >
               Recover
             </motion.button>
             <motion.button 
               variants={driftFromLeft} transition={{ delay: 0.3 }}
               className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 flex items-center justify-center font-medium hover:bg-white/20 transition-colors text-xs md:text-sm"
             >
               Grow
             </motion.button>
             
             {/* Bottom left tools */}
             <div className="hidden md:flex flex-row lg:flex-col gap-4 lg:absolute lg:top-[280px] lg:left-0 mt-4 lg:mt-0">
               <motion.button 
                 variants={driftFromLeft} transition={{ delay: 0.4 }}
                 className="w-16 h-16 rounded-[2rem] bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10 shadow-lg"
               >
                 <Maximize className="w-6 h-6 text-white" />
               </motion.button>
               <motion.button 
                 variants={driftFromLeft} transition={{ delay: 0.5 }}
                 className="w-16 h-16 rounded-[2rem] bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10 shadow-lg"
               >
                 <Search className="w-6 h-6 text-white" />
               </motion.button>
             </div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: Studio Stats */}
      <section className="w-full bg-[#0a0a0a] py-24 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
            
            {/* Left Column */}
            <div className="w-full lg:w-1/4 flex flex-col gap-8 lg:gap-16">
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }} variants={driftUp}
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 flex items-center gap-2"
              >
                <span className="text-red-600">[</span> ABOUT EVAN <span className="text-red-600">]</span>
              </motion.div>

              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }} variants={driftUp} transition={{ delay: 0.2 }}
                className="w-[200px] lg:w-full max-w-[280px] aspect-[4/5] relative rounded-lg overflow-hidden border border-white/5 opacity-80 hover:opacity-100 transition-opacity"
              >
                <div 
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                  style={{
                    backgroundImage: 'url("/images/image%20copy.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                  }}
                />
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-3/4 flex flex-col">
              
              {/* Heading */}
              <h2 
                ref={headingRef}
                className="text-3xl md:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold leading-[1.15] tracking-tight mb-16 uppercase"
              >
                {headingWords.map((word, i) => {
                  const start = i / headingWords.length;
                  const end = start + (1 / headingWords.length);
                  return (
                    <span key={i}>
                      <ScrollRevealWord progress={scrollYProgress} range={[start, end]}>{word}</ScrollRevealWord>
                      {i < headingWords.length - 1 && " "}
                    </span>
                  );
                })}
              </h2>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                
                {/* Card 1 */}
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={scaleUpFromBottom} transition={{ delay: 0.2 }}
                  className="bg-[#121212] p-8 md:p-10 flex flex-col justify-between h-[320px] md:h-[400px] hover:bg-[#161616] transition-colors"
                >
                  <div>
                    <h3 className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">100<span className="text-3xl text-neutral-500 ml-1">%</span></h3>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold mt-4">Client Commitment</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest leading-[1.8] max-w-[150px] ml-auto">
                      My approach goes beyond simply counting reps and calories
                    </p>
                  </div>
                </motion.div>

                {/* Card 2 */}
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={scaleUpFromBottom} transition={{ delay: 0.3 }}
                  className="bg-[#121212] p-8 md:p-10 flex flex-col justify-between h-[320px] md:h-[400px] hover:bg-[#161616] transition-colors"
                >
                  <div>
                    <h3 className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">24<span className="text-3xl text-neutral-500 ml-1">/7</span></h3>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold mt-4">Support & Guidance</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest leading-[1.8] max-w-[150px] ml-auto">
                      Build the strength, discipline, confidence, and consistency
                    </p>
                  </div>
                </motion.div>

                {/* Card 3 */}
                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={scaleUpFromBottom} transition={{ delay: 0.4 }}
                  className="bg-[#121212] p-8 md:p-10 flex flex-col justify-between h-[320px] md:h-[400px] hover:bg-[#161616] transition-colors relative overflow-hidden"
                >
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <div className="flex -space-x-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-[#121212] z-40" />
                        <div className="w-8 h-8 rounded-full bg-neutral-700 border-2 border-[#121212] z-30" />
                        <div className="w-8 h-8 rounded-full bg-neutral-600 border-2 border-[#121212] z-20" />
                        <div className="w-8 h-8 rounded-full bg-neutral-500 border-2 border-[#121212] z-10" />
                      </div>
                      <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">Personalized For You</p>
                    </div>
                    
                    <div className="w-16 h-20 bg-red-600/80 blur-[2px] rounded-sm" />
                  </div>
                  <div className="text-left mt-auto">
                    <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest leading-[1.8]">
                      <span className="text-red-500">100%</span> Custom<br/>
                      Built around your<br/>
                      goals and lifestyle
                    </p>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
          
          {/* Bottom Logos */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.5 }} variants={driftUp} transition={{ delay: 0.5 }}
            className="w-full flex justify-between items-center mt-24 pt-10 border-t border-neutral-900/50 overflow-x-auto gap-8 pb-4"
          >
            {['TRAIN WITH PURPOSE', 'BUILD YOUR FOUNDATION', 'BREAK YOUR PLATEAU', 'NO SHORTCUTS', 'NO EXCUSES', 'JUST PROGRESS'].map((logo, i) => (
              <div key={i} className="flex items-center gap-2 text-neutral-600 font-bold uppercase tracking-[0.2em] text-[10px] whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="w-3 h-3 rounded-full bg-neutral-800" />
                {logo}
              </div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* SECTION 3: Journey Fan-Out */}
      <JourneySection />

      {/* SECTION 4: Gallery */}
      <GallerySection />

      {/* SECTION 5: Contact */}
      <ContactSection />

    </main>
  );
}

const ContactSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "center 40%"]
  });

  const paragraphText = "Whether you are looking to build strength, drop fat, or completely overhaul your lifestyle, the first step starts here. No excuses.";
  const paragraphWords = paragraphText.split(" ");

  const emailStr = "contact@evanaustin.com";
  const instaStr = "@defiantly_jack3d";

  const placeholderColor = useTransform(scrollYProgress, [0.2, 0.8], ["rgba(255,255,255,0.0)", "rgba(255,255,255,0.4)"]);
  const inputWidth = useTransform(scrollYProgress, [0.0, 0.8], ["0%", "100%"]);

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
    <section ref={containerRef} className="relative w-full bg-[#050505] text-white flex flex-col py-32 border-t border-white/5" id="contact">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-red-600/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Column: Heading & Info */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={staggerContainer}
          className="lg:w-1/2 flex flex-col justify-center"
        >
          <div className="mb-4 font-mono text-sm tracking-widest uppercase">
            <ScrollRevealWord progress={scrollYProgress} range={[0.0, 0.05]} colors={["#525252", "#ef4444"]}>Take</ScrollRevealWord>{" "}
            <ScrollRevealWord progress={scrollYProgress} range={[0.05, 0.1]} colors={["#525252", "#ef4444"]}>Action</ScrollRevealWord>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none mb-8">
            <ScrollRevealWord progress={scrollYProgress} range={[0.1, 0.2]}>START</ScrollRevealWord>{" "}
            <ScrollRevealWord progress={scrollYProgress} range={[0.2, 0.3]}>YOUR</ScrollRevealWord><br />
            <ScrollRevealWord progress={scrollYProgress} range={[0.3, 0.4]}>JOURNEY</ScrollRevealWord>
          </h1>
          
          <p className="text-lg md:text-xl font-light leading-relaxed max-w-md mb-12">
            {paragraphWords.map((word, i) => {
              const start = 0.4 + (i / paragraphWords.length) * 0.4;
              const end = 0.4 + ((i + 1) / paragraphWords.length) * 0.4;
              return (
                <span key={i}>
                  <ScrollRevealWord progress={scrollYProgress} range={[start, end]} colors={["#525252", "#a3a3a3"]}>
                    {word}
                  </ScrollRevealWord>
                  {i < paragraphWords.length - 1 && " "}
                </span>
              );
            })}
          </p>
          
          <motion.div variants={driftUp} className="flex flex-col gap-6">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Email</h4>
              <a href="mailto:contact@evanaustin.com" className="group text-xl transition-colors">
                {emailStr.split("").map((char, i) => (
                  <ScrollRevealWord key={i} progress={scrollYProgress} range={[0.8 + (i/emailStr.length)*0.1, 0.8 + ((i+1)/emailStr.length)*0.1]} className="group-hover:!text-red-500 transition-colors duration-300">
                    {char}
                  </ScrollRevealWord>
                ))}
              </a>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Instagram</h4>
              <a href="https://instagram.com/defiantly_jack3d" target="_blank" rel="noreferrer" className="group text-xl transition-colors">
                {instaStr.split("").map((char, i) => (
                  <ScrollRevealWord key={i} progress={scrollYProgress} range={[0.9 + (i/instaStr.length)*0.1, 0.9 + ((i+1)/instaStr.length)*0.1]} className="group-hover:!text-red-500 transition-colors duration-300">
                    {char}
                  </ScrollRevealWord>
                ))}
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-4">Full Name</label>
                  <motion.input 
                    type="text" 
                    id="name"
                    required
                    style={{ "--placeholder-color": placeholderColor, width: inputWidth } as any}
                    className="bg-[#121212] border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-red-500 focus:bg-white/5 transition-all placeholder-[color:var(--placeholder-color)]"
                    placeholder="Evan Austin"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-4">Phone</label>
                  <motion.input 
                    type="tel" 
                    id="phone"
                    required
                    style={{ "--placeholder-color": placeholderColor, width: inputWidth } as any}
                    className="bg-[#121212] border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-red-500 focus:bg-white/5 transition-all placeholder-[color:var(--placeholder-color)]"
                    placeholder="(555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-4">Email Address</label>
                <motion.input 
                  type="email" 
                  id="email"
                  required
                  style={{ "--placeholder-color": placeholderColor, width: inputWidth } as any}
                  className="bg-[#121212] border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-red-500 focus:bg-white/5 transition-all placeholder-[color:var(--placeholder-color)]"
                  placeholder="contact@evanaustin.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="goals" className="text-[10px] uppercase tracking-widest text-white/40 font-bold ml-4">Your Goals</label>
                <motion.textarea 
                  id="goals"
                  required
                  rows={4}
                  style={{ "--placeholder-color": placeholderColor, width: inputWidth } as any}
                  className="bg-[#121212] border border-white/10 rounded-3xl px-6 py-5 text-white focus:outline-none focus:border-red-500 focus:bg-white/5 transition-all resize-none placeholder-[color:var(--placeholder-color)]"
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
    </section>
  );
};
