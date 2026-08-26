import { Brain, Cpu, ShieldCheck, Sparkles } from 'lucide-react';

export function WhyAgenticPanel() {
  return (
    <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-surface border border-blue-900/40 rounded-xl p-4 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/20 text-primary rounded-lg mt-0.5">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/30">
                Core Architecture
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Gemini Reasons • Physics Calculates • Agents Coordinate • Validation Enforces Trust
              </h3>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-4xl leading-relaxed">
              GeoSentinel Fleet does not execute a rigid hardcoded script. When initial shear calculations indicate safety but contradict physical damage telemetry, the <strong>Validation Agent</strong> raises an independent objection, prompting the <strong>Commander</strong> to dynamically adapt the investigation to non-linear moment-curvature and finite-element modeling.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-surfaceHighlight/80 px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300">
            <Brain size={14} className="text-blue-400" />
            <span>AI Reasoning</span>
          </div>
          <span className="text-gray-600">→</span>
          <div className="flex items-center gap-1.5 bg-surfaceHighlight/80 px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300">
            <Cpu size={14} className="text-green-400" />
            <span>Deterministic Physics</span>
          </div>
          <span className="text-gray-600">→</span>
          <div className="flex items-center gap-1.5 bg-surfaceHighlight/80 px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>Independent Audit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
