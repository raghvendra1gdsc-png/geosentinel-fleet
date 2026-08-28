import { Activity, ShieldCheck, Cpu, Wrench, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MissionEvent } from '../types/mission';
import { getAgentColor } from '../utils/agentColors';
import { ChallengeConnector } from './ChallengeConnector';

interface AgentFleetProps {
  activeAgent: string | null;
  events: MissionEvent[];
  stage: string;
}

export function AgentFleet({ activeAgent, events, stage }: AgentFleetProps) {
  const agents = [
    {
      id: 'Commander',
      name: 'Commander Agent',
      shortRole: 'SWARM COORDINATOR',
      engine: 'Google Gemini 2.5 Pro',
      icon: Cpu,
      color: 'blue'
    },
    {
      id: 'StructuralAgent',
      name: 'Structural Agent',
      shortRole: 'CONCRETE MECHANICS',
      engine: 'NumPy ACI 318-19 / ASCE 41',
      icon: Activity,
      color: 'emerald'
    },
    {
      id: 'SimulationAgent',
      name: 'Simulation Agent',
      shortRole: 'FIBER FEA SOLVER',
      engine: 'OpenSeesPy v3.8 Engine',
      icon: RefreshCw,
      color: 'cyan'
    },
    {
      id: 'RetrofitAgent',
      name: 'Retrofit Agent',
      shortRole: 'CFRP DESIGN OPTIMIZER',
      engine: 'ACI 440.2R Solver',
      icon: Wrench,
      color: 'purple'
    },
    {
      id: 'ValidationAgent',
      name: 'Validation Agent',
      shortRole: 'INDEPENDENT AUDITOR',
      engine: 'Isolated Safety Gate',
      icon: ShieldCheck,
      color: 'amber'
    },
  ];

  const hasChallenge = events.some(
    e => e.event_type === 'VALIDATION_FLAG' || e.status === 'WARNING' || e.message.toLowerCase().includes('reject') || e.message.toLowerCase().includes('insufficient')
  );

  return (
    <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden" data-fleet-container>
      <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-200">
            Autonomous Specialist Fleet Status
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-gray-500">Mission Phase:</span>
          <span className={`px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] font-mono border ${
            stage === 'COMPLETE' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700' :
            stage === 'REPLANNING' ? 'bg-amber-950/80 text-amber-300 border-amber-700 animate-pulse' :
            stage === 'VALIDATION' ? 'bg-purple-950/80 text-purple-300 border-purple-700' :
            stage === 'EXECUTION' ? 'bg-blue-950/80 text-blue-300 border-blue-700' :
            'bg-white/[0.03] text-gray-500 border-white/5'
          }`}>
            {stage}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {/* Challenge connector arrow overlay */}
        <ChallengeConnector stage={stage} hasChallenge={hasChallenge} />

        {agents.map((agent, index) => {
          const isActive = activeAgent === agent.id;
          const agentEvents = events.filter(e => e.agent === agent.id);
          const hasActed = agentEvents.length > 0;
          const lastEvent = agentEvents[agentEvents.length - 1];

          const isValidationChallenge = agent.id === 'ValidationAgent' && agentEvents.some(
            e => e.status === 'WARNING' || e.event_type === 'VALIDATION_FLAG' || e.message.toLowerCase().includes('reject') || e.message.toLowerCase().includes('insufficient')
          );

          const isComplete = stage === 'COMPLETE' && hasActed;

          // Commander pulse when receiving challenge
          const isCommanderReceivingChallenge = agent.id === 'Commander' && (stage === 'REPLANNING' || stage === 'VALIDATION') && hasChallenge;

          // Elapsed and tool
          const toolCall = lastEvent?.tool;
          const elapsed = lastEvent?.elapsed_seconds ? `+${lastEvent.elapsed_seconds.toFixed(1)}s` : '—';

          // Agent accent color for border + glow
          const agentColor = getAgentColor(agent.id);

          return (
            <motion.div
              key={agent.id}
              data-agent-id={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07, duration: 0.35 }}
              animate={isCommanderReceivingChallenge ? {
                boxShadow: [
                  '0 0 0px rgba(59, 130, 246, 0)',
                  '0 0 30px rgba(59, 130, 246, 0.6)',
                  '0 0 0px rgba(59, 130, 246, 0)',
                ],
              } : undefined}
              // @ts-ignore - framer-motion transition for animate keyframes
              {...(isCommanderReceivingChallenge ? {
                transition: { boxShadow: { duration: 1.2, repeat: 2, ease: 'easeInOut' }, delay: index * 0.07, duration: 0.35 }
              } : {})}
              className={`p-3.5 rounded-xl border-l-[3px] border transition-all duration-300 relative flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/60 scale-[1.02]'
                  : isValidationChallenge && !isComplete
                  ? 'bg-amber-950/30 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : hasActed
                  ? 'bg-[#10121b] border-white/10'
                  : 'bg-[#0e0f16] border-white/5 opacity-60'
              }`}
              style={{
                borderLeftColor: agentColor.hex,
                boxShadow: isCommanderReceivingChallenge ? undefined : agentColor.glowShadow,
              }}
            >
              <div>
                {/* Card Top: Icon + Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${
                    isActive ? 'bg-cyan-500/20 text-cyan-400' :
                    isValidationChallenge && !isComplete ? 'bg-amber-500/20 text-amber-400' :
                    hasActed ? 'bg-white/[0.04] text-gray-300' :
                    'bg-white/[0.02] text-gray-600'
                  }`}>
                    <agent.icon size={16} className={isActive ? 'animate-spin-slow' : ''} />
                  </div>

                  {/* Status badge */}
                  {isActive ? (
                    <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-700 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> PROCESSING
                    </span>
                  ) : isValidationChallenge && !isComplete ? (
                    <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-amber-300 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-700">
                      <AlertTriangle size={10} /> CHALLENGE
                    </span>
                  ) : isComplete ? (
                    <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                      <CheckCircle2 size={10} /> COMPLETE
                    </span>
                  ) : hasActed ? (
                    <span className="text-[9px] font-mono text-gray-400 bg-white/[0.04] px-1.5 py-0.5 rounded">
                      STANDBY
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-gray-600">
                      IDLE
                    </span>
                  )}
                </div>

                {/* Name & Role */}
                <div className="font-bold text-xs text-gray-100 font-mono tracking-tight">{agent.name}</div>
                <div className="text-[9px] text-cyan-400/90 font-mono font-semibold uppercase">{agent.shortRole}</div>
                <div className="text-[9px] text-gray-500 font-mono mt-1">{agent.engine}</div>
              </div>

              {/* Card Bottom: Tool execution & Elapsed */}
              <div className="mt-3 pt-2 border-t border-white/5 font-mono text-[9px]">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Action / Tool:</span>
                  <span className="text-gray-500">{elapsed}</span>
                </div>
                <div className="truncate text-gray-300 font-semibold mt-0.5" title={toolCall || (isActive ? 'Reasoning...' : 'Awaiting dispatch')}>
                  {toolCall ? `tool: ${toolCall}` : isActive ? 'Gemini 2.5 Multi-turn' : '—'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
