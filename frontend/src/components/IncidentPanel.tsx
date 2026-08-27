import { useState, useEffect } from 'react';
import { Radio, ChevronDown, ShieldAlert, Activity, Zap } from 'lucide-react';
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
  const isComplete = missionStatus === 'COMPLETE';

  // Live telemetry oscillation to simulate active IoT stream
  const [strainJitter, setStrainJitter] = useState<number>(2140);
  const [aeJitter, setAeJitter] = useState<number>(84.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setStrainJitter(2140 + Math.floor(Math.random() * 18 - 9));
      setAeJitter(Number((84.5 + (Math.random() * 1.2 - 0.6)).toFixed(1)));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0b0c12] border-2 border-red-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.2)] relative overflow-hidden font-mono">
      {/* Background ambient red glow for active emergency */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 blur-[140px] pointer-events-none" />

      {/* Top Banner: Incident Title + Sector Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/10 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500 block animate-ping" />
            <span className="w-3.5 h-3.5 rounded-full bg-red-500 block absolute inset-0" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-black uppercase tracking-widest bg-red-500 text-black px-2.5 py-0.5 rounded-full shadow-sm">
                CRITICAL INFRASTRUCTURE DEFICIT
              </span>
              <span className="text-xs text-red-400 font-bold flex items-center gap-1">
                <Radio size={12} className="animate-pulse text-red-400" /> LIVE IOT TELEMETRY FEED
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1">
              BRIDGE PIER P-04 • SAN MATEO BRIDGE • SPAN 14A
            </h2>
          </div>
        </div>

        {/* Sector Switcher */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
          <span className="text-[10px] text-gray-400 uppercase font-bold">TARGET SECTOR:</span>
          <div className="relative">
            <select
              value={selectedScenario}
              onChange={(e) => onSelectScenario(e.target.value)}
              disabled={isMissionRunning}
              className="appearance-none bg-[#141624] border border-white/20 hover:border-red-500/60 text-gray-200 text-xs rounded-lg pl-3 pr-8 py-1.5 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:opacity-50 cursor-pointer transition-colors"
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-[#0b0c12]">
                  {sc.name}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Hero Telemetry + Major CTA Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10 items-stretch">
        
        {/* Left 8 cols: 4 Large Telemetry Values */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          
          {/* Card 1: Microstrain */}
          <div className="bg-black/60 p-4 rounded-xl border border-white/10 flex flex-col justify-between hover:border-amber-500/50 transition-colors">
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>MICROSTRAIN</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <div className="my-2">
              <div className="text-2xl md:text-3xl font-black text-amber-400 tracking-tight">
                {strainJitter.toLocaleString()} <span className="text-xs font-normal text-gray-400">με</span>
              </div>
              <div className="text-[10px] text-amber-300 font-bold mt-0.5">
                ● HIGH ANOMALY
              </div>
            </div>
            <div className="text-[9px] text-gray-500 pt-1.5 border-t border-white/5">
              Piezoelectric sensor #S-14
            </div>
          </div>

          {/* Card 2: Acoustic Emission */}
          <div className="bg-black/60 p-4 rounded-xl border border-white/10 flex flex-col justify-between hover:border-red-500/50 transition-colors">
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>ACOUSTIC EMISSION</span>
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            </div>
            <div className="my-2">
              <div className="text-2xl md:text-3xl font-black text-red-400 tracking-tight">
                {aeJitter} <span className="text-xs font-normal text-gray-400">dB</span>
              </div>
              <div className="text-[10px] text-red-300 font-bold mt-0.5">
                ● ACTIVE CRACKING
              </div>
            </div>
            <div className="text-[9px] text-gray-500 pt-1.5 border-t border-white/5">
              Ultrasonic wave sensor #A-02
            </div>
          </div>

          {/* Card 3: Peak Ground Acceleration */}
          <div className="bg-black/60 p-4 rounded-xl border border-white/10 flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center justify-between">
              <span>GROUND ACCEL (PGA)</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div className="my-2">
              <div className="text-2xl md:text-3xl font-black text-cyan-400 tracking-tight">
                0.42 <span className="text-xs font-normal text-gray-400">g</span>
              </div>
              <div className="text-[10px] text-cyan-300 font-bold mt-0.5">
                ● SEISMIC OVERLOAD
              </div>
            </div>
            <div className="text-[9px] text-gray-500 pt-1.5 border-t border-white/5">
              Tri-axial accelerometer
            </div>
          </div>

          {/* Card 4: CURRENT SAFETY FACTOR (HERO CRITICAL) */}
          <div className="bg-red-950/60 p-4 rounded-xl border-2 border-red-500/90 shadow-[0_0_25px_rgba(239,68,68,0.3)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] text-red-300 uppercase font-black tracking-wider">
              <span>SAFETY FACTOR</span>
              <span className="bg-red-500 text-black px-1.5 py-0.2 rounded font-bold text-[9px]">
                CRITICAL
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl md:text-4xl font-black text-red-400 tracking-tight">
                0.94
              </div>
              <div className="text-[10px] text-red-200 font-bold mt-0.5 flex items-center justify-between">
                <span>REQ: ≥ 1.50</span>
                <span className="text-red-400 font-black">DEFICIT: −0.56</span>
              </div>
            </div>
            <div className="text-[9px] text-red-300 font-bold pt-1.5 border-t border-red-500/30">
              Imminent flexural failure
            </div>
          </div>
        </div>

        {/* Right 4 cols: Unmistakable Dominant CTA */}
        <div className="lg:col-span-4 bg-gradient-to-b from-blue-950/70 via-[#101322] to-[#0b0c12] p-5 rounded-xl border-2 border-cyan-500/70 shadow-[0_0_35px_rgba(6,182,212,0.35)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-black text-cyan-400 tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={13} className="text-cyan-400" />
                AUTONOMOUS COMMAND CONTROL
              </span>
              <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> SWARM READY
              </span>
            </div>
            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Triggers autonomous multi-agent triage: Gemini reasoning, deterministic mechanics, independent validation challenge, and adaptive replanning.
            </p>
          </div>

          <div className="mt-4">
            <button
              onClick={onTriggerMission}
              disabled={isMissionRunning}
              className="w-full group relative flex items-center justify-center gap-2 px-5 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-[0_0_35px_rgba(6,182,212,0.5)] text-sm font-black tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isMissionRunning ? (
                <>
                  <Activity size={18} className="animate-spin text-cyan-200" />
                  <span>MISSION IN PROGRESS...</span>
                </>
              ) : isComplete ? (
                <>
                  <Zap size={18} className="text-emerald-300" />
                  <span>⚡ RE-TRIGGER TRIAGE SWARM</span>
                </>
              ) : (
                <>
                  <Zap size={18} className="text-yellow-300 group-hover:animate-pulse" />
                  <span>⚡ INITIATE AUTONOMOUS TRIAGE</span>
                </>
              )}
            </button>

            <div className="text-[9px] text-center text-gray-400 mt-2 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-white font-bold">5 SPECIALIST AGENTS</span>
              <span>•</span>
              <span className="text-cyan-300 font-bold">GEMINI REASONING</span>
              <span>•</span>
              <span className="text-emerald-300 font-bold">DETERMINISTIC PHYSICS</span>
              <span>•</span>
              <span className="text-purple-300 font-bold">INDEPENDENT VALIDATION</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
