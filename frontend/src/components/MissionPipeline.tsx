import { Search, Brain, Activity, ShieldAlert, RotateCw, Wrench, ShieldCheck } from 'lucide-react';

interface MissionPipelineProps {
  stage: string;
  activeAgent: string | null;
  eventsCount: number;
}

export function MissionPipeline({ stage, activeAgent, eventsCount }: MissionPipelineProps) {
  const isStarted = eventsCount > 0 || stage !== 'IDLE';
  const isComplete = stage === 'COMPLETE';
  const isReplanning = stage === 'REPLANNING';
  const isValidation = stage === 'VALIDATION';

  const steps = [
    {
      id: 'DETECT',
      label: 'DETECT',
      subtext: 'IoT Sensor Fusion',
      icon: Search,
      agent: 'Incident',
      isActive: isStarted,
      isDone: isStarted,
      color: 'blue'
    },
    {
      id: 'REASON',
      label: 'REASON',
      subtext: 'Gemini 2.5 Pro',
      icon: Brain,
      agent: 'Commander',
      isActive: activeAgent === 'Commander' || stage === 'PLANNING',
      isDone: eventsCount > 1,
      color: 'blue'
    },
    {
      id: 'INVESTIGATE',
      label: 'INVESTIGATE',
      subtext: 'NumPy Mechanics',
      icon: Activity,
      agent: 'StructuralAgent',
      isActive: activeAgent === 'StructuralAgent',
      isDone: eventsCount > 3,
      color: 'cyan'
    },
    {
      id: 'CHALLENGE',
      label: 'CHALLENGE',
      subtext: 'Evidence Audit',
      icon: ShieldAlert,
      agent: 'ValidationAgent',
      isActive: isValidation || activeAgent === 'ValidationAgent',
      isDone: isReplanning || eventsCount > 5 || isComplete,
      color: 'amber'
    },
    {
      id: 'REPLAN',
      label: 'REPLAN',
      subtext: 'OpenSeesPy FEA',
      icon: RotateCw,
      agent: 'SimulationAgent',
      isActive: isReplanning || activeAgent === 'SimulationAgent',
      isDone: eventsCount > 7 || isComplete,
      color: 'orange'
    },
    {
      id: 'MITIGATE',
      label: 'MITIGATE',
      subtext: 'CFRP Optimizer',
      icon: Wrench,
      agent: 'RetrofitAgent',
      isActive: activeAgent === 'RetrofitAgent',
      isDone: eventsCount > 9 || isComplete,
      color: 'purple'
    },
    {
      id: 'VERIFY',
      label: 'VERIFY',
      subtext: 'Safety Factor ≥ 1.50',
      icon: ShieldCheck,
      agent: 'ValidationAgent',
      isActive: isComplete,
      isDone: isComplete,
      color: 'emerald'
    }
  ];

  return (
    <div className="bg-[#0c0d14] border border-white/10 rounded-xl p-3.5 shadow-xl relative overflow-hidden">
      {/* Background technical grid accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative z-10">
        {/* Left header tag */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <div>
            <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400">
              AUTONOMOUS MISSION PIPELINE
            </div>
            <div className="text-[9px] text-gray-500 font-mono">
              Hypothesis Driven • Physics Enforced
            </div>
          </div>
        </div>

        {/* The 7 Steps */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 lg:pb-0 flex-1 max-w-4xl">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = step.isActive && !isComplete;
            const isPassed = step.isDone;

            return (
              <div key={step.id} className="flex items-center gap-1 shrink-0">
                <div
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all duration-300 ${
                    isCurrent
                      ? 'bg-blue-950/80 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)] ring-1 ring-cyan-400/50'
                      : isPassed
                      ? 'bg-white/[0.04] border-white/15 text-gray-300'
                      : 'bg-white/[0.01] border-white/5 text-gray-600 opacity-60'
                  }`}
                >
                  <Icon
                    size={13}
                    className={
                      isCurrent
                        ? 'text-cyan-400 animate-pulse'
                        : isPassed
                        ? 'text-emerald-400'
                        : 'text-gray-600'
                    }
                  />
                  <div className="text-left font-mono">
                    <div
                      className={`text-[10px] font-bold tracking-wider ${
                        isCurrent
                          ? 'text-cyan-300'
                          : isPassed
                          ? 'text-gray-200'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className="text-[8px] text-gray-400 whitespace-nowrap">
                      {step.subtext}
                    </div>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <span
                    className={`text-[10px] px-0.5 font-mono ${
                      isPassed ? 'text-cyan-500/70' : 'text-gray-700'
                    }`}
                  >
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
