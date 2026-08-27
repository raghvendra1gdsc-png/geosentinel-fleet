import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine, Legend
} from 'recharts';
import { Activity, Layers, ShieldAlert, TrendingUp, Zap, Atom } from 'lucide-react';
import type { MissionState } from '../types/mission';

interface EngineeringDashboardProps {
  missionState: MissionState | null;
}

export function EngineeringDashboard({ missionState }: EngineeringDashboardProps) {
  const mcData = missionState?.moment_curvature_data;
  const shearData = missionState?.shear_capacity_data;
  const retroData = missionState?.retrofit_data;

  const hasData = mcData || shearData || retroData;

  // 1. Moment-Curvature Curve Points
  const curvePoints = mcData?.curve_data?.points || [];

  // 2. Shear Demand vs Capacity Data
  const shearBarData = shearData ? [
    {
      name: 'Shear Assessment',
      'Concrete (Vc)': shearData.concrete_shear_capacity_kN || 0,
      'Steel Stirrup (Vs)': shearData.steel_shear_capacity_kN || 0,
      'Design Capacity (φVn)': shearData.design_capacity_kN || 0,
      'Demand (Vu)': shearData.demand_kN || 0,
    }
  ] : [];

  // 3. Safety Factor Progression
  const preSF = missionState?.initial_safety_factor || 0;
  const postSF = missionState?.post_retrofit_safety_factor || (retroData ? retroData.post_retrofit_safety_factor : null);

  const sfComparisonData = preSF ? [
    {
      stage: 'Initial',
      'Safety Factor': preSF,
    },
    ...(postSF ? [{
      stage: 'Post-CFRP',
      'Safety Factor': postSF,
    }] : [])
  ] : [];

  // 4. CFRP Ply Optimization Data
  const plyData = retroData?.ply_optimization_curve || [];

  if (!hasData) {
    return (
      <div className="bg-surface rounded-2xl border border-white/5 shadow-2xl flex flex-col h-[520px] overflow-hidden relative">
        {/* Header */}
        <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
              <Activity size={14} className="text-emerald-400" />
            </div>
            <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
              Engineering Physics Lab
            </h2>
          </div>
          <span className="text-[10px] font-mono text-gray-600 bg-white/[0.03] border border-white/5 px-2.5 py-0.5 rounded-full">
            STANDBY
          </span>
        </div>

        {/* Animated idle state with structural wireframe */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          {/* Background shimmer */}
          <div className="absolute inset-0 shimmer opacity-50" />

          {/* Structural wireframe SVG */}
          <div className="relative w-48 h-48 mb-4">
            <svg viewBox="0 0 200 200" className="w-full h-full opacity-30">
              {/* Grid lines */}
              {[40, 80, 120, 160].map(y => (
                <line key={`h${y}`} x1="20" y1={y} x2="180" y2={y} stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="4 4" className="structural-scan-line" />
              ))}
              {[40, 80, 120, 160].map(x => (
                <line key={`v${x}`} x1={x} y1="20" x2={x} y2="180" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="4 4" className="structural-scan-line" />
              ))}
              {/* Column cross-section */}
              <rect x="50" y="50" width="100" height="100" rx="4" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6" />
              <rect x="60" y="60" width="80" height="80" rx="2" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.4" />
              {/* Rebar dots */}
              {[70, 100, 130].map(x => [70, 100, 130].map(y => (
                <circle key={`rb${x}${y}`} cx={x} cy={y} r="3" fill="#818cf8" opacity="0.5" />
              )))}
              {/* Moment curve hint */}
              <path d="M 20 180 Q 60 180, 80 140 Q 100 100, 120 80 Q 140 60, 180 40" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.3" strokeDasharray="6 3" className="structural-scan-line" />
            </svg>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center">
                <Atom size={28} className="text-blue-400/60 animate-spin-slow" />
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-gray-300 mb-1">Deterministic Physics Engine</h3>
          <p className="text-xs text-gray-500 text-center max-w-xs leading-relaxed mb-4">
            Awaiting mission trigger to execute ACI 318-19 shear analysis, ASCE 41-17 moment-curvature simulation, and ACI 440.2R CFRP optimization.
          </p>

          {/* Capability badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'NumPy Mechanics', color: 'text-cyan-400 border-cyan-800/50 bg-cyan-950/30' },
              { label: 'OpenSeesPy FEA', color: 'text-emerald-400 border-emerald-800/50 bg-emerald-950/30' },
              { label: 'Fiber Sections', color: 'text-purple-400 border-purple-800/50 bg-purple-950/30' },
              { label: 'CFRP Design', color: 'text-amber-400 border-amber-800/50 bg-amber-950/30' },
            ].map(b => (
              <span key={b.label} className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${b.color}`}>
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-white/5 shadow-2xl flex flex-col h-[520px] overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
            <Activity size={14} className="text-emerald-400" />
          </div>
          <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
            Deterministic Engineering Telemetry
          </h2>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-0.5 rounded-full">
          ACI 318 / ASCE 41 / ACI 440.2R
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chart 1: Moment Curvature Non-Linear Response */}
        {curvePoints.length > 0 && (
          <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5 font-mono">
                <TrendingUp size={14} className="text-cyan-400" /> M-φ Response
              </span>
              <span className="text-[10px] text-gray-500 font-mono">
                μ = {mcData?.ductility_ratio || '—'}
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curvePoints} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e24" />
                  <XAxis dataKey="curvature" stroke="#52525b" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#52525b" tick={{ fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0c0c10', borderColor: '#27272a', fontSize: 11, borderRadius: 8 }}
                    formatter={(val: any) => [`${val} kNm`, 'Moment']}
                    labelFormatter={(lbl: any) => `φ: ${lbl} ×10⁻⁴/mm`}
                  />
                  <Line
                    type="monotone"
                    dataKey="moment"
                    stroke="url(#gradientCyan)"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4, fill: '#22d3ee', stroke: '#0c0c10', strokeWidth: 2 }}
                  />
                  <defs>
                    <linearGradient id="gradientCyan" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-gray-500 font-mono flex justify-between mt-1 pt-1 border-t border-white/5">
              <span>My: <strong className="text-cyan-400">{mcData?.yield_moment_kNm}</strong> kNm</span>
              <span>Mu: <strong className="text-blue-400">{mcData?.ultimate_moment_kNm}</strong> kNm</span>
            </div>
          </div>
        )}

        {/* Chart 2: Safety Factor Transition */}
        {sfComparisonData.length > 0 && (
          <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5 font-mono">
                <ShieldAlert size={14} className="text-amber-400" /> Safety Factor
              </span>
              <span className="text-[10px] text-red-400 font-mono font-bold">
                Threshold: 1.50
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sfComparisonData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e24" />
                  <XAxis dataKey="stage" stroke="#52525b" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#52525b" domain={[0, 2.5]} tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0c0c10', borderColor: '#27272a', fontSize: 11, borderRadius: 8 }} />
                  <ReferenceLine y={1.50} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'SF=1.50', fill: '#ef4444', fontSize: 9, position: 'right' }} />
                  <Bar
                    dataKey="Safety Factor"
                    fill="url(#gradientSF)"
                    radius={[6, 6, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="gradientSF" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-gray-400 font-mono flex justify-between mt-1 pt-1 border-t border-white/5">
              <span>Pre: <strong className="text-amber-400">{preSF}</strong></span>
              <span>Post: <strong className="text-green-400">{postSF || 'Pending'}</strong></span>
            </div>
          </div>
        )}

        {/* Chart 3: Shear Demand vs Capacity */}
        {shearBarData.length > 0 && (
          <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5 font-mono">
                <Zap size={14} className="text-emerald-400" /> ACI 318 Shear
              </span>
              <span className="text-[10px] text-gray-500 font-mono">
                DCR = {shearData?.demand_capacity_ratio}
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shearBarData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e24" />
                  <XAxis dataKey="name" stroke="#52525b" tick={{ fontSize: 8 }} />
                  <YAxis stroke="#52525b" tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0c0c10', borderColor: '#27272a', fontSize: 10, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 9 }} />
                  <Bar dataKey="Design Capacity (φVn)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Demand (Vu)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-gray-500 font-mono flex justify-between mt-1 pt-1 border-t border-white/5">
              <span>Vc: <strong className="text-emerald-400">{shearData?.concrete_shear_capacity_kN}</strong> kN</span>
              <span>Vs: <strong className="text-blue-400">{shearData?.steel_shear_capacity_kN}</strong> kN</span>
            </div>
          </div>
        )}

        {/* Chart 4: CFRP Layer Optimization Curve */}
        {plyData.length > 0 && (
          <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5 font-mono">
                <Layers size={14} className="text-purple-400" /> CFRP Optimization
              </span>
              <span className="text-[10px] text-purple-400 font-mono font-bold">
                {retroData?.required_cfrp_layers} Plies
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={plyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e24" />
                  <XAxis dataKey="layers" stroke="#52525b" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#52525b" tick={{ fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0c0c10', borderColor: '#27272a', fontSize: 11, borderRadius: 8 }}
                    formatter={(val: any) => [val, 'SF']}
                    labelFormatter={(lbl: any) => `${lbl} CFRP Layers`}
                  />
                  <ReferenceLine y={1.50} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} />
                  <Line
                    type="monotone"
                    dataKey="safety_factor"
                    stroke="url(#gradientPurple)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#a855f7', stroke: '#0c0c10', strokeWidth: 2 }}
                  />
                  <defs>
                    <linearGradient id="gradientPurple" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-gray-400 font-mono flex justify-between mt-1 pt-1 border-t border-white/5">
              <span>Added: <strong className="text-purple-400">+{retroData?.added_design_capacity_kN}</strong> kN</span>
              <span>Boost: <strong className="text-green-400">+{retroData?.improvement_percentage}%</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
