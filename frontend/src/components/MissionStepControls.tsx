import { RotateCcw, Zap, Layers, Pause, Play, FileText, ChevronDown } from 'lucide-react';
import type { ScenarioSummary } from '../types/mission';

interface MissionStepControlsProps {
  scenarios: ScenarioSummary[];
  selectedScenario: string;
  onSelectScenario: (id: string) => void;
  onTriggerMission: () => void;
  onResetMission: () => void;
  isMissionRunning: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  onReplayMission: () => void;
  onOpenArchitecture: () => void;
  onOpenDossier: () => void;
  missionStatus: string;
  isAutoplay?: boolean;
  onToggleAutoplay?: () => void;
}

export function MissionStepControls({
  scenarios,
  selectedScenario,
  onSelectScenario,
  onTriggerMission,
  onResetMission,
  isMissionRunning,
  isPaused,
  onTogglePause,
  onReplayMission,
  onOpenArchitecture,
  onOpenDossier,
  missionStatus,
  isAutoplay = false,
  onToggleAutoplay
}: MissionStepControlsProps) {
  const isComplete = missionStatus === 'COMPLETE';

  return (
    <div className="bg-[#0b0c12] border border-white/15 rounded-xl p-3.5 shadow-xl flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
      
      {/* Left: Scenario Selector & Main Action */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Scenario Dropdown */}
        <div className="relative">
          <select
            value={selectedScenario}
            onChange={(e) => onSelectScenario(e.target.value)}
            disabled={isMissionRunning}
            className="appearance-none bg-black/60 border border-white/20 hover:border-cyan-500/50 text-gray-200 text-xs font-bold font-mono rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer disabled:opacity-50 transition-colors"
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0b0c14] text-white">
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Primary CTA */}
        <button
          onClick={onTriggerMission}
          disabled={isMissionRunning}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white rounded-lg font-black tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Zap size={14} className="text-yellow-300 fill-yellow-300" />
          <span>⚡ INITIATE AUTONOMOUS TRIAGE</span>
        </button>

        {/* Judge Mode Autoplay Toggle */}
        {onToggleAutoplay && (
          <button
            onClick={onToggleAutoplay}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-bold transition-all ${
              isAutoplay
                ? 'bg-purple-950/80 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-1 ring-purple-400/50'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
            }`}
            title="Hands-free continuous mission execution with auto-scroll for judges"
          >
            <span className={`w-2 h-2 rounded-full ${isAutoplay ? 'bg-purple-400 animate-ping' : 'bg-gray-500'}`} />
            <span>AUTOPLAY DEMO</span>
          </button>
        )}

        {/* Pause / Resume button */}
        {isMissionRunning && (
          <button
            onClick={onTogglePause}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 rounded-lg border border-amber-500/40 transition-colors font-bold"
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>
        )}

        {/* Replay button */}
        {isComplete && (
          <button
            onClick={onReplayMission}
            className="flex items-center gap-1.5 px-3 py-2 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 rounded-lg border border-cyan-500/40 transition-colors font-bold"
          >
            <RotateCcw size={13} />
            <span>REPLAY MISSION</span>
          </button>
        )}

        {/* Reset button */}
        <button
          onClick={onResetMission}
          disabled={isMissionRunning && !isPaused}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg border border-white/10 transition-colors font-bold disabled:opacity-50"
        >
          <RotateCcw size={13} className="text-gray-400" />
          <span>RESET</span>
        </button>
      </div>

      {/* Right: Dossier & Architecture Modals */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onOpenDossier}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 rounded-lg border border-emerald-500/40 transition-colors font-bold hover:border-emerald-400"
        >
          <FileText size={13} className="text-emerald-400" />
          <span>VIEW VERIFICATION DOSSIER</span>
        </button>

        <button
          onClick={onOpenArchitecture}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-cyan-300 rounded-lg border border-cyan-500/30 transition-colors font-bold hover:border-cyan-400"
        >
          <Layers size={13} className="text-cyan-400" />
          <span>SYSTEM ARCHITECTURE</span>
        </button>
      </div>

    </div>
  );
}
