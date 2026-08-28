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
    <div className="apple-glass rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Top Banner: Incident Title + Sector Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.08] mb-6 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <span className="w-3 h-3 rounded-full bg-red-500 block animate-ping" />
            <span className="w-3 h-3 rounded-full bg-red-500 block absolute inset-0" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-red-500/15 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full">
                CRITICAL INFRASTRUCTURE DEFICIT
              </span>
              <span className="text-xs text-red-400 font-mono font-medium flex items-center gap-1">
                <Radio size={12} className="animate-pulse text-red-400" /> Live IoT Stream
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Bridge Pier P-04 • San Mateo Bridge Span 14A
            </h2>
          </div>
        </div>

        {/* Sector Switcher */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <span className="text-[11px] text-slate-400 uppercase font-mono font-medium">Target Sector:</span>
          <div className="relative">
            <select
              value={selectedScenario}
              onChange={(e) => onSelectScenario(e.target.value)}
              disabled={isMissionRunning}
              className="appearance-none bg-black/60 border border-white/20 hover:border-red-500/50 text-slate-200 text-xs rounded-xl pl-3.5 pr-8 py-2 focus:ring-1 focus:ring-red-500 focus:outline-none disabled:opacity-50 cursor-pointer transition-all font-mono"
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-[#0c0c10] text-white">
                  {sc.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Hero Telemetry Grid + Dominant CTA Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10 items-stretch">
        
        {/* Left 8 cols: 4 Telemetry Metrics */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          
          {/* Card 1: Microstrain */}
          <div className="apple-glass-card p-4 rounded-2xl flex flex-col justify-between hover:border-amber-500/40 transition-colors">
            <div className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider flex items-center justify-between">
              <span>MICROSTRAIN</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">
                {strainJitter.toLocaleString()} <span className="text-xs font-normal text-slate-400">με</span>
              </div>
              <div className="text-[10px] text-amber-300 font-mono font-bold mt-0.5">
                ● High Anomaly
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono pt-1.5 border-t border-white/[0.06]">
              Piezoelectric #S-14
            </div>
          </div>

          {/* Card 2: Acoustic Emission */}
          <div className="apple-glass-card p-4 rounded-2xl flex flex-col justify-between hover:border-red-500/40 transition-colors">
            <div className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider flex items-center justify-between">
              <span>ACOUSTIC EMISSION</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-black text-red-400 font-mono tracking-tight">
                {aeJitter} <span className="text-xs font-normal text-slate-400">dB</span>
              </div>
              <div className="text-[10px] text-red-300 font-mono font-bold mt-0.5">
                ● Active Cracking
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono pt-1.5 border-t border-white/[0.06]">
              Ultrasonic #A-02
            </div>
          </div>

          {/* Card 3: Peak Ground Acceleration */}
          <div className="apple-glass-card p-4 rounded-2xl flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
            <div className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider flex items-center justify-between">
              <span>GROUND ACCEL (PGA)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono tracking-tight">
                0.42 <span className="text-xs font-normal text-slate-400">g</span>
              </div>
              <div className="text-[10px] text-cyan-300 font-mono font-bold mt-0.5">
                ● Seismic Overload
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono pt-1.5 border-t border-white/[0.06]">
              Tri-axial Accel
            </div>
          </div>

          {/* Card 4: CURRENT SAFETY FACTOR */}
          <div className="bg-red-950/40 border border-red-500/60 p-4 rounded-2xl shadow-[0_4px_25px_rgba(239,68,68,0.2)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] text-red-300 font-mono uppercase font-bold tracking-wider">
              <span>SAFETY FACTOR</span>
              <span className="bg-red-500 text-black px-1.5 py-0.2 rounded font-black text-[9px]">
                CRITICAL
              </span>
            </div>
            <div className="my-2">
              <div className="text-3xl sm:text-4xl font-black text-red-400 font-mono tracking-tight">
                0.94
              </div>
              <div className="text-[10px] text-red-200 font-mono font-bold mt-0.5 flex items-center justify-between">
                <span>REQ: ≥ 1.50</span>
                <span className="text-red-400 font-black">DEFICIT: −0.56</span>
              </div>
            </div>
            <div className="text-[10px] text-red-300 font-sans font-medium pt-1.5 border-t border-red-500/30">
              Imminent flexural failure
            </div>
          </div>
        </div>

        {/* Right 4 cols: Dominant Apple CTA */}
        <div className="lg:col-span-4 apple-glass p-5 rounded-2xl border border-cyan-500/40 shadow-[0_0_35px_rgba(41,151,255,0.2)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={13} className="text-cyan-400" />
                Autonomous Command Control
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Swarm Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Triggers multi-agent triage: Gemini reasoning, deterministic mechanics, independent validation challenge, and adaptive replanning.
            </p>
          </div>

          <div className="mt-4">
            <button
              onClick={onTriggerMission}
              disabled={isMissionRunning}
              className="w-full group relative flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white rounded-xl shadow-[0_0_30px_rgba(41,151,255,0.4)] text-xs font-mono font-black tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isMissionRunning ? (
                <>
                  <Activity size={16} className="animate-spin text-cyan-200" />
                  <span>MISSION IN PROGRESS...</span>
                </>
              ) : isComplete ? (
                <>
                  <Zap size={16} className="text-emerald-300" />
                  <span>⚡ RE-TRIGGER TRIAGE SWARM</span>
                </>
              ) : (
                <>
                  <Zap size={16} className="text-yellow-300 group-hover:animate-pulse" />
                  <span>⚡ INITIATE AUTONOMOUS TRIAGE</span>
                </>
              )}
            </button>

            <div className="text-[10px] font-mono text-center text-slate-400 mt-2 flex items-center justify-center gap-2 flex-wrap">
              <span>5 Agents</span>
              <span>•</span>
              <span className="text-cyan-300">Gemini 2.5 Pro</span>
              <span>•</span>
              <span className="text-emerald-300">OpenSeesPy</span>
              <span>•</span>
              <span className="text-purple-300">Validation Gate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
