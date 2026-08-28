import { Search, Brain, Activity, ShieldAlert, RotateCw, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
      label: 'Detect',
      subtext: 'IoT Multimodal Telemetry',
      agentTag: 'Piezo/Acoustic',
      icon: Search,
      agent: 'Incident',
      isActive: isStarted && eventsCount < 2,
      isDone: eventsCount >= 1,
    },
    {
      id: 'REASON',
      label: 'Reason',
      subtext: 'Gemini 2.5 Pro Multi-Turn',
      agentTag: 'Commander',
      icon: Brain,
      agent: 'Commander',
      isActive: activeAgent === 'Commander' || stage === 'PLANNING',
      isDone: eventsCount > 1,
    },
    {
      id: 'INVESTIGATE',
      label: 'Investigate',
      subtext: 'ACI 318 Linear Shear',
      agentTag: 'StructuralAgent',
      icon: Activity,
      agent: 'StructuralAgent',
      isActive: activeAgent === 'StructuralAgent',
      isDone: eventsCount > 3,
    },
    {
      id: 'CHALLENGE',
      label: 'Challenge',
      subtext: 'Adversarial Audit Gate',
      agentTag: 'ValidationAgent',
      icon: ShieldAlert,
      agent: 'ValidationAgent',
      isActive: isValidation || activeAgent === 'ValidationAgent',
      isDone: isReplanning || eventsCount > 5 || isComplete,
    },
    {
      id: 'REPLAN',
      label: 'Replan',
      subtext: 'OpenSeesPy Fiber FEA',
      agentTag: 'SimulationAgent',
      icon: RotateCw,
      agent: 'SimulationAgent',
      isActive: isReplanning || activeAgent === 'SimulationAgent',
      isDone: eventsCount > 7 || isComplete,
    },
    {
      id: 'MITIGATE',
      label: 'Mitigate',
      subtext: 'ACI 440.2R CFRP Optimizer',
      agentTag: 'RetrofitAgent',
      icon: Wrench,
      agent: 'RetrofitAgent',
      isActive: activeAgent === 'RetrofitAgent',
      isDone: eventsCount > 9 || isComplete,
    },
    {
      id: 'VERIFY',
      label: 'Verify',
      subtext: 'SF ≥ 1.50 Compliance',
      agentTag: 'ValidationAudit',
      icon: ShieldCheck,
      agent: 'ValidationAgent',
      isActive: isComplete,
      isDone: isComplete,
    }
  ];

  return (
    <div className="apple-glass rounded-3xl p-5 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08] mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Autonomous Mission Pipeline
          </h3>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full hidden sm:inline-block">
            7-Stage Swarm Protocol
          </span>
        </div>

        <div className="text-[11px] font-sans text-slate-400 flex items-center gap-2">
          <span>Swarm Cadence</span>
          <span>•</span>
          <span className={isComplete ? "text-emerald-400 font-medium" : isStarted ? "text-cyan-400 font-medium animate-pulse" : "text-slate-500"}>
            {isComplete ? 'All 7 Phases Verified' : isStarted ? 'Autonomous Execution Active' : 'Standby'}
          </span>
        </div>
      </div>

      {/* The 7 Interactive Timeline Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = step.isActive && !isComplete;
          const isPassed = step.isDone;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between relative ${
                isCurrent
                  ? 'bg-blue-500/15 border-blue-400/80 shadow-[0_0_20px_rgba(41,151,255,0.25)] ring-1 ring-blue-400/60 scale-[1.02]'
                  : isPassed
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-white/[0.02] border-white/[0.06] opacity-60'
              }`}
            >
              <div>
                {/* Step Top */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold ${
                    isCurrent ? 'text-cyan-400' : isPassed ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    0{idx + 1}
                  </span>

                  {isPassed ? (
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  ) : (
                    <Icon
                      size={14}
                      className={isCurrent ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}
                    />
                  )}
                </div>

                {/* Step Name */}
                <div className={`text-sm font-bold tracking-tight ${
                  isCurrent ? 'text-white' : isPassed ? 'text-slate-100' : 'text-slate-400'
                }`}>
                  {step.label}
                </div>

                {/* Step Subtext */}
                <div className="text-[11px] text-slate-400 font-sans mt-0.5 leading-snug">
                  {step.subtext}
                </div>
              </div>

              {/* Responsible Tool/Agent Tag */}
              <div className="mt-3 pt-2 border-t border-white/[0.06] text-[10px] font-mono text-slate-400 truncate">
                {step.agentTag}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
