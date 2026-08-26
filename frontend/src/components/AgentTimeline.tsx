import { Terminal, Brain, Target, ShieldCheck, AlertTriangle, ChevronDown, ChevronRight, Wrench, RefreshCw, Activity } from 'lucide-react';
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
        return { color: 'text-blue-400 bg-blue-950/60 border-blue-800', icon: Brain };
      case 'StructuralAgent':
        return { color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800', icon: Activity };
      case 'SimulationAgent':
        return { color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800', icon: RefreshCw };
      case 'RetrofitAgent':
        return { color: 'text-amber-400 bg-amber-950/60 border-amber-800', icon: Wrench };
      case 'ValidationAgent':
        return { color: 'text-purple-400 bg-purple-950/60 border-purple-800', icon: ShieldCheck };
      default:
        return { color: 'text-gray-400 bg-gray-900 border-gray-700', icon: Target };
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-surfaceHighlight shadow-xl flex flex-col h-[520px]">
      <div className="p-4 border-b border-surfaceHighlight bg-surfaceHighlight/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-primary" />
          <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
            Live Swarm Activity Stream
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
          <span>{events.length} EVENTS RECORDED</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm gap-2">
            <Terminal size={24} className="text-gray-600 animate-pulse" />
            <p>Awaiting incident trigger to deploy fleet...</p>
          </div>
        ) : (
          events.map((event, idx) => {
            const badge = getAgentBadge(event.agent);
            const Icon = badge.icon;
            const isExpanded = !!expandedItems[event.event_id || idx.toString()];
            const hasData = event.tool_input || event.tool_output;

            const isWarning = event.status === 'WARNING' || event.event_type === 'VALIDATION_FLAG';
            const isReplan = event.event_type === 'REPLANNING';
            const isComplete = event.stage === 'COMPLETE';

            return (
              <div
                key={event.event_id || idx}
                className={`flex gap-3.5 text-xs transition-all duration-200 animate-in fade-in slide-in-from-bottom-1`}
              >
                {/* Elapsed Time offset */}
                <div className="w-14 shrink-0 text-[10px] text-gray-500 pt-1 text-right font-mono">
                  +{event.elapsed_seconds?.toFixed(1) || '0.0'}s
                </div>

                {/* Timeline node icon */}
                <div className="relative flex flex-col items-center">
                  <div className="w-px h-full bg-gray-800 absolute top-6" />
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center z-10 border shadow-sm ${
                      isWarning
                        ? 'bg-amber-950 text-amber-400 border-amber-700 ring-2 ring-amber-500/20'
                        : isReplan
                        ? 'bg-orange-950 text-orange-400 border-orange-700 animate-bounce'
                        : isComplete
                        ? 'bg-green-950 text-green-400 border-green-700 ring-2 ring-green-500/30'
                        : 'bg-surfaceHighlight text-gray-300 border-gray-700'
                    }`}
                  >
                    {isWarning ? <AlertTriangle size={12} /> : <Icon size={12} />}
                  </div>
                </div>

                {/* Event body card */}
                <div className="flex-1 pb-2">
                  <div
                    className={`p-3.5 rounded-xl border transition-all ${
                      isWarning
                        ? 'bg-amber-950/20 border-amber-800/60 shadow-[0_0_15px_rgba(245,158,11,0.08)]'
                        : isReplan
                        ? 'bg-orange-950/25 border-orange-700/60 shadow-[0_0_15px_rgba(249,115,22,0.1)]'
                        : isComplete
                        ? 'bg-green-950/20 border-green-800/60'
                        : 'bg-surfaceHighlight/50 border-surfaceHighlight hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border font-mono ${badge.color}`}>
                          {event.agent}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">
                          {event.stage} • {event.event_type}
                        </span>
                      </div>
                      {event.tool && (
                        <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                          tool: {event.tool}
                        </span>
                      )}
                    </div>

                    <div className={`text-xs leading-relaxed ${isWarning ? 'text-amber-200 font-medium' : isReplan ? 'text-orange-200 font-semibold' : 'text-gray-200'}`}>
                      {event.message}
                    </div>

                    {/* Expandable tool inputs / outputs */}
                    {hasData && (
                      <div className="mt-2.5 pt-2 border-t border-gray-800/70">
                        <button
                          onClick={() => toggleExpand(event.event_id || idx.toString())}
                          className="flex items-center gap-1 text-[10px] font-mono text-gray-400 hover:text-gray-200 transition-colors"
                        >
                          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          <span>{isExpanded ? 'Hide Physics Payload' : 'Inspect Tool Data Payload (JSON)'}</span>
                        </button>

                        {isExpanded && (
                          <div className="mt-2 bg-[#09090b] p-3 rounded-lg border border-gray-800 text-[10px] font-mono text-gray-300 overflow-x-auto max-h-56">
                            {event.tool_input && (
                              <div className="mb-2">
                                <span className="text-gray-500 font-bold block mb-1">INPUT PARAMETERS:</span>
                                <pre>{JSON.stringify(event.tool_input, null, 2)}</pre>
                              </div>
                            )}
                            {event.tool_output && (
                              <div>
                                <span className="text-green-500 font-bold block mb-1">DETERMINISTIC OUTPUT:</span>
                                <pre>{JSON.stringify(event.tool_output, null, 2)}</pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
