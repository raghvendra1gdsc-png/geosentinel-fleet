import { motion } from 'framer-motion';
import { Zap, Clock, Sparkles } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import type { MissionEvent } from '../types/mission';

interface HeroStatProps {
  events: MissionEvent[];
  stage: string;
}

/**
 * Apple Pro comparison banner: autonomous triage elapsed time vs manual engineering turnaround.
 */
export function HeroStat({ events, stage }: HeroStatProps) {
  if (stage === 'IDLE') return null;

  const isComplete = stage === 'COMPLETE';
  const lastEvent = events[events.length - 1];
  const elapsedSeconds = lastEvent?.elapsed_seconds ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-500 border ${
        isComplete
          ? 'bg-gradient-to-r from-emerald-950/40 via-black to-cyan-950/30 border-emerald-500/30 shadow-[0_8px_32px_rgba(48,209,88,0.15)]'
          : 'apple-glass-card'
      }`}
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Autonomous time */}
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl border ${
            isComplete
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(48,209,88,0.2)]'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(41,151,255,0.2)]'
          }`}>
            <Zap size={22} className={isComplete ? "text-emerald-400" : "text-cyan-400"} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">
              Autonomous Swarm Elapsed
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-4xl font-black font-mono tracking-tight ${isComplete ? 'text-emerald-400' : 'text-cyan-400'}`}>
                <AnimatedNumber value={elapsedSeconds} decimals={1} />
              </span>
              <span className="text-sm text-slate-400 font-medium">seconds</span>
            </div>
          </div>
        </div>

        {/* Center: VS divider */}
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-white/[0.08] hidden md:block" />
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/[0.04]">
            VS
          </span>
          <div className="h-px w-12 bg-white/[0.08] hidden md:block" />
        </div>

        {/* Right: Manual reference */}
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-slate-500">
            <Clock size={22} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">
              Traditional Human Engineering Triage
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-4xl font-black font-mono tracking-tight text-slate-500">
                3–6
              </span>
              <span className="text-sm text-slate-400 font-medium">weeks</span>
            </div>
          </div>
        </div>

        {/* Speed multiplier pill */}
        {isComplete && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center hidden lg:flex items-center gap-3"
          >
            <Sparkles size={18} className="text-emerald-400" />
            <div className="text-left">
              <div className="text-xl font-black text-emerald-400 font-mono tracking-tight leading-none">
                ~18,000×
              </div>
              <div className="text-[9px] text-emerald-300 font-bold uppercase tracking-wider mt-0.5">
                Faster Turnaround
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
