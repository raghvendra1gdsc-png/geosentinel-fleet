import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Wrench, CheckCircle2, ChevronRight } from 'lucide-react';
import type { MissionState } from '../types/mission';
import { AnimatedNumber } from './AnimatedNumber';

interface AppleScrollStoryProps {
  missionState: MissionState | null;
  stage?: string;
}

export function AppleScrollStory({ missionState }: AppleScrollStoryProps) {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const preSF = missionState?.initial_safety_factor || 0.94;
  const postSF = missionState?.post_retrofit_safety_factor || 1.74;
  const layers = missionState?.retrofit_data?.required_cfrp_layers || 3;

  // Track scroll position through the 300vh spacer
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollable));
      setScrollProgress(progress);

      if (progress < 0.25) setActiveStep(0);
      else if (progress < 0.50) setActiveStep(1);
      else if (progress < 0.75) setActiveStep(2);
      else setActiveStep(3);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      id: 0,
      badge: 'PHASE 01 • SEISMIC DEFICIT',
      title: 'Plastic Hinge Formation',
      subtitle: '0.42g Ground Acceleration • 2,140 με Anomaly',
      desc: 'Severe flexural yielding and cover spalling at the pier base. ACI 318 linear shear screening masked true plastic hinge mechanism.',
      metricLabel: 'INITIAL SAFETY FACTOR',
      metricValue: preSF,
      metricUnit: 'SF',
      statusText: 'CRITICAL DEFICIT (SF < 1.50)',
      statusColor: 'text-red-400',
      badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
      icon: Activity,
    },
    {
      id: 1,
      badge: 'PHASE 02 • ADVERSARIAL REPLAN',
      title: 'Fiber Section Discretization',
      subtitle: 'OpenSeesPy Non-Linear Pushover FEA',
      desc: 'Validation Sentinel refuted shear hypothesis. Commander re-dispatched fiber solver: 800 kNm demand exceeds 750 kNm unreinforced yield capacity.',
      metricLabel: 'SECTION MOMENT CAPACITY',
      metricValue: 750,
      metricUnit: 'kNm',
      statusText: '50 kNm SHORTFALL DETECTED',
      statusColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: ShieldAlert,
    },
    {
      id: 2,
      badge: 'PHASE 03 • ENGINEERED INTERVENTION',
      title: '3-Ply CFRP Composite Wrap',
      subtitle: 'SikaWrap-300C Continuous Jacket',
      desc: 'High-tensile carbon fiber composite wrap applied to plastic hinge zone. 230 GPa modulus adds 640 kNm moment capacity with negligible dead load.',
      metricLabel: 'LAMINATE THICKNESS',
      metricValue: 3.0,
      metricUnit: 'mm',
      statusText: `${layers} PLIES CONTINUOUS JACKET`,
      statusColor: 'text-purple-400',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      icon: Wrench,
    },
    {
      id: 3,
      badge: 'PHASE 04 • CONFINED RESTORATION',
      title: 'Triaxial Confinement Restored',
      subtitle: 'ASCE 41-17 & ACI 440.2R Verified',
      desc: 'Ultimate concrete core compressive strain increased by +160%. Structural safety factor restored to 1.74, exceeding mandatory 1.50 threshold.',
      metricLabel: 'RESTORED SAFETY FACTOR',
      metricValue: postSF,
      metricUnit: 'SF',
      statusText: 'VERIFIED SAFE (SF ≥ 1.50)',
      statusColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
  ];

  const current = steps[activeStep];

  return (
    <div ref={containerRef} className="relative min-h-[260vh]">
      {/* Sticky Apple Viewport */}
      <div className="sticky top-20 z-10 w-full">
        <div className="apple-glass rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header & Apple Pill Checkpoints */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  SCROLL-DRIVEN TRANSFORMATION
                </span>
                <span className="text-xs text-slate-400">600×600mm RC Pier Structural Mechanics</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black apple-gradient-text tracking-tight">
                From Critical Deficit to Certified Strength
              </h2>
            </div>

            {/* Apple Segmented Scrubber Checkpoints */}
            <div className="flex items-center bg-black/50 p-1.5 rounded-2xl border border-white/[0.08] gap-1 overflow-x-auto">
              {steps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => {
                    if (containerRef.current) {
                      const rect = containerRef.current.getBoundingClientRect();
                      const targetY = window.scrollY + rect.top + (idx / 3.5) * (rect.height - window.innerHeight);
                      window.scrollTo({ top: targetY, behavior: 'smooth' });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activeStep === idx
                      ? 'apple-pill-active font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeStep === idx ? 'bg-white' : 'bg-slate-600'}`} />
                  <span>0{idx + 1} {step.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scrolly Progress Bar */}
          <div className="w-full bg-white/[0.06] h-1 rounded-full my-4 overflow-hidden relative z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400"
              style={{ width: `${Math.min(100, Math.max(5, scrollProgress * 100))}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Main Visual Display: Diagram + Telemetry Narrative */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 mt-6">
            
            {/* Left 7 cols: Interactive 3D SVG Cross-Section */}
            <div className="lg:col-span-7 bg-black/60 rounded-2xl p-6 border border-white/[0.08] relative overflow-hidden flex flex-col items-center justify-center min-h-[380px]">
              
              {/* Laser Scanline on Step 1 */}
              {activeStep === 1 && (
                <div className="absolute inset-0 pointer-events-none laser-scan bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent h-24" />
              )}

              {/* Dynamic SVG Pier Section */}
              <div className="w-full max-w-[340px] aspect-square relative flex items-center justify-center">
                <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-2xl">
                  <defs>
                    <linearGradient id="concreteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1a1a24" />
                      <stop offset="100%" stopColor="#0d0d12" />
                    </linearGradient>
                    <linearGradient id="cfrpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <radialGradient id="confinedGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(48, 209, 88, 0.35)" />
                      <stop offset="100%" stopColor="rgba(48, 209, 88, 0)" />
                    </radialGradient>
                  </defs>

                  {/* Confined Glow on Step 3 */}
                  {activeStep === 3 && (
                    <circle cx="120" cy="120" r="105" fill="url(#confinedGlow)" className="animate-pulse" />
                  )}

                  {/* CFRP Outer Composite Laminate Jacket (Steps 2 & 3) */}
                  {(activeStep === 2 || activeStep === 3) && (
                    <motion.rect
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      x="18"
                      y="18"
                      width="204"
                      height="204"
                      rx="20"
                      fill="none"
                      stroke="url(#cfrpGrad)"
                      strokeWidth={activeStep === 3 ? "7" : "5"}
                      strokeDasharray={activeStep === 2 ? "12 4" : "none"}
                      className={activeStep === 2 ? "orbit-cfrp-line" : ""}
                    />
                  )}

                  {/* Outer RC Concrete Section (600x600mm) */}
                  <rect
                    x="28"
                    y="28"
                    width="184"
                    height="184"
                    rx="14"
                    fill="url(#concreteGrad)"
                    stroke={
                      activeStep === 0 ? "#ff453a" :
                      activeStep === 1 ? "#ff9f0a" :
                      activeStep === 2 ? "#bf5af2" :
                      "#30d158"
                    }
                    strokeWidth="2.5"
                    className="transition-colors duration-500"
                  />

                  {/* Fiber Section Discretization Grid (Step 1) */}
                  {activeStep >= 1 && (
                    <g opacity={activeStep === 1 ? "0.85" : "0.3"}>
                      {[56, 88, 120, 152, 184].map((pos) => (
                        <line key={`gx-${pos}`} x1={pos} y1="28" x2={pos} y2="212" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="3 3" />
                      ))}
                      {[56, 88, 120, 152, 184].map((pos) => (
                        <line key={`gy-${pos}`} x1="28" y1={pos} x2="212" y2={pos} stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="3 3" />
                      ))}
                    </g>
                  )}

                  {/* Damage Spalling Zone & Plastic Cracks (Step 0) */}
                  {activeStep === 0 && (
                    <g>
                      <path d="M 28 50 Q 55 65 48 110 Q 60 160 28 175 Z" fill="#7f1d1d" opacity="0.65" />
                      <path d="M 212 60 Q 185 85 190 130 Q 180 170 212 185 Z" fill="#7f1d1d" opacity="0.65" />
                      <path d="M 60 45 L 85 80 L 70 120 L 105 160" stroke="#fca5a5" strokeWidth="2.5" strokeDasharray="4 2" fill="none" className="animate-pulse" />
                      <path d="M 180 50 L 150 90 L 165 130 L 135 170" stroke="#fca5a5" strokeWidth="2.5" strokeDasharray="4 2" fill="none" className="animate-pulse" />
                    </g>
                  )}

                  {/* Steel Stirrup Tie Cage */}
                  <rect
                    x="50"
                    y="50"
                    width="140"
                    height="140"
                    rx="8"
                    fill="none"
                    stroke={activeStep === 3 ? "#30d158" : "#64748b"}
                    strokeWidth="1.5"
                    strokeDasharray={activeStep === 0 ? "4 3" : "none"}
                  />

                  {/* 8 Longitudinal Steel Rebars */}
                  {[
                    { cx: 58, cy: 58 },
                    { cx: 120, cy: 58 },
                    { cx: 182, cy: 58 },
                    { cx: 58, cy: 120 },
                    { cx: 182, cy: 120 },
                    { cx: 58, cy: 182 },
                    { cx: 120, cy: 182 },
                    { cx: 182, cy: 182 },
                  ].map((reb, i) => (
                    <circle
                      key={i}
                      cx={reb.cx}
                      cy={reb.cy}
                      r="6.5"
                      fill={activeStep === 3 ? "#30d158" : activeStep === 0 ? "#ff453a" : "#2997ff"}
                      stroke="#000"
                      strokeWidth="1.5"
                    />
                  ))}

                  {/* Center State Label */}
                  <text
                    x="120"
                    y="125"
                    textAnchor="middle"
                    fill={
                      activeStep === 0 ? "#ff453a" :
                      activeStep === 1 ? "#38bdf8" :
                      activeStep === 2 ? "#bf5af2" :
                      "#30d158"
                    }
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="1"
                  >
                    {activeStep === 0 ? "PLASTIC HINGE" :
                     activeStep === 1 ? "FIBER MATRIX" :
                     activeStep === 2 ? "CFRP WRAP" :
                     "CONFINED CORE"}
                  </text>
                </svg>
              </div>

              {/* Status Footer */}
              <div className="mt-4 flex items-center justify-between w-full text-[11px] font-mono text-slate-400 border-t border-white/[0.06] pt-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  600×600mm Square RC Section
                </span>
                <span className={current.statusColor + " font-bold"}>
                  {current.statusText}
                </span>
              </div>
            </div>

            {/* Right 5 cols: Apple Telemetry Narrative */}
            <div className="lg:col-span-5 space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${current.badgeBg}`}>
                    <current.icon size={12} />
                    {current.badge}
                  </span>

                  <h3 className="text-2xl font-black text-white tracking-tight">
                    {current.title}
                  </h3>

                  <div className="text-xs font-mono text-cyan-400 font-bold">
                    {current.subtitle}
                  </div>

                  <p className="text-sm text-slate-300 font-sans leading-relaxed">
                    {current.desc}
                  </p>

                  {/* Primary Hero Metric Callout */}
                  <div className="bg-black/50 p-4 rounded-2xl border border-white/[0.08] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                        {current.metricLabel}
                      </span>
                      <div className="text-3xl font-black text-white font-mono tracking-tight mt-0.5 flex items-baseline gap-1">
                        <AnimatedNumber value={current.metricValue} decimals={activeStep === 1 ? 0 : 2} />
                        <span className="text-xs text-slate-400 font-normal">{current.metricUnit}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-mono font-black ${current.statusColor}`}>
                        {current.statusText}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        {activeStep === 3 ? "ASCE 41-17 Verified" : "Autonomous Solved"}
                      </span>
                    </div>
                  </div>

                  {/* Micro Hint */}
                  <div className="text-[11px] text-slate-500 font-sans flex items-center gap-1.5 pt-2">
                    <span>Scroll down to continue transformation</span>
                    <ChevronRight size={13} className="text-slate-400" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
