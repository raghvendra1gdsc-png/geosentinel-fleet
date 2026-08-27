import { Activity, ShieldCheck, RefreshCw, Wrench, AlertTriangle, CheckCircle, ArrowDown, ArrowUp } from 'lucide-react';
import type { MissionEvent, MissionState } from '../types/mission';

interface MissionGraphProps {
  activeAgent: string | null;
  events: MissionEvent[];
  stage: string;
  missionState: MissionState | null;
}

export function MissionGraph({ activeAgent, events, stage, missionState }: MissionGraphProps) {
  const isComplete = stage === 'COMPLETE';
  const isReplanning = stage === 'REPLANNING';
  const isValidation = stage === 'VALIDATION';

  // Check which agents have executed
  const commanderEvents = events.filter(e => e.agent === 'Commander');
  const structuralEvents = events.filter(e => e.agent === 'StructuralAgent');
  const simulationEvents = events.filter(e => e.agent === 'SimulationAgent');
  const retrofitEvents = events.filter(e => e.agent === 'RetrofitAgent');
  const validationEvents = events.filter(e => e.agent === 'ValidationAgent');

  // Check validation outcomes
  const hasValidationWarning = validationEvents.some(
    e => e.status === 'WARNING' || e.event_type === 'VALIDATION_FLAG' || e.message.toLowerCase().includes('reject') || e.message.toLowerCase().includes('insufficient')
  );
  const hasValidationPass = isComplete || validationEvents.some(
    e => e.status === 'PASSED' || e.message.toLowerCase().includes('passed') || e.message.toLowerCase().includes('meets target')
  );

  // Latest tools and elapsed for each agent
  const getAgentLatest = (agentEvents: MissionEvent[], agentId: string) => {
    const isActive = activeAgent === agentId;
    const lastEvent = agentEvents[agentEvents.length - 1];
    return {
      isActive,
      hasActed: agentEvents.length > 0,
      tool: lastEvent?.tool,
      message: lastEvent?.message,
      elapsed: lastEvent?.elapsed_seconds,
      count: agentEvents.length
    };
  };

  const cmdState = getAgentLatest(commanderEvents, 'Commander');
  const strState = getAgentLatest(structuralEvents, 'StructuralAgent');
  const simState = getAgentLatest(simulationEvents, 'SimulationAgent');
  const retState = getAgentLatest(retrofitEvents, 'RetrofitAgent');
  const valState = getAgentLatest(validationEvents, 'ValidationAgent');

  return (
    <div className="bg-[#0a0b10] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
              <span>Operational Swarm Topology & Control Graph</span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded font-mono">
                LIVE INTERACTIVE
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Dispatch
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Challenge
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Verified
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="relative py-2 px-2 flex flex-col items-center">
        {/* SVG connection lines layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="lineGradAmber" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>

        {/* ═════════ LEVEL 1: COMMANDER NODE ═════════ */}
        <div className="relative z-10 w-full max-w-md">
          <div
            className={`p-3.5 rounded-xl border transition-all duration-500 ${
              cmdState.isActive || isReplanning
                ? 'bg-blue-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400'
                : cmdState.hasActed
                ? 'bg-[#10121b] border-white/15 shadow-md'
                : 'bg-[#0e0f16] border-white/5 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold font-mono text-xs">
                  HQ
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono tracking-tight">COMMANDER AGENT</span>
                    <span className="text-[9px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.2 rounded">
                      Gemini 2.5 Pro
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">
                    {isReplanning
                      ? '⚡ ADAPTIVE REPLANNING TRIGGERED'
                      : cmdState.isActive
                      ? '● Formulating Investigation Hypothesis'
                      : 'Hypothesis Formulation & Strategic Triage'}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                {cmdState.isActive ? (
                  <span className="text-[10px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700 font-bold animate-pulse">
                    REASONING...
                  </span>
                ) : isReplanning ? (
                  <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700 font-bold animate-pulse">
                    REPLANNING
                  </span>
                ) : cmdState.hasActed ? (
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">
                    DISPATCHED
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-600">STANDBY</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Central Dispatch Branch Indicator */}
        <div className="w-full max-w-2xl flex items-center justify-center py-2 relative z-10">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/[0.03] border border-white/10 text-[9px] font-mono text-gray-400">
            <ArrowDown size={11} className={cmdState.hasActed ? "text-cyan-400 animate-bounce" : "text-gray-600"} />
            <span>Autonomous Specialist Delegation</span>
          </div>
        </div>

        {/* ═════════ LEVEL 2: SPECIALIST AGENT TRIO ═════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full relative z-10">
          {/* Node A: Structural Agent (ACI 318 Shear) */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 ${
              strState.isActive
                ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                : strState.hasActed
                ? 'bg-[#10121b] border-white/15'
                : 'bg-[#0e0f16] border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Activity size={14} className={strState.isActive ? "text-emerald-400 animate-pulse" : "text-emerald-500"} />
                <span className="text-[11px] font-bold text-gray-100 font-mono">STRUCTURAL</span>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                strState.isActive ? 'bg-emerald-950 text-emerald-300 border-emerald-700 animate-pulse' :
                strState.hasActed ? 'bg-white/[0.04] text-emerald-400 border-white/10' :
                'text-gray-600 border-transparent'
              }`}>
                {strState.isActive ? 'CALCULATING' : strState.hasActed ? 'DONE' : 'IDLE'}
              </span>
            </div>

            <div className="text-[10px] text-gray-400 font-mono">
              Tool: <span className="text-emerald-300">{strState.tool || 'calculate_shear_capacity'}</span>
            </div>
            <div className="text-[9px] text-gray-500 font-mono mt-1 pt-1 border-t border-white/5 flex justify-between">
              <span>ACI 318-19 Shear</span>
              {missionState?.shear_capacity_data && (
                <span className="text-emerald-400 font-bold">
                  SF: {missionState.shear_capacity_data.demand_capacity_ratio ? (1 / missionState.shear_capacity_data.demand_capacity_ratio).toFixed(2) : '1.54'}
                </span>
              )}
            </div>
          </div>

          {/* Node B: Simulation Agent (OpenSeesPy Pushover) */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 ${
              simState.isActive
                ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                : simState.hasActed
                ? 'bg-[#10121b] border-white/15'
                : 'bg-[#0e0f16] border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <RefreshCw size={14} className={simState.isActive ? "text-cyan-400 animate-spin" : "text-cyan-500"} />
                <span className="text-[11px] font-bold text-gray-100 font-mono">SIMULATION</span>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                simState.isActive ? 'bg-cyan-950 text-cyan-300 border-cyan-700 animate-pulse' :
                simState.hasActed ? 'bg-white/[0.04] text-cyan-400 border-white/10' :
                'text-gray-600 border-transparent'
              }`}>
                {simState.isActive ? 'FEA SOLVER' : simState.hasActed ? 'DONE' : 'IDLE'}
              </span>
            </div>

            <div className="text-[10px] text-gray-400 font-mono">
              Tool: <span className="text-cyan-300">{simState.tool || 'run_moment_curvature_analysis'}</span>
            </div>
            <div className="text-[9px] text-gray-500 font-mono mt-1 pt-1 border-t border-white/5 flex justify-between">
              <span>OpenSeesPy Fiber FEA</span>
              {missionState?.moment_curvature_data && (
                <span className="text-red-400 font-bold">
                  SF: {missionState.initial_safety_factor || '0.94'} [CRITICAL]
                </span>
              )}
            </div>
          </div>

          {/* Node C: Retrofit Agent (ACI 440.2R CFRP Wrap) */}
          <div
            className={`p-3 rounded-xl border transition-all duration-300 ${
              retState.isActive
                ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-1 ring-purple-400'
                : retState.hasActed
                ? 'bg-[#10121b] border-white/15'
                : 'bg-[#0e0f16] border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Wrench size={14} className={retState.isActive ? "text-purple-400 animate-pulse" : "text-purple-500"} />
                <span className="text-[11px] font-bold text-gray-100 font-mono">RETROFIT</span>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                retState.isActive ? 'bg-purple-950 text-purple-300 border-purple-700 animate-pulse' :
                retState.hasActed ? 'bg-white/[0.04] text-purple-400 border-white/10' :
                'text-gray-600 border-transparent'
              }`}>
                {retState.isActive ? 'OPTIMIZING' : retState.hasActed ? 'DONE' : 'IDLE'}
              </span>
            </div>

            <div className="text-[10px] text-gray-400 font-mono">
              Tool: <span className="text-purple-300">{retState.tool || 'optimize_cfrp_retrofit'}</span>
            </div>
            <div className="text-[9px] text-gray-500 font-mono mt-1 pt-1 border-t border-white/5 flex justify-between">
              <span>ACI 440.2R CFRP Jacket</span>
              {missionState?.retrofit_data && (
                <span className="text-emerald-400 font-bold">
                  {missionState.retrofit_data.required_cfrp_layers} Plies (SF {missionState.post_retrofit_safety_factor || '1.74'})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Central Convergence Indicator */}
        <div className="w-full max-w-2xl flex items-center justify-center py-2 relative z-10">
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/[0.03] border border-white/10 text-[9px] font-mono text-gray-400">
            <ArrowDown size={11} className={strState.hasActed || simState.hasActed ? "text-purple-400 animate-bounce" : "text-gray-600"} />
            <span>Deterministic Evidence Submission</span>
          </div>
        </div>

        {/* ═════════ LEVEL 3: VALIDATION AGENT NODE (THE SAFETY GATE) ═════════ */}
        <div className="relative z-10 w-full max-w-md">
          <div
            className={`p-3.5 rounded-xl border transition-all duration-500 ${
              valState.isActive || isValidation
                ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.35)] ring-1 ring-purple-400'
                : hasValidationWarning && !isComplete
                ? 'bg-amber-950/80 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.35)] ring-1 ring-amber-500'
                : hasValidationPass
                ? 'bg-emerald-950/40 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : valState.hasActed
                ? 'bg-[#10121b] border-white/15'
                : 'bg-[#0e0f16] border-white/5 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-xs border ${
                  hasValidationWarning && !isComplete
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : hasValidationPass
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                }`}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono tracking-tight">
                      VALIDATION AGENT
                    </span>
                    <span className="text-[9px] font-mono bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded">
                      Independent Safety Gate
                    </span>
                  </div>
                  <div className="text-[10px] font-mono">
                    {hasValidationWarning && !isComplete ? (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <AlertTriangle size={11} /> ⚠ EVIDENCE INSUFFICIENT • OBJECTION RAISED
                      </span>
                    ) : hasValidationPass ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle size={11} /> ✓ EVIDENCE AUDITED • SF ≥ 1.50 VERIFIED
                      </span>
                    ) : (
                      <span className="text-gray-400">Audits Physics vs Physical Sensor Telemetry</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                {valState.isActive ? (
                  <span className="text-[10px] text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-700 font-bold animate-pulse">
                    AUDITING
                  </span>
                ) : hasValidationWarning && !isComplete ? (
                  <span className="text-[10px] text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-700 font-bold animate-pulse">
                    REJECTED
                  </span>
                ) : hasValidationPass ? (
                  <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700 font-bold">
                    APPROVED
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-600">STANDBY</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═════════ HERO REPLANNING LOOPBACK & BRANCHING PATHS ═════════ */}
        {hasValidationWarning && !isComplete && (
          <div className="w-full max-w-md mt-3 pt-3 border-t border-amber-500/30 bg-amber-950/30 p-3 rounded-xl border border-amber-800/60 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUp size={14} className="text-amber-400 animate-bounce" />
                <span className="text-[11px] font-mono font-bold text-amber-300">
                  AUTONOMOUS REPLANNING LOOP: VALIDATION → COMMANDER
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-900/80 text-amber-200 border border-amber-600 font-bold">
                NON-LINEAR PIVOT
              </span>
            </div>
            <p className="text-[10px] text-amber-200/90 font-mono mt-1">
              Shear capacity passed (SF 1.54), but physical cracking contradicts safety. Commander triggers fiber-section FEA to uncover true flexural plastic hinge mode.
            </p>
          </div>
        )}

        {/* Level 4: Final Pass State */}
        {hasValidationPass && (
          <div className="w-full max-w-md mt-3 pt-3 border-t border-emerald-500/30 bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-400" />
                <span className="text-[11px] font-mono font-bold text-emerald-300">
                  VERIFIED CLOSURE → EXECUTIVE DIRECTIVE
                </span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-600 font-bold">
                SF {missionState?.post_retrofit_safety_factor || '1.74'} ≥ 1.50
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
