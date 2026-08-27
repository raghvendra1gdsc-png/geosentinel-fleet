import { useState } from 'react';
import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';
import type { MissionEvent } from '../types/mission';

interface DecisionRationaleProps {
  events?: MissionEvent[];
  stage?: string;
}

export function DecisionRationale(_props: DecisionRationaleProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const decisions = [
    {
      title: 'H1 Formulation & Initial Dispatch',
      agent: 'Commander Agent (Gemini 2.5 Pro)',
      observation: 'Piezoelectric microstrain = 2,140 με, Acoustic emission = 84.5 dB.',
      evidence: 'Seismic ground acceleration PGA = 0.42g recorded on Span 14A.',
      hypothesis: 'H1: Surface spalling indicates primary shear failure mode at pier base.',
      decision: 'Dispatch StructuralAgent → analyze_shear_capacity (ACI 318-19).',
      reason: 'Standard triage protocol begins with rapid linear shear screening.',
      nextAction: 'Calculate nominal vs design shear capacity φVn.'
    },
    {
      title: 'Adversarial Challenge & Rejection of H1',
      agent: 'Validation Agent (Independent Gate)',
      observation: 'ACI 318 Shear Capacity check calculated φVn = 850 kN vs Demand Vu = 550 kN (SF = 1.54 PASS).',
      evidence: 'Physical sensor readings (2,140 με, 84.5 dB) clearly indicate structural distress that shear adequacy fails to explain.',
      hypothesis: 'Shear-only model is INCONCLUSIVE and physically contradictory.',
      decision: 'Raise independent validation objection & block approval.',
      reason: 'Zero-tolerance law: A code check pass cannot override empirical physical sensor damage.',
      nextAction: 'Issue command back to Commander to REPLAN investigation.'
    },
    {
      title: 'Adaptive Replanning to Non-Linear Fiber FEA',
      agent: 'Commander Agent (Gemini 2.5 Pro)',
      observation: 'Validation Sentinel objection received; shear hypothesis refuted.',
      evidence: 'High microstrain aligns with axial-flexural plastic hinge formation.',
      hypothesis: 'H2: True failure mode is flexural yield and ductility degradation.',
      decision: 'Pivot investigation to OpenSeesPy Fiber FEA & ASCE 41-17 Moment-Curvature.',
      reason: 'Linear methods failed; non-linear discretization is required to capture plastic hinge mechanics.',
      nextAction: 'Dispatch SimulationAgent (OpenSeesPy) & StructuralAgent (ASCE 41-17).'
    },
    {
      title: 'CFRP Composite Retrofit Optimization & Closure',
      agent: 'Retrofit Agent & Validation Audit',
      observation: 'Moment-Curvature analysis uncovered true Flexural Safety Factor SF = 0.94 (< 1.50 CRITICAL).',
      evidence: 'Moment demand Mu = 800 kNm exceeds yield section capacity (750 kNm).',
      hypothesis: 'CFRP composite jacket confinement will restore section ductility and flexural capacity.',
      decision: 'Optimize ACI 440.2R multi-ply CFRP jacket (3-ply SikaWrap-300C selected).',
      reason: 'Restores Safety Factor to 1.74 (> 1.50 threshold) with minimal dead load increase.',
      nextAction: 'Independent Validation Agent signs final certification; issue Executive Directive.'
    }
  ];

  return (
    <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-blue-500/20 text-blue-400">
            <HelpCircle size={14} />
          </div>
          <h3 className="text-xs font-mono font-black uppercase tracking-wider text-white">
            AUTONOMOUS DECISION RATIONALE • WHY DID THE AGENTS ACT?
          </h3>
        </div>

        <div className="text-[10px] text-gray-400">
          OBSERVABLE REASONING CHAIN • NO FABRICATED HALLUCINATIONS
        </div>
      </div>

      {/* Decision Accordion Cards */}
      <div className="space-y-2.5">
        {decisions.map((dec, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-black/60 border-cyan-500/40 shadow-md'
                  : 'bg-black/30 border-white/5 hover:border-white/15'
              }`}
            >
              {/* Header Button */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-gray-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white/[0.04] text-cyan-400 border border-white/10">
                    DECISION {idx + 1}
                  </span>
                  <span className="text-white tracking-tight">{dec.title}</span>
                  <span className="text-[10px] text-gray-500 font-normal hidden md:inline-block">
                    • {dec.agent}
                  </span>
                </div>
                {isExpanded ? <ChevronDown size={14} className="text-cyan-400" /> : <ChevronRight size={14} className="text-gray-400" />}
              </button>

              {/* Expandable Body */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-white/5 text-[11px] grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase font-bold">1. Observed Physical Telemetry</span>
                      <span className="text-amber-300 font-semibold">{dec.observation}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase font-bold">2. Empirical Evidence</span>
                      <span className="text-gray-300">{dec.evidence}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase font-bold">3. Hypothesis Formulation</span>
                      <span className="text-cyan-300">{dec.hypothesis}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase font-bold">4. Autonomous Decision</span>
                      <span className="text-emerald-300 font-bold">{dec.decision}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase font-bold">5. Engineering Rationale</span>
                      <span className="text-gray-300 font-sans leading-snug">{dec.reason}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[9px] uppercase font-bold">6. Next Action Dispatched</span>
                      <span className="text-purple-300 font-bold">{dec.nextAction}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
