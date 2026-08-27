import { Eye, Brain, Users, ShieldAlert, RotateCw, Wrench, ShieldCheck } from 'lucide-react';

export function WhyAgenticSection() {
  const steps = [
    {
      num: '01',
      title: 'OBSERVES',
      desc: 'Multimodal sensor fusion (2,140 με strain, 84.5 dB acoustic emission, 0.42g PGA) establishes live physical emergency state.',
      icon: Eye,
      color: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-950/20'
    },
    {
      num: '02',
      title: 'REASONS',
      desc: 'Commander Agent leverages Google Gemini 2.5 Pro multi-turn reasoning to formulate adversarial hypotheses rather than fixed templates.',
      icon: Brain,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/20'
    },
    {
      num: '03',
      title: 'DELEGATES',
      desc: 'Autonomous specialist fleet dispatches domain-specific deterministic physics tools (ACI 318-19, ASCE 41-17, OpenSeesPy FEA).',
      icon: Users,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20'
    },
    {
      num: '04',
      title: 'CHALLENGES',
      desc: 'Independent Validation Agent audits physics against damage telemetry, raising objections if initial models fail to explain observed anomalies.',
      icon: ShieldAlert,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/20'
    },
    {
      num: '05',
      title: 'REPLANS',
      desc: 'Commander autonomously changes strategic path upon objection, escalating from shear screening to non-linear fiber-section pushover FEA.',
      icon: RotateCw,
      color: 'text-orange-400',
      border: 'border-orange-500/30',
      bg: 'bg-orange-950/20'
    },
    {
      num: '06',
      title: 'ACTS',
      desc: 'Retrofit Agent optimizes ACI 440.2R carbon-fiber composite schedules to deterministically resolve the identified plastic hinge deficit.',
      icon: Wrench,
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-950/20'
    },
    {
      num: '07',
      title: 'VERIFIES',
      desc: 'Isolated validation audit executes final compliance verification (SF ≥ 1.50) and generates cryptographically verifiable signed dossier.',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20'
    }
  ];

  return (
    <div className="bg-[#0a0b10] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-mono font-black uppercase tracking-wider text-white">
              WHY GEOSENTINEL IS TRULY AGENTIC
            </h3>
            <span className="text-[10px] font-mono bg-white/[0.04] text-gray-300 border border-white/10 px-2 py-0.5 rounded">
              BEYOND SIMPLE LLM CHATBOTS
            </span>
          </div>
          <p className="text-xs text-gray-400 font-sans mt-0.5">
            Real autonomous agentic systems observe, reason, delegate, challenge, replan, act, and verify.
          </p>
        </div>

        <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-1 rounded-lg self-start sm:self-auto">
          7-STAGE AUTONOMOUS LOOP
        </div>
      </div>

      {/* The 7 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 font-mono">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className={`p-3.5 rounded-xl border ${step.border} ${step.bg} flex flex-col justify-between transition-all hover:scale-[1.02]`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-black ${step.color}`}>{step.num}</span>
                  <Icon size={14} className={step.color} />
                </div>
                <div className="text-xs font-bold text-white mb-1.5 tracking-tight">{step.title}</div>
                <p className="text-[11px] text-gray-300 font-sans leading-snug">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
