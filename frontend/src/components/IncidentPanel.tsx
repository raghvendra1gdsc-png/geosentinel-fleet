import { MapPin, Radio, Activity, Zap, ChevronDown } from 'lucide-react';
import type { ScenarioSummary } from '../types/mission';

interface IncidentPanelProps {
  scenarios: ScenarioSummary[];
  selectedScenario: string;
  onSelectScenario: (id: string) => void;
  isMissionRunning: boolean;
  onTriggerMission: () => void;
  missionStatus: string;
}

export function IncidentPanel({
  scenarios,
  selectedScenario,
  onSelectScenario,
  isMissionRunning,
  onTriggerMission,
  missionStatus
}: IncidentPanelProps) {
  const current = scenarios.find(s => s.id === selectedScenario) || scenarios[0];
  const isComplete = missionStatus === 'COMPLETE';

  return (
    <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/5 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                ACTIVE INFRASTRUCTURE ANOMALY
              </span>
              <span className="text-[10px] font-mono font-bold bg-red-950/80 text-red-300 border border-red-800 px-2 py-0.2 rounded">
                PRIORITY: HIGH
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Scenario Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 font-mono uppercase">Target Sector:</span>
          <div className="relative">
            <select
              value={selectedScenario}
              onChange={(e) => onSelectScenario(e.target.value)}
              disabled={isMissionRunning}
              className="appearance-none bg-[#12141f] border border-white/15 text-gray-200 text-xs rounded-lg pl-3 pr-8 py-1.5 font-mono focus:ring-1 focus:ring-cyan-400 focus:outline-none disabled:opacity-50 cursor-pointer"
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-[#0b0c12]">
                  {sc.id === 'BRIDGE_PIER' ? '🌟 [DEMO] ' : ''}{sc.name}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Hero Incident Dispatch Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Column (5 cols): Structure Identification & Physical Observations */}
        <div className="lg:col-span-5 bg-white/[0.02] p-4 rounded-xl border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono font-bold text-gray-400">
                Structure Classification
              </span>
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <MapPin size={11} /> {current?.location || 'San Mateo Bridge Span 14A'}
              </span>
            </div>

            <h2 className="text-lg font-black text-white font-mono tracking-tight">
              {current?.name?.replace(' (Recommended Demo)', '') || 'Bridge Pier P-04'}
            </h2>
            <div className="text-xs text-gray-300 font-mono mt-0.5">
              {current?.structure || 'Reinforced Concrete Pier Section (600×600mm)'}
            </div>

            {/* Observed damage tags */}
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="text-[10px] uppercase font-mono text-gray-400 font-bold mb-1.5">
                Physical Damage Observed
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['SURFACE SPALLING', 'HIGH MICROSTRAIN', 'SEISMIC GROUND ACCEL', 'ACOUSTIC EMISSIONS'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-800/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 text-[10px] text-gray-400 font-mono flex items-center justify-between pt-2 border-t border-white/5">
            <span>Status:</span>
            <span className={`font-bold ${isComplete ? 'text-emerald-400' : isMissionRunning ? 'text-cyan-400 animate-pulse' : 'text-amber-400'}`}>
              {isComplete ? '● RISK MITIGATED' : isMissionRunning ? '● AUTONOMOUS TRIAGE ACTIVE' : '● AWAITING AUTONOMOUS TRIAGE'}
            </span>
          </div>
        </div>

        {/* Middle Column (4 cols): Sensor Fusion Telemetry */}
        <div className="lg:col-span-4 bg-white/[0.02] p-4 rounded-xl border border-white/5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono font-bold text-gray-400">
                IoT Sensor Fusion Stream
              </span>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                <Radio size={10} className="animate-pulse" /> 3 CHANNELS LIVE
              </span>
            </div>

            <div className="space-y-2 mt-2 font-mono text-xs">
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-gray-400 text-[11px]">Piezoelectric Microstrain</span>
                <span className="text-amber-400 font-bold">2,140 με</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-gray-400 text-[11px]">Acoustic Emission</span>
                <span className="text-red-400 font-bold">84.5 dB (Active Cracking)</span>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-gray-400 text-[11px]">Seismic Ground Accel (PGA)</span>
                <span className="text-cyan-400 font-bold">0.42g</span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-[9px] text-gray-500 font-mono">
            Autonomous fleet reconciles sensor telemetry with non-linear fracture mechanics.
          </div>
        </div>

        {/* Right Column (3 cols): Command Action Hero Control */}
        <div className="lg:col-span-3 bg-gradient-to-b from-blue-950/30 to-[#0c0d14] p-4 rounded-xl border border-cyan-500/30 flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-cyan-400 mb-1">
              Autonomous Dispatch Control
            </div>
            <p className="text-[11px] text-gray-300 leading-snug">
              Triggers Gemini 2.5 Pro multi-turn reasoning with independent validation auditing and adaptive replanning.
            </p>
          </div>

          <div className="mt-4">
            <button
              onClick={onTriggerMission}
              disabled={isMissionRunning}
              className="w-full group relative flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] text-xs font-mono font-black tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isMissionRunning ? (
                <>
                  <Activity size={16} className="animate-spin" />
                  <span>SWARM ACTIVE...</span>
                </>
              ) : (
                <>
                  <Zap size={16} className="text-yellow-300 group-hover:animate-pulse" />
                  <span>⚡ INITIATE AUTONOMOUS TRIAGE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
