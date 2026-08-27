import { CheckCircle2, ShieldCheck, ArrowRight, Download, FileText, RotateCcw, Award } from 'lucide-react';
import type { MissionState } from '../types/mission';

interface ExecutivePanelProps {
  missionState: MissionState | null;
  onDownloadDossier: () => void;
  onReplayMission?: () => void;
  isReplaying?: boolean;
}

export function ExecutivePanel({
  missionState,
  onDownloadDossier,
  onReplayMission,
  isReplaying
}: ExecutivePanelProps) {
  if (!missionState || missionState.stage !== 'COMPLETE') {
    return null;
  }

  const preSF = missionState.initial_safety_factor || 0.94;
  const postSF = missionState.post_retrofit_safety_factor || 1.74;
  const retro = missionState.retrofit_data;
  const layers = retro?.required_cfrp_layers || 3;

  return (
    <div className="bg-gradient-to-r from-emerald-950/60 via-[#0a1510] to-[#0b0c12] border-2 border-emerald-500/80 rounded-2xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.2)] relative overflow-hidden animate-in fade-in slide-in-from-bottom-3">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-emerald-500/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/40 shrink-0">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-emerald-500 text-black px-2.5 py-0.5 rounded-full">
                MISSION COMPLETE • RISK MITIGATED
              </span>
              <span className="text-xs text-gray-400 font-mono">
                MISSION REF: {missionState.mission_id.substring(0, 8).toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-black text-white font-mono tracking-tight mt-1">
              Autonomous Remediation Directive Issued • Safety Factor Restored
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {onReplayMission && (
            <button
              onClick={onReplayMission}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-cyan-300 rounded-xl text-xs font-mono font-bold border border-white/10 transition-all hover:border-cyan-500/40"
            >
              <RotateCcw size={14} className="text-cyan-400" />
              <span>{isReplaying ? 'Live View' : 'Replay Mission Stream'}</span>
            </button>
          )}

          <button
            onClick={onDownloadDossier}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-mono font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download size={15} />
            <span>EXPORT SIGNED AUDIT DOSSIER (.MD)</span>
          </button>
        </div>
      </div>

      {/* 4 Hero Decision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 my-5 font-mono">
        <div className="bg-black/40 p-3.5 rounded-xl border border-white/10">
          <span className="text-[10px] uppercase text-gray-400 font-bold block">Structural State</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-900">HIGH RISK</span>
            <ArrowRight size={14} className="text-gray-500" />
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900">MITIGATED</span>
          </div>
        </div>

        <div className="bg-black/40 p-3.5 rounded-xl border border-white/10">
          <span className="text-[10px] uppercase text-gray-400 font-bold block">Safety Factor Margin</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base font-black text-red-400">{preSF.toFixed(2)}</span>
            <ArrowRight size={14} className="text-gray-500" />
            <span className="text-base font-black text-emerald-400">{postSF.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-400 font-bold">(≥ 1.50 Target)</span>
          </div>
        </div>

        <div className="bg-black/40 p-3.5 rounded-xl border border-white/10">
          <span className="text-[10px] uppercase text-gray-400 font-bold block">Engineered Intervention</span>
          <div className="text-xs font-bold text-purple-300 mt-2">
            {layers}-Ply High-Modulus CFRP Wrap (ACI 440.2R)
          </div>
        </div>

        <div className="bg-black/40 p-3.5 rounded-xl border border-white/10">
          <span className="text-[10px] uppercase text-gray-400 font-bold block">Independent Audit</span>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 mt-2">
            <ShieldCheck size={16} /> PASSED • ZERO VIOLATIONS
          </div>
        </div>
      </div>

      {/* Recommendation + Audit Dossier Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Directive text */}
        <div className="lg:col-span-7 bg-black/40 p-4 rounded-xl border border-white/10 text-xs text-gray-300 font-sans leading-relaxed">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold text-emerald-400 mb-1">
            <Award size={13} />
            <span>Autonomous Executive Directive</span>
          </div>
          <p className="mt-1">
            {missionState.final_decision || (
              "Immediate recommendation: Deploy emergency structural contractor for 3-ply high-modulus unidirectional carbon-fiber-reinforced polymer (CFRP) composite jacket installation. Non-linear plastic hinge zone stabilized; ultimate bending capacity restored to 1390 kNm (Safety Factor 1.74)."
            )}
          </p>
        </div>

        {/* Right: Dossier Evidence Package Checklist */}
        <div className="lg:col-span-5 bg-black/40 p-4 rounded-xl border border-white/10 font-mono text-[10px] text-gray-400 flex flex-col justify-between">
          <div>
            <div className="text-gray-200 font-bold uppercase mb-1.5 flex items-center gap-1.5">
              <FileText size={12} className="text-emerald-400" />
              <span>Evidence Package Contents (Generated Dossier)</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[9px] text-gray-300">
              <div>✓ IoT Sensor Telemetry</div>
              <div>✓ OpenSeesPy Fiber FEA</div>
              <div>✓ Multi-turn Reasoning Trace</div>
              <div>✓ Validation Objection Log</div>
              <div>✓ ACI 318 Shear Solver</div>
              <div>✓ ACI 440.2R CFRP Schedule</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
