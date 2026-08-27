import { Search, Brain, Activity, ShieldAlert, RotateCw, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
      agentTag: 'Piezo/Acoustic',
      icon: Search,
      agent: 'Incident',
      isActive: isStarted && eventsCount < 2,
      isDone: eventsCount >= 1,
      color: 'blue'
    },
    {
      id: 'REASON',
      label: 'REASON',
      subtext: 'Gemini 2.5 Pro',
      agentTag: 'Commander',
      icon: Brain,
      agent: 'Commander',
      isActive: activeAgent === 'Commander' || stage === 'PLANNING',
      isDone: eventsCount > 1,
      color: 'blue'
    },
    {
      id: 'INVESTIGATE',
      label: 'INVESTIGATE',
      subtext: 'ACI 318 Mechanics',
      agentTag: 'StructuralAgent',
      icon: Activity,
      agent: 'StructuralAgent',
      isActive: activeAgent === 'StructuralAgent',
      isDone: eventsCount > 3,
      color: 'cyan'
    },
    {
      id: 'CHALLENGE',
      label: 'CHALLENGE',
      subtext: 'Independent Audit',
      agentTag: 'ValidationAgent',
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
      agentTag: 'SimulationAgent',
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
      agentTag: 'RetrofitAgent',
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
      agentTag: 'ValidationAudit',
      icon: ShieldCheck,
      agent: 'ValidationAgent',
      isActive: isComplete,
      isDone: isComplete,
      color: 'emerald'
    }
  ];

  return (
    <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <h3 className="text-xs font-mono font-black uppercase tracking-wider text-white">
            AUTONOMOUS MISSION PIPELINE
          </h3>
          <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.2 rounded hidden sm:inline-block">
            ACTIVE FLOW
          </span>
        </div>

        <div className="text-[10px] font-mono text-gray-400 flex items-center gap-2">
          <span>7 AUTONOMOUS PHASES</span>
          <span>•</span>
          <span className={isComplete ? "text-emerald-400 font-bold" : isStarted ? "text-cyan-400 font-bold animate-pulse" : "text-gray-500"}>
            {isComplete ? 'ALL PHASES VERIFIED' : isStarted ? 'TRIAGE PROGRESSING' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* The 7 Interactive Timeline Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 relative z-10 font-mono">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = step.isActive && !isComplete;
          const isPassed = step.isDone;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border transition-all duration-300 flex flex-col justify-between relative ${
                isCurrent
                  ? 'bg-blue-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/80 scale-[1.02]'
                  : isPassed
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                  : 'bg-black/30 border-white/5 opacity-50'
              }`}
            >
              <div>
                {/* Step Top */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-black tracking-widest ${
                    isCurrent ? 'text-cyan-400' : isPassed ? 'text-emerald-400' : 'text-gray-500'
                  }`}>
                    0{idx + 1}
                  </span>

                  {isPassed ? (
                    <CheckCircle2 size={13} className="text-emerald-400" />
                  ) : (
                    <Icon
                      size={13}
                      className={isCurrent ? 'text-cyan-400 animate-pulse' : 'text-gray-600'}
                    />
                  )}
                </div>

                {/* Step Name */}
                <div className={`text-xs font-black tracking-tight ${
                  isCurrent ? 'text-cyan-300' : isPassed ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.label}
                </div>

                {/* Step Subtext */}
                <div className="text-[10px] text-gray-300 font-sans mt-0.5 leading-snug">
                  {step.subtext}
                </div>
              </div>

              {/* Responsible Tool/Agent Tag */}
              <div className="mt-2.5 pt-1.5 border-t border-white/5 text-[9px] text-gray-400 truncate">
                {step.agentTag}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
