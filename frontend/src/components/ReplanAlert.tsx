import { AlertTriangle, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MissionEvent } from '../types/mission';

interface ReplanAlertProps {
  events: MissionEvent[];
  stage: string;
}

export function ReplanAlert({ events, stage }: ReplanAlertProps) {
  // Check if replanning occurred
  const replanEvent = events.find(
    e => e.event_type === 'REPLANNING' || e.stage === 'REPLANNING' || e.message.toLowerCase().includes('replan')
  );

  const validationFlag = events.find(
    e => e.event_type === 'VALIDATION_FLAG' || e.status === 'WARNING' || e.message.toLowerCase().includes('insufficient')
  );

  const isReplanningNow = stage === 'REPLANNING';
  const hasReplanned = !!replanEvent || !!validationFlag;

  if (!hasReplanned && !isReplanningNow) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        id="section-replan-alert"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-r from-amber-950/70 via-[#181108] to-[#0c0d14] border-2 border-amber-500/80 rounded-2xl p-4 shadow-[0_0_30px_rgba(245,158,11,0.25)] relative overflow-hidden"
      >
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          {/* Left: Validation objection details */}
          <div className="flex items-start gap-3.5">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40 shrink-0 mt-0.5"
            >
              <AlertTriangle size={22} className="animate-pulse" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-[10px] font-mono font-black uppercase tracking-widest bg-amber-500 text-black px-2.5 py-0.5 rounded-full font-mono shadow-sm"
                >
                  ⚠ ADVERSARIAL VALIDATION OVERRIDE
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs text-amber-300 font-mono font-bold"
                >
                  Hypothesis Refutation In Progress
                </motion.span>
              </div>

              {/* Strikethrough hypothesis */}
              <motion.h3
                className="text-sm font-bold text-white font-mono mt-1 relative"
              >
                <span className="relative inline-block">
                  Initial Shear Assessment Inconclusive (SF 1.54) • Physical Sensor Damage Unresolved
                  <motion.span
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.6, duration: 0.8, ease: 'easeInOut' }}
                    className="absolute left-0 top-1/2 h-[2px] bg-amber-400"
                    style={{ transformOrigin: 'left' }}
                  />
                </span>
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="text-xs text-gray-300 font-sans mt-0.5 max-w-3xl leading-relaxed"
              >
                {validationFlag?.message || (
                  "Validation Agent raised an independent objection: ACI 318 shear analysis indicated adequate capacity, but 2140 με strain and acoustic cracking telemetry remain unaccounted for. Rigid script avoided."
                )}
              </motion.p>
            </div>
          </div>

          {/* Right: Commander Pivot Directive + REPLAN TRIGGERED stamp */}
          <div className="flex flex-col gap-2 shrink-0 lg:max-w-xs">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="bg-black/50 p-3 rounded-xl border border-amber-500/30 font-mono"
            >
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-400 mb-1">
                <RotateCw size={12} className={isReplanningNow ? "animate-spin" : ""} />
                <span>COMMANDER STRATEGIC PIVOT</span>
              </div>
              <div className="text-[11px] text-gray-200 leading-snug">
                → Pivot from Shear to <strong className="text-cyan-300">OpenSeesPy Non-Linear Fiber FEA</strong> & <strong className="text-cyan-300">Moment-Curvature Pushover</strong>.
              </div>
            </motion.div>

            {/* REPLAN TRIGGERED stamp */}
            <motion.div
              initial={{ scale: 0.5, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.4, type: 'spring', stiffness: 200, damping: 12 }}
              className="self-center lg:self-end px-4 py-1.5 bg-amber-500 text-black font-black font-mono text-xs uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.4)] border-2 border-amber-400"
            >
              ⚡ REPLAN TRIGGERED
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
