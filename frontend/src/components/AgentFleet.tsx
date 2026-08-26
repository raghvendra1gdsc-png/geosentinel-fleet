import { Activity, ShieldCheck, Cpu, Wrench, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { MissionEvent } from '../types/mission';

interface AgentFleetProps {
  activeAgent: string | null;
  events: MissionEvent[];
  stage: string;
}

export function AgentFleet({ activeAgent, events, stage }: AgentFleetProps) {
  const agents = [
    {
      id: 'Commander',
      name: 'Commander',
      icon: Cpu,
      role: 'Autonomous Coordinator',
      engine: 'Google Gemini 2.5 Pro',
      desc: 'Formulates hypotheses & replans triage strategy'
    },
    {
      id: 'StructuralAgent',
      name: 'Structural Agent',
      icon: Activity,
      role: 'Concrete Mechanics',
      engine: 'NumPy Mechanics (ACI 318 / ASCE 41)',
      desc: 'Computes shear capacity & section ductility'
    },
    {
      id: 'SimulationAgent',
      name: 'Simulation Agent',
      icon: RefreshCw,
      role: 'FEA Pushover Sandbox',
      engine: 'OpenSeesPy v3.8 Fiber Engine',
      desc: 'Executes nonlinear pushover modeling'
    },
    {
      id: 'RetrofitAgent',
      name: 'Retrofit Agent',
      icon: Wrench,
      role: 'CFRP Composite Design',
      engine: 'ACI 440.2R Optimizer',
      desc: 'Calculates carbon-fiber strengthening schedule'
    },
    {
      id: 'ValidationAgent',
      name: 'Validation Agent',
      icon: ShieldCheck,
      role: 'Independent Auditor',
      engine: 'Isolated Safety Verification Gate',
      desc: 'Audits evidence & enforces SF >= 1.50'
    },
  ];

  return (
    <div className="bg-surface rounded-xl p-5 border border-surfaceHighlight shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 font-mono">
          <Cpu size={15} className="text-primary" /> Autonomous Specialist Fleet
        </h2>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 font-mono">Stage:</span>
          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] font-mono border ${
            stage === 'COMPLETE' ? 'bg-green-950/60 text-green-400 border-green-800' :
            stage === 'REPLANNING' ? 'bg-amber-950/60 text-amber-400 border-amber-800 animate-pulse' :
            stage === 'VALIDATION' ? 'bg-purple-950/60 text-purple-400 border-purple-800' :
            stage === 'EXECUTION' ? 'bg-blue-950/60 text-blue-400 border-blue-800' :
            'bg-gray-800 text-gray-400 border-gray-700'
          }`}>
            {stage}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {agents.map((agent) => {
          const isActive = activeAgent === agent.id;
          const hasActed = events.some(e => e.agent === agent.id);
          const isComplete = stage === 'COMPLETE' && hasActed;

          return (
            <div
              key={agent.id}
              className={`p-3.5 rounded-xl border transition-all duration-300 relative flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-950/40 border-primary shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-primary'
                  : hasActed
                  ? 'bg-surfaceHighlight/70 border-gray-700/80 shadow-sm'
                  : 'bg-surface/60 border-surfaceHighlight/50 opacity-40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-primary/20 text-primary' : 'bg-surface text-gray-400'}`}>
                    <agent.icon size={16} className={isActive ? 'animate-spin-slow' : ''} />
                  </div>
                  {isComplete ? (
                    <CheckCircle2 size={15} className="text-green-400" />
                  ) : isActive ? (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                  ) : null}
                </div>

                <div className="font-bold text-sm text-gray-100 tracking-tight">{agent.name}</div>
                <div className="text-[11px] text-primary/80 font-medium">{agent.role}</div>
                <div className="text-[10px] text-gray-400 mt-1 font-mono leading-tight">{agent.engine}</div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-gray-500">Status</span>
                {isActive ? (
                  <span className="text-primary font-bold animate-pulse">PROCESSING</span>
                ) : hasActed ? (
                  <span className="text-green-400 font-semibold">STANDBY</span>
                ) : (
                  <span className="text-gray-600">IDLE</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
