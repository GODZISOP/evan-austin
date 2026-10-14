import type { Metadata } from "next";
import Link from "next/link";
import { 
  Dumbbell, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Video, 
  Apple, 
  MessageSquare,
  HelpCircle
} from "lucide-react";

export const metadata: Metadata = {
  title: "Coaching Services & Tiers | Evan Austin",
  description: "Bespoke 1-on-1 fitness coaching, contest prep, hypertrophy splits, and video form analysis with Coach Evan Austin.",
};

const tiers = [
  {
    name: "BUILD YOUR FOUNDATION",
    price: "$49",
    period: "/month",
    description: "New to serious lifting? Learn proper form, establish daily discipline, and build fundamental movement patterns that stick.",
    badge: "BEGINNER TO NOVICE",
    features: [
      "Access to official Leg & Arm Day protocols",
      "Movement cues & setup guidelines",
      "Calculated rep targets & rest intervals",
      "Monthly protocol progression updates",
      "Email support & questions"
    ],
    highlight: false,
    cta: "Join Foundation"
  },
  {
    name: "PROGRESSIVE OVERLOAD",
    price: "$99",
    period: "/month",
    description: "For lifters who have stalled out. Learn how to train with authentic intensity and auto-regulate weight for continuous hypertrophy.",
    badge: "MOST POPULAR",
    features: [
      "Full access to all training splits & future additions",
      "Weekly auto-regulated load adjustments",
      "Nutrition & macronutrient framework",
      "Weekly progress audit & recovery check-in",
      "Direct coach chat access"
    ],
    highlight: true,
    cta: "Start Progressive Overload"
  },
  {
    name: "BREAK YOUR PLATEAU",
    price: "$149",
    period: "/month",
    description: "The full 1-on-1 athletic partnership. Direct bio-mechanical form critique, 24/7 accountability, and custom competition preparation.",
    badge: "ELITE 1-ON-1",
    features: [
      "Fully personalized bespoke split tailored to your weak points",
      "Video form analysis & lifting critique within 24 hours",
      "Strict contest prep / cutting & peaking protocol",
      "Direct 24/7 priority messaging with Evan",
      "Guaranteed weekly 1-on-1 strategy call"
    ],
    highlight: false,
    cta: "Apply For Elite Tier"
  }
];

const servicePillars = [
  {
    icon: <Activity className="w-5 h-5 text-red-500" />,
    title: "Hypertrophy Science",
    description: "No generic bro-splits. Every move targets specific muscle fiber orientation with dialed-in rest periods."
  },
  {
    icon: <Video className="w-5 h-5 text-red-500" />,
    title: "Biomechanical Form Review",
    description: "Submit video footage of your heaviest sets. Get frame-by-frame feedback on bar path, joint angles, and tempo."
  },
  {
    icon: <Apple className="w-5 h-5 text-red-500" />,
    title: "Macronutrient Guidance",
    description: "Calculated protein and carbohydrate timing tailored around your workout window to maximize lean muscle retention."
  },
  {
    icon: <MessageSquare className="w-5 h-5 text-red-500" />,
    title: "Direct Accountability",
    description: "Direct contact with Coach Evan. When motivation wanes, discipline and real accountability take over."
  }
];

const faqs = [
  {
    q: "How are the training routines and sets delivered?",
    a: "Your splits are integrated directly into our digital training web app. You get access to every exercise with animated diagrams, set counters, rest timers, and exact rep ranges."
  },
  {
    q: "How does video form feedback work?",
    a: "Athletes on the Progressive Overload and Elite tiers upload short clips of their lifts. Evan reviews bar speed, stability, and depth, returning notes directly to you."
  },
  {
    q: "Can I cancel or switch tiers at any time?",
    a: "Yes. All coaching agreements are month-to-month with no hidden cancellation fees. You can upgrade or pause whenever your schedule demands."
  },
  {
    q: "Is nutrition included in all tiers?",
    a: "Foundational macronutrient targets are included in Progressive Overload, while bespoke contest-prep meal plans are reserved for the Elite 1-on-1 tier."
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-24 selection:bg-red-600 selection:text-white">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-8 pb-4 border-b border-white/10">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-red-500 font-bold uppercase">Services</span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 font-mono text-xs uppercase tracking-widest font-bold mb-4">
            <Flame className="w-3.5 h-3.5" />
            <span>Coaching Philosophy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6">
            COACHING <span className="text-red-600">SERVICES</span> & TIERS
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-light">
            Whether you need structured hypertrophy splits or direct 1-on-1 contest preparation, 
            every program is built on one standard: zero excuses and relentless progression.
          </p>
        </div>

        {/* 3 Pricing / Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                tier.highlight
                  ? "bg-gradient-to-b from-red-950/30 to-[#0d0d0d] border-2 border-red-600 shadow-[0_0_50px_rgba(239,68,68,0.2)] lg:-translate-y-2"
                  : "bg-[#0b0b0b] border border-white/10 hover:border-white/20"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-red-600 text-white font-mono text-[10px] uppercase tracking-widest font-bold shadow-lg">
                  {tier.badge}
                </div>
              )}

              <div>
                {!tier.highlight && (
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold mb-2">
                    {tier.badge}
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-5xl font-black text-white">{tier.price}</span>
                  <span className="text-xs font-mono text-neutral-400 uppercase font-bold">{tier.period}</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  {tier.description}
                </p>

                <div className="pt-6 border-t border-white/10 mb-8 space-y-3">
                  <div className="text-[11px] font-mono uppercase text-neutral-300 font-bold tracking-wider mb-2">
                    What's Included:
                  </div>
                  {tier.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/contact"
                className={`w-full py-4 rounded-full font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  tier.highlight
                    ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                }`}
              >
                <span>{tier.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        {/* Pillars Section */}
        <div className="mb-24 p-8 sm:p-12 rounded-3xl bg-[#090909] border border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold mb-2">
              The Coaching Pillars
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              HOW WE GUARANTEE YOUR PROGRESS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicePillars.map((p, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#111] border border-white/5 flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-2">{p.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Non-Generic FAQ */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold mb-2 flex items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-500" />
              <span>Coaching FAQ</span>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              COMMON QUESTIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#0c0c0c] border border-white/10">
                <h4 className="text-sm font-bold text-white mb-2">{faq.q}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Dual Action Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-red-950/40 via-red-900/20 to-neutral-950 border border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold mb-1">
              READY TO COMMENCE?
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              EXPLORE OUR SPLITS OR APPLY FOR COACHING
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl">
              Inspect our official Leg Day and Arm Day routines right now, or message Evan directly to start your 1-on-1 assessment.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              href="/programs"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all border border-white/15"
            >
              View Workouts
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/30 flex items-center gap-2"
            >
              <span>Apply For Coaching</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
