import { Terminal, Brain, Target, ShieldCheck, ChevronDown, ChevronRight, Wrench, RefreshCw, Activity } from 'lucide-react';
import type { MissionEvent } from '../types/mission';
import { useEffect, useRef, useState } from 'react';

interface AgentTimelineProps {
  events: MissionEvent[];
}

export function AgentTimeline({ events }: AgentTimelineProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getAgentBadge = (agent: string) => {
    switch (agent) {
      case 'Commander':
        return { color: 'text-blue-400 bg-blue-950/70 border-blue-800', icon: Brain, label: 'COMMANDER' };
      case 'StructuralAgent':
        return { color: 'text-emerald-400 bg-emerald-950/70 border-emerald-800', icon: Activity, label: 'STRUCTURAL' };
      case 'SimulationAgent':
        return { color: 'text-cyan-400 bg-cyan-950/70 border-cyan-800', icon: RefreshCw, label: 'SIMULATION' };
      case 'RetrofitAgent':
        return { color: 'text-purple-400 bg-purple-950/70 border-purple-800', icon: Wrench, label: 'RETROFIT' };
      case 'ValidationAgent':
        return { color: 'text-amber-400 bg-amber-950/70 border-amber-800', icon: ShieldCheck, label: 'VALIDATION' };
      default:
        return { color: 'text-gray-400 bg-gray-900 border-gray-700', icon: Target, label: agent };
    }
  };

  return (
    <div className="bg-[#0b0c12] border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[560px] relative overflow-hidden">
      {/* Terminal Title Bar */}
      <div className="p-3.5 border-b border-white/5 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <div className="h-3.5 w-px bg-white/10 mx-1" />
          <Terminal size={14} className="text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-200">
            Live Swarm Operational Console
          </h3>
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
          {events.length > 0 && (
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> STREAMING
            </span>
          )}
          <span>{events.length} LOGS</span>
        </div>
      </div>

      {/* Terminal Content Stream */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2 font-mono text-xs">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 relative">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-3 text-cyan-400">
              <Terminal size={20} />
            </div>
            <div className="text-xs font-bold text-gray-300 font-mono">SYSTEM READY • AWAITING TRIGGER</div>
            <p className="text-[11px] text-gray-500 max-w-xs font-sans mt-1">
              Click &quot;⚡ INITIATE AUTONOMOUS TRIAGE&quot; to begin live multi-agent reasoning, physics execution, and validation checks.
            </p>

            <div className="mt-4 p-2.5 rounded-lg bg-black/40 border border-white/5 text-left text-[10px] text-gray-500 space-y-1 w-full max-w-xs">
              <div className="text-gray-400 font-bold">EXPECTED SWARM CADENCE:</div>
              <div>00:00.0 COMMANDER → Classification & Dispatch</div>
              <div>00:01.8 STRUCTURAL → ACI 318 Shear Capacity</div>
              <div>00:03.2 VALIDATION → Objection (Shear Inconclusive)</div>
              <div>00:04.5 COMMANDER → Replan: OpenSeesPy FEA</div>
              <div>00:06.8 RETROFIT → 3-Ply CFRP Composite Design</div>
              <div>00:08.4 VALIDATION → Final Safety Verified (SF ≥ 1.50)</div>
            </div>
          </div>
        ) : (
          events.map((event, idx) => {
            const badge = getAgentBadge(event.agent);
            const isExpanded = !!expandedItems[event.event_id || idx.toString()];
            const hasData = event.tool_input || event.tool_output;

            const isWarning = event.status === 'WARNING' || event.event_type === 'VALIDATION_FLAG';
            const isReplan = event.event_type === 'REPLANNING';
            const isComplete = event.stage === 'COMPLETE';

            const timeStr = event.elapsed_seconds !== undefined
              ? `+${event.elapsed_seconds.toFixed(1)}s`
              : (event.timestamp ? event.timestamp.split('T')[1]?.substring(0, 8) : `+${idx * 1.2}s`);

            return (
              <div
                key={event.event_id || idx}
                className={`p-2.5 rounded-xl border transition-all duration-200 ${
                  isWarning
                    ? 'bg-amber-950/30 border-amber-600/80 text-amber-200'
                    : isReplan
                    ? 'bg-orange-950/30 border-orange-500/80 text-orange-200'
                    : isComplete
                    ? 'bg-emerald-950/30 border-emerald-600/80 text-emerald-200'
                    : 'bg-black/30 border-white/5 hover:border-white/15 text-gray-200'
                }`}
              >
                {/* Event Top Line */}
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-mono">{timeStr}</span>
                    <span className={`px-1.5 py-0.2 rounded border font-bold ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-gray-500 font-mono">
                      [{event.stage}]
                    </span>
                  </div>

                  {event.tool && (
                    <span className="text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1.5 py-0.2 rounded font-mono">
                      tool: {event.tool}
                    </span>
                  )}
                </div>

                {/* Event Message */}
                <div className={`text-xs leading-relaxed ${
                  isWarning ? 'font-semibold text-amber-300' :
                  isReplan ? 'font-semibold text-orange-300' :
                  isComplete ? 'font-semibold text-emerald-300' :
                  'text-gray-300 font-mono'
                }`}>
                  {isWarning && <span className="text-amber-400 mr-1 font-bold">[OBJECTION]</span>}
                  {isReplan && <span className="text-orange-400 mr-1 font-bold">[REPLAN]</span>}
                  {isComplete && <span className="text-emerald-400 mr-1 font-bold">[VERIFIED]</span>}
                  {event.message}
                </div>

                {/* Expandable JSON Data */}
                {hasData && (
                  <div className="mt-2 pt-1.5 border-t border-white/5">
                    <button
                      onClick={() => toggleExpand(event.event_id || idx.toString())}
                      className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-cyan-300 transition-colors"
                    >
                      {isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                      <span>{isExpanded ? 'Hide Deterministic Physics Data' : 'Inspect Physics Payload (JSON)'}</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-1.5 bg-[#07080c] p-2.5 rounded-lg border border-white/10 text-[10px] text-gray-300 overflow-x-auto max-h-48 font-mono">
                        {event.tool_input && (
                          <div className="mb-2">
                            <span className="text-cyan-400 font-bold block mb-0.5">// TOOL INPUT:</span>
                            <pre>{JSON.stringify(event.tool_input, null, 2)}</pre>
                          </div>
                        )}
                        {event.tool_output && (
                          <div>
                            <span className="text-emerald-400 font-bold block mb-0.5">// DETERMINISTIC OUTPUT:</span>
                            <pre>{JSON.stringify(event.tool_output, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
