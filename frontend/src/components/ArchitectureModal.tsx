import { X, Cpu, Brain, Globe, Sparkles } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ArchitectureModal({ isOpen, onClose }: ArchitectureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0b0c14] border-2 border-cyan-500/50 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative overflow-hidden font-mono max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-5">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Cpu size={22} />
          </div>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              GEOSENTINEL FLEET • SYSTEM ARCHITECTURE & HONEST TECH STACK
            </h2>
            <div className="text-xs text-cyan-400">
              Google All Things Agentic Hackathon 2026 Submission
            </div>
          </div>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-black/50 border border-white/10">
            <div className="text-xs font-bold text-gray-200 uppercase mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-cyan-400" />
              <span>Real End-to-End System Pipeline</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-[10px]">
              <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30">
                <div className="font-bold text-blue-300">1. SENSOR INGESTION</div>
                <div className="text-gray-400 mt-1">IoT Strain, Acoustic Emission, PGA Telemetry</div>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
                <div className="font-bold text-indigo-300">2. GEMINI COMMANDER</div>
                <div className="text-gray-400 mt-1">Gemini 2.5 Pro Multi-Turn Reasoning Swarm</div>
              </div>
              <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
                <div className="font-bold text-cyan-300">3. SPECIALIST FLEET</div>
                <div className="text-gray-400 mt-1">Structural, Simulation, Retrofit Agents</div>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/30">
                <div className="font-bold text-purple-300">4. PHYSICS ENGINE</div>
                <div className="text-gray-400 mt-1">OpenSeesPy v3.8 + NumPy Mechanics</div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                <div className="font-bold text-emerald-300">5. VALIDATION GATE</div>
                <div className="text-gray-400 mt-1">Independent Audit (SF ≥ 1.50) & Signed Dossier</div>
              </div>
            </div>
          </div>

          {/* Honest Tech Stack Disclosure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            {/* Google Tech Card */}
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/40">
              <div className="flex items-center gap-2 font-bold text-blue-300 mb-2">
                <Brain size={16} />
                <span>Google Technologies (Actually Running)</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-gray-300">
                <li>• <strong className="text-white">Google Gemini 2.5 Pro</strong> (via Google GenAI SDK): Real-time multi-turn function calling, hypothesis formulation, tool delegation, and adaptive replanning.</li>
                <li>• <strong className="text-white">Autonomous Agentic Protocol</strong>: Dynamic tool routing, adversarial reflection, and structured observation returns.</li>
              </ul>
            </div>

            {/* Engineering Physics & Deployment Card */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40">
              <div className="flex items-center gap-2 font-bold text-emerald-300 mb-2">
                <Globe size={16} />
                <span>Engineering & Infrastructure Stack</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-gray-300">
                <li>• <strong className="text-white">OpenSeesPy v3.8</strong>: Non-linear fiber section FEA and pushover analysis.</li>
                <li>• <strong className="text-white">NumPy Mechanics</strong>: Deterministic calculations strictly following ACI 318-19, ASCE 41-17, and ACI 440.2R.</li>
                <li>• <strong className="text-white">Backend</strong>: FastAPI + WebSockets deployed on Render.</li>
                <li>• <strong className="text-white">Frontend</strong>: React + TypeScript + Vite deployed on Vercel.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
}
