import { Brain, Cpu, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface EvidenceChainProps {
  stage: string;
  hasReplanned?: boolean;
}

export function EvidenceChain({ stage, hasReplanned }: EvidenceChainProps) {
  const isComplete = stage === 'COMPLETE';

  return (
    <div className="bg-[#0a0b10] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Sparkles size={14} />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span>Autonomous Trust Architecture</span>
              <span className="text-[9px] text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.2 rounded font-mono">
                CORE DIFFERENTIATOR
              </span>
            </h3>
            <div className="text-[10px] text-gray-400 font-mono">
              AI proposes • Physics calculates • Validation enforces trust
            </div>
          </div>
        </div>

        <div className="text-[10px] font-mono text-gray-500 flex items-center gap-2">
          <span>ZERO NUMERICAL HALLUCINATION PROTOCOL</span>
        </div>
      </div>

      {/* The 3-Tier Layered Evidence Chain */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative">
        {/* Tier 1: AI Reasoning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0, duration: 0.35 }}
          className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
            stage !== 'IDLE'
              ? 'bg-blue-950/40 border-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30'
              : 'bg-[#0f111a] border-white/10'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-blue-400">
                01 • REASONING LAYER
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                Gemini 2.5 Pro
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-white font-mono mb-1">
              <Brain size={16} className="text-blue-400 shrink-0" />
              <span>Multi-Turn Agent Swarm</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans mt-2">
              Autonomous Commander synthesizes multimodal sensor feeds, generates adversarial hypotheses, coordinates 4 specialist agents, and adapts strategy when challenged.
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/5 text-[10px] font-mono text-blue-300 flex items-center justify-between">
            <span>Mandate:</span>
            <span className="font-bold">Strategic Coordination</span>
          </div>
        </motion.div>

        {/* Tier 2: Deterministic Engineering Physics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 * 0.07, duration: 0.35 }}
          className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
            stage === 'EXECUTION' || isComplete
              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
              : 'bg-[#0f111a] border-white/10'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-400">
                02 • CALCULATION LAYER
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                NumPy / OpenSeesPy
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-white font-mono mb-1">
              <Cpu size={16} className="text-emerald-400 shrink-0" />
              <span>Deterministic Mechanics</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans mt-2">
              No numbers fabricated. All safety factors, section curvatures, shear loads, and CFRP laminate plies are solved directly via ACI 318-19, ASCE 41-17, and OpenSeesPy FEA.
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/5 text-[10px] font-mono text-emerald-300 flex items-center justify-between">
            <span>Mandate:</span>
            <span className="font-bold">Physics Verification</span>
          </div>
        </motion.div>

        {/* Tier 3: Independent Validation Gate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 2 * 0.07, duration: 0.35 }}
          className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
            hasReplanned
              ? 'bg-amber-950/40 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/40'
              : isComplete
              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
              : 'bg-[#0f111a] border-white/10'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-purple-400">
                03 • AUDIT GATE
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                Isolated Gate
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-white font-mono mb-1">
              <ShieldCheck size={16} className="text-purple-400 shrink-0" />
              <span>Independent Auditor</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans mt-2">
              Operates under zero-tolerance safety laws. Cross-audits calculations against physical sensor anomalies and holds authority to reject conclusions and force replanning.
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/5 text-[10px] font-mono text-purple-300 flex items-center justify-between">
            <span>Enforcement:</span>
            <span className="font-bold">SF ≥ 1.50 Compliance</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
