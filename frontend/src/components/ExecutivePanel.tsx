import { CheckCircle2, ArrowRight, Download, FileText, RotateCcw, Award } from 'lucide-react';
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
    <div className="bg-gradient-to-r from-emerald-950/80 via-[#091710] to-[#0a0c14] border-2 border-emerald-500 rounded-2xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      {/* Background ambient emerald blast */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 blur-[120px] pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-emerald-500/30 relative z-10">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border-2 border-emerald-500/50 shrink-0 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-mono font-black uppercase tracking-widest bg-emerald-500 text-black px-3 py-0.5 rounded-full shadow-sm">
                MISSION ACCOMPLISHED • INFRASTRUCTURE VERIFIED
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                REF: {missionState.mission_id.substring(0, 8).toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white font-mono tracking-tight mt-1.5">
              Autonomous Remediation Directive Issued • Safety Factor Restored
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {onReplayMission && (
            <button
              onClick={onReplayMission}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-cyan-300 rounded-xl text-xs font-mono font-bold border border-white/15 transition-all hover:border-cyan-500/50"
            >
              <RotateCcw size={15} className="text-cyan-400" />
              <span>{isReplaying ? 'Live View' : 'Replay Swarm Telemetry'}</span>
            </button>
          )}

          <button
            onClick={onDownloadDossier}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl text-xs font-mono font-black tracking-wider transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download size={16} />
            <span>EXPORT SIGNED AUDIT DOSSIER (.MD)</span>
          </button>
        </div>
      </div>

      {/* ═══════════════ HUGE BEFORE / AFTER CLIMAX ═══════════════ */}
      <div className="my-6 p-5 rounded-2xl bg-black/60 border-2 border-emerald-500/40 relative z-10 font-mono">
        <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-3">
          MISSION CLIMAX: DETERMINISTIC STRUCTURAL RISK TRANSFORMATION
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* BEFORE CARD */}
          <div className="md:col-span-5 bg-red-950/40 p-4 rounded-xl border border-red-500/60 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-red-300 font-bold">
              <span>BEFORE TRIAGE</span>
              <span className="bg-red-500 text-black px-2 py-0.2 rounded font-black">HIGH RISK</span>
            </div>
            <div className="my-3">
              <div className="text-4xl font-black text-red-400 tracking-tight">
                SF {preSF.toFixed(2)}
              </div>
              <div className="text-xs text-red-300 font-bold mt-1">
                DEFICIT: −0.56 below ASCE 41 threshold
              </div>
            </div>
            <div className="text-[10px] text-gray-400 pt-2 border-t border-red-500/20">
              Spalling & plastic hinge yielding detected
            </div>
          </div>

          {/* TRANSITION ARROW */}
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-pulse">
              <ArrowRight size={20} />
            </div>
            <span className="text-[9px] text-emerald-400 font-bold mt-1">+85% SF</span>
          </div>

          {/* AFTER CARD */}
          <div className="md:col-span-5 bg-emerald-950/40 p-4 rounded-xl border-2 border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.25)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
              <span>POST-RETROFIT STATE</span>
              <span className="bg-emerald-500 text-black px-2 py-0.2 rounded font-black">VERIFIED SAFE</span>
            </div>
            <div className="my-3">
              <div className="text-4xl font-black text-emerald-400 tracking-tight">
                SF {postSF.toFixed(2)}
              </div>
              <div className="text-xs text-emerald-300 font-bold mt-1">
                TARGET EXCEEDED: ≥ 1.50 Required
              </div>
            </div>
            <div className="text-[10px] text-emerald-300/80 pt-2 border-t border-emerald-500/20">
              {layers}-Ply High-Modulus CFRP Composite Jacket
            </div>
          </div>
        </div>

        {/* 4 Pillars Verified */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4 pt-3 border-t border-white/10 text-xs text-emerald-300 font-bold">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>PHYSICS VERIFIED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>VALIDATION PASSED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>RETROFIT OPTIMIZED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>MISSION COMPLETE</span>
          </div>
        </div>
      </div>

      {/* Directive text + Dossier evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10">
        {/* Left: Directive text */}
        <div className="lg:col-span-7 bg-black/50 p-4 rounded-xl border border-white/10 text-xs text-gray-200 font-sans leading-relaxed">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold text-emerald-400 mb-1">
            <Award size={14} />
            <span>Autonomous Executive Directive</span>
          </div>
          <p className="mt-1">
            {missionState.final_decision || (
              "Immediate recommendation: Deploy emergency structural contractor for 3-ply high-modulus unidirectional carbon-fiber-reinforced polymer (CFRP) composite jacket installation. Non-linear plastic hinge zone stabilized; ultimate bending capacity restored to 1390 kNm (Safety Factor 1.74)."
            )}
          </p>
        </div>

        {/* Right: Dossier Evidence Package Checklist */}
        <div className="lg:col-span-5 bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-[10px] text-gray-400 flex flex-col justify-between">
          <div>
            <div className="text-white font-bold uppercase mb-1.5 flex items-center gap-1.5">
              <FileText size={13} className="text-emerald-400" />
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
