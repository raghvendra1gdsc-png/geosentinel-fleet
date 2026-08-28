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
    },
    {
      id: 'StructuralAgent',
      name: 'Structural Agent',
      shortRole: 'CONCRETE MECHANICS',
      engine: 'NumPy ACI 318-19 / ASCE 41',
      icon: Activity,
    },
    {
      id: 'SimulationAgent',
      name: 'Simulation Agent',
      shortRole: 'FIBER FEA SOLVER',
      engine: 'OpenSeesPy v3.8 Engine',
      icon: RefreshCw,
    },
    {
      id: 'RetrofitAgent',
      name: 'Retrofit Agent',
      shortRole: 'CFRP DESIGN OPTIMIZER',
      engine: 'ACI 440.2R Solver',
      icon: Wrench,
    },
    {
      id: 'ValidationAgent',
      name: 'Validation Agent',
      shortRole: 'INDEPENDENT AUDITOR',
      engine: 'Isolated Safety Gate',
      icon: ShieldCheck,
    },
  ];

  const hasChallenge = events.some(
    e => e.event_type === 'VALIDATION_FLAG' || e.status === 'WARNING' || e.message.toLowerCase().includes('reject') || e.message.toLowerCase().includes('insufficient')
  );

  return (
    <div className="apple-glass rounded-3xl p-6 shadow-2xl relative overflow-hidden" data-fleet-container>
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Autonomous Specialist Fleet Status
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Mission Phase:</span>
          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] font-mono border ${
            stage === 'COMPLETE' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' :
            stage === 'REPLANNING' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse' :
            stage === 'VALIDATION' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' :
            stage === 'EXECUTION' ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' :
            'bg-white/[0.03] text-slate-500 border-white/5'
          }`}>
            {stage}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative">
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

          const toolCall = lastEvent?.tool;
          const elapsed = lastEvent?.elapsed_seconds ? `+${lastEvent.elapsed_seconds.toFixed(1)}s` : '—';

          const agentColor = getAgentColor(agent.id);

          return (
            <motion.div
              key={agent.id}
              data-agent-id={agent.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              animate={isCommanderReceivingChallenge ? {
                boxShadow: [
                  '0 0 0px rgba(41, 151, 255, 0)',
                  '0 0 30px rgba(41, 151, 255, 0.6)',
                  '0 0 0px rgba(41, 151, 255, 0)',
                ],
              } : undefined}
              // @ts-ignore
              {...(isCommanderReceivingChallenge ? {
                transition: { boxShadow: { duration: 1.2, repeat: 2, ease: 'easeInOut' }, delay: index * 0.05, duration: 0.3 }
              } : {})}
              className={`p-4 rounded-2xl border-l-[3px] border transition-all duration-300 relative flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-500/15 border-cyan-400 shadow-[0_0_20px_rgba(41,151,255,0.25)] ring-1 ring-cyan-400/60 scale-[1.02]'
                  : isValidationChallenge && !isComplete
                  ? 'bg-amber-500/10 border-amber-500/60 shadow-[0_0_20px_rgba(255,159,10,0.15)]'
                  : hasActed
                  ? 'apple-glass-card'
                  : 'bg-white/[0.02] border-white/[0.06] opacity-60'
              }`}
              style={{
                borderLeftColor: agentColor.hex,
                boxShadow: isCommanderReceivingChallenge ? undefined : agentColor.glowShadow,
              }}
            >
              <div>
                {/* Card Top: Icon + Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl ${
                    isActive ? 'bg-cyan-500/20 text-cyan-400' :
                    isValidationChallenge && !isComplete ? 'bg-amber-500/20 text-amber-400' :
                    hasActed ? 'bg-white/[0.04] text-slate-300' :
                    'bg-white/[0.02] text-slate-600'
                  }`}>
                    <agent.icon size={16} className={isActive ? 'animate-spin-slow' : ''} />
                  </div>

                  {/* Status badge */}
                  {isActive ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-700 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" /> Active
                    </span>
                  ) : isValidationChallenge && !isComplete ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-700">
                      <AlertTriangle size={10} /> Challenge
                    </span>
                  ) : isComplete ? (
                    <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                      <CheckCircle2 size={10} /> Verified
                    </span>
                  ) : hasActed ? (
                    <span className="text-[10px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-full">
                      Standby
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-600">
                      Idle
                    </span>
                  )}
                </div>

                {/* Name & Role */}
                <div className="font-bold text-sm text-white tracking-tight">{agent.name}</div>
                <div className="text-[10px] text-cyan-400 font-mono font-semibold uppercase mt-0.5">{agent.shortRole}</div>
                <div className="text-[10px] text-slate-400 font-sans mt-1">{agent.engine}</div>
              </div>

              {/* Card Bottom: Tool execution & Elapsed */}
              <div className="mt-4 pt-2.5 border-t border-white/[0.06] font-mono text-[10px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Tool Execution:</span>
                  <span className="text-slate-400">{elapsed}</span>
                </div>
                <div className="truncate text-slate-200 font-semibold mt-0.5" title={toolCall || (isActive ? 'Reasoning...' : 'Awaiting dispatch')}>
                  {toolCall ? `tool: ${toolCall}` : isActive ? 'Gemini 2.5 Reasoning' : '—'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
