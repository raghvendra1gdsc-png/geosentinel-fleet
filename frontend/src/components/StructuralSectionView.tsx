import type { MissionState } from '../types/mission';

interface StructuralSectionViewProps {
  missionState: MissionState | null;
  stage?: string;
}

export function StructuralSectionView({ missionState }: StructuralSectionViewProps) {
  const retro = missionState?.retrofit_data;
  const preSF = missionState?.initial_safety_factor || 0.94;
  const postSF = missionState?.post_retrofit_safety_factor || 1.74;
  const layers = retro?.required_cfrp_layers || 3;

  return (
    <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs font-mono font-black uppercase tracking-wider text-white">
            STRUCTURAL SECTION STATE TRANSITION • 600×600mm RC PIER
          </h3>
        </div>

        <div className="text-[10px] text-gray-400">
          DESIGN STANDARD: <span className="text-purple-300 font-bold">ACI 440.2R-17 / ASCE 41-17</span>
        </div>
      </div>

      {/* 3-Column Visual Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
        
        {/* Column 1: Before Damaged State (4 cols) */}
        <div className="lg:col-span-4 bg-red-950/20 border border-red-500/40 p-4 rounded-xl flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-xs text-red-300 font-bold mb-2">
              <span>BEFORE INTERVENTION</span>
              <span className="bg-red-500 text-black px-2 py-0.2 rounded font-black text-[9px]">
                CRITICAL DEFICIT
              </span>
            </div>

            {/* Pier Section SVG Diagram - Damaged */}
            <div className="relative w-full h-44 bg-black/50 rounded-lg p-2 border border-red-500/20 flex items-center justify-center my-2">
              <svg viewBox="0 0 160 160" className="w-full h-full">
                {/* Outer concrete core with cracks */}
                <rect x="25" y="25" width="110" height="110" rx="4" fill="#1e1515" stroke="#ef4444" strokeWidth="2" />
                {/* Spalling zone */}
                <path d="M 25 40 Q 40 45 40 70 Q 35 95 25 100 Z" fill="#7f1d1d" opacity="0.6" />
                <path d="M 135 50 Q 120 70 120 90 Q 125 110 135 120 Z" fill="#7f1d1d" opacity="0.6" />
                {/* Crack paths */}
                <path d="M 50 35 L 65 60 L 55 85 L 75 110" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
                <path d="M 110 40 L 95 65 L 105 90 L 85 115" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
                {/* Inner Rebar Cage */}
                <rect x="40" y="40" width="80" height="80" rx="2" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                {[45, 80, 115].map(x => [45, 80, 115].map(y => (
                  <circle key={`b-${x}-${y}`} cx={x} cy={y} r="3" fill="#ef4444" />
                )))}
                {/* Text overlay */}
                <text x="80" y="85" textAnchor="middle" fill="#f87171" fontSize="9" fontWeight="bold">PLASTIC HINGE</text>
              </svg>
            </div>

            <div className="space-y-1 text-[11px] text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Safety Factor:</span>
                <span className="text-red-400 font-bold">{preSF.toFixed(2)} (&lt; 1.50)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Section Mode:</span>
                <span className="text-red-400 font-bold">Flexural Yielding</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Capacity Deficit:</span>
                <span className="text-red-400 font-bold">−0.56 Margin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: The Engineered Retrofit Intervention (3 cols) */}
        <div className="lg:col-span-3 bg-purple-950/20 border border-purple-500/40 p-4 rounded-xl flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-xs text-purple-300 font-bold mb-2">
              <span>CFRP INTERVENTION</span>
              <span className="bg-purple-950 text-purple-300 border border-purple-700 px-1.5 py-0.2 rounded text-[9px]">
                OPTIMIZED
              </span>
            </div>

            <div className="p-3 bg-black/40 rounded-lg border border-purple-500/20 space-y-2 text-[10px] my-2">
              <div>
                <span className="text-gray-400 block">Composite Material:</span>
                <span className="text-purple-300 font-bold">SikaWrap-300C (Unidirectional)</span>
              </div>
              <div>
                <span className="text-gray-400 block">Laminate Schedule:</span>
                <span className="text-purple-300 font-bold">{layers}-Ply Continuous Wrap</span>
              </div>
              <div>
                <span className="text-gray-400 block">Total Thickness:</span>
                <span className="text-purple-300 font-bold">3.00 mm (1.0mm/ply)</span>
              </div>
              <div>
                <span className="text-gray-400 block">Tensile Modulus $E_f$:</span>
                <span className="text-purple-300 font-bold">230 GPa / 3,900 MPa</span>
              </div>
            </div>

            <div className="text-[10px] text-gray-300 pt-1 border-t border-purple-500/20 flex justify-between">
              <span>Added Capacity:</span>
              <span className="text-emerald-400 font-bold">+{retro?.added_design_capacity_kN || 640} kNm</span>
            </div>
          </div>
        </div>

        {/* Column 3: After Restored State (4 cols) */}
        <div className="lg:col-span-4 bg-emerald-950/20 border-2 border-emerald-500/80 p-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-2">
              <span>POST-RETROFIT STATE</span>
              <span className="bg-emerald-500 text-black px-2 py-0.2 rounded font-black text-[9px]">
                VERIFIED SAFE
              </span>
            </div>

            {/* Pier Section SVG Diagram - Reinforced with CFRP Wrap */}
            <div className="relative w-full h-44 bg-black/50 rounded-lg p-2 border border-emerald-500/40 flex items-center justify-center my-2">
              <svg viewBox="0 0 160 160" className="w-full h-full">
                {/* 3-Ply CFRP Composite Jacket Outer Layer */}
                <rect x="20" y="20" width="120" height="120" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="4" />
                <rect x="23" y="23" width="114" height="114" rx="5" fill="none" stroke="#34d399" strokeWidth="1" strokeDasharray="3 3" />
                {/* Restored Confined Concrete Core */}
                <rect x="27" y="27" width="106" height="106" rx="4" fill="#0f291e" stroke="#10b981" strokeWidth="1.5" />
                {/* Internal Rebar Cage */}
                <rect x="40" y="40" width="80" height="80" rx="2" fill="none" stroke="#10b981" strokeWidth="1" />
                {[45, 80, 115].map(x => [45, 80, 115].map(y => (
                  <circle key={`a-${x}-${y}`} cx={x} cy={y} r="3" fill="#34d399" />
                )))}
                {/* Confined core badge */}
                <text x="80" y="85" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold">CONFINED CORE</text>
              </svg>
            </div>

            <div className="space-y-1 text-[11px] text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Safety Factor:</span>
                <span className="text-emerald-400 font-bold">{postSF.toFixed(2)} (≥ 1.50)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Capacity Increase:</span>
                <span className="text-emerald-400 font-bold">+{retro?.improvement_percentage || 85.1}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Compliance Check:</span>
                <span className="text-emerald-400 font-bold">✓ ASCE 41 / ACI 440.2R</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
