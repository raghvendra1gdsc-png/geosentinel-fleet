import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import type { MissionEvent } from '../types/mission';

interface HeroStatProps {
  events: MissionEvent[];
  stage: string;
}

/**
 * Prominent comparison callout: autonomous triage time vs manual engineering assessment.
 * Only visible after mission has started.
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
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl border p-4 font-mono transition-all duration-500 ${
        isComplete
          ? 'bg-gradient-to-r from-emerald-950/60 via-[#0b0c12] to-cyan-950/40 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
          : 'bg-gradient-to-r from-cyan-950/40 via-[#0b0c12] to-blue-950/40 border-cyan-500/30'
      }`}
    >
      {/* Glow accent */}
      <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Autonomous time */}
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl border ${
            isComplete
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
              : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
          }`}>
            <Zap size={24} />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
              Autonomous Triage Elapsed
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl font-black tracking-tight ${isComplete ? 'text-emerald-400' : 'text-cyan-300'}`}>
                <AnimatedNumber value={elapsedSeconds} decimals={1} />
              </span>
              <span className="text-sm text-gray-400 font-bold">seconds</span>
            </div>
          </div>
        </div>

        {/* Center: VS divider */}
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-white/10 hidden sm:block" />
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">vs</span>
          <div className="h-px w-8 bg-white/10 hidden sm:block" />
        </div>

        {/* Right: Manual reference */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-gray-500">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
              Manual Engineering Assessment
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black tracking-tight text-gray-500">
                3–6
              </span>
              <span className="text-sm text-gray-400 font-bold">weeks</span>
            </div>
          </div>
        </div>

        {/* Speed multiplier badge */}
        {isComplete && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-center hidden lg:block"
          >
            <div className="text-2xl font-black text-emerald-400 tracking-tight">
              ~18,000×
            </div>
            <div className="text-[9px] text-emerald-300/80 font-bold uppercase tracking-wider">
              Faster
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
