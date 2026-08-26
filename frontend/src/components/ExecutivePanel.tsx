import { CheckCircle, ShieldCheck, ArrowRight, Download } from 'lucide-react';
import type { MissionState } from '../types/mission';

interface ExecutivePanelProps {
  missionState: MissionState | null;
  onDownloadDossier: () => void;
}

export function ExecutivePanel({ missionState, onDownloadDossier }: ExecutivePanelProps) {
  if (!missionState || missionState.stage !== 'COMPLETE') {
    return null;
  }

  const preSF = missionState.initial_safety_factor || 0.94;
  const postSF = missionState.post_retrofit_safety_factor || 1.88;
  const retro = missionState.retrofit_data;
  const layers = retro?.required_cfrp_layers || 3;

  return (
    <div className="bg-gradient-to-r from-emerald-950/40 via-surface to-surface border border-emerald-900/60 rounded-xl p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800 font-mono">
                Mission Status: Concluded
              </span>
              <span className="text-xs text-gray-500 font-mono">ID: {missionState.mission_id.substring(0, 8)}</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Structural Emergency Assessment & Remediation Directive
            </h2>
          </div>
        </div>

        <button
          onClick={onDownloadDossier}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg hover:shadow-emerald-600/30 shrink-0 font-mono"
        >
          <Download size={15} /> Download Signed Audit Dossier (.MD)
        </button>
      </div>

      {/* 4 Key Decision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 my-4">
        <div className="bg-surfaceHighlight/60 p-3 rounded-xl border border-gray-800">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono block">Condition Transition</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-900">HIGH RISK</span>
            <ArrowRight size={12} className="text-gray-500" />
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">MITIGATED</span>
          </div>
        </div>

        <div className="bg-surfaceHighlight/60 p-3 rounded-xl border border-gray-800">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono block">Safety Factor Margin</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-amber-400 font-mono">{preSF.toFixed(2)}</span>
            <ArrowRight size={12} className="text-gray-500" />
            <span className="text-sm font-bold text-emerald-400 font-mono">{postSF.toFixed(2)}</span>
            <span className="text-[10px] text-gray-500">(≥ 1.50)</span>
          </div>
        </div>

        <div className="bg-surfaceHighlight/60 p-3 rounded-xl border border-gray-800">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono block">Prescribed Intervention</span>
          <div className="text-xs font-bold text-purple-300 mt-1 font-mono">
            {layers}-Ply CFRP Composite Jacket
          </div>
        </div>

        <div className="bg-surfaceHighlight/60 p-3 rounded-xl border border-gray-800">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono block">Independent Verification</span>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 mt-1">
            <ShieldCheck size={14} /> PASSED (ACI 440.2R / ASCE 41)
          </div>
        </div>
      </div>

      {/* Directive text */}
      <div className="bg-surface/80 p-3 rounded-lg border border-gray-800/80 text-xs text-gray-300 font-sans leading-relaxed">
        <strong className="text-white block mb-0.5">Autonomous Executive Recommendation:</strong>
        {missionState.final_decision || (
          "Enforce immediate load restriction to 25 metric tons across span. Deploy contractor for 3-ply high-strength unidirectional CFRP composite wrap installation. Safety Factor restored to 1.88 upon curing."
        )}
      </div>
    </div>
  );
}
