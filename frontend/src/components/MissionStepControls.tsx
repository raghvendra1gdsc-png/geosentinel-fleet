import { RotateCcw, Zap, Layers } from 'lucide-react';

interface MissionStepControlsProps {
  onTriggerMission: () => void;
  onResetMission: () => void;
  isMissionRunning: boolean;
  onOpenArchitecture: () => void;
}

export function MissionStepControls({
  onTriggerMission,
  onResetMission,
  isMissionRunning,
  onOpenArchitecture
}: MissionStepControlsProps) {
  return (
    <div className="bg-[#0b0c12] border border-white/10 rounded-xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
      {/* Left: Judge Demo Quick Launch */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onTriggerMission}
          disabled={isMissionRunning}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white rounded-lg font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Zap size={13} className="text-yellow-300" />
          <span>⚡ 90s JUDGE DEMO RUN</span>
        </button>

        <button
          onClick={onResetMission}
          disabled={isMissionRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg border border-white/10 transition-colors"
        >
          <RotateCcw size={13} className="text-cyan-400" />
          <span>RESET</span>
        </button>
      </div>

      {/* Right: Architecture & Tech Disclosure Modal Trigger */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenArchitecture}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-cyan-300 rounded-lg border border-cyan-500/30 transition-colors hover:border-cyan-400"
        >
          <Layers size={13} className="text-cyan-400" />
          <span>VIEW SYSTEM ARCHITECTURE</span>
        </button>
      </div>
    </div>
  );
}
