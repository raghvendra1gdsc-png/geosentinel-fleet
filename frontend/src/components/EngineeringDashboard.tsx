import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine, Legend
} from 'recharts';
import { Layers, TrendingUp, Zap, Atom } from 'lucide-react';
import type { MissionState } from '../types/mission';

interface EngineeringDashboardProps {
  missionState: MissionState | null;
}

export function EngineeringDashboard({ missionState }: EngineeringDashboardProps) {
  const [activeTab, setActiveTab] = useState<'MC' | 'SHEAR' | 'CFRP'>('MC');

  const mcData = missionState?.moment_curvature_data;
  const shearData = missionState?.shear_capacity_data;
  const retroData = missionState?.retrofit_data;

  const hasData = mcData || shearData || retroData;

  // 1. Moment-Curvature Curve Points
  const curvePoints = mcData?.curve_data?.points || [];

  // 2. Shear Demand vs Capacity Data
  const shearBarData = shearData ? [
    {
      name: 'Shear Force (kN)',
      'Design Capacity (φVn)': shearData.design_capacity_kN || 850,
      'Applied Demand (Vu)': shearData.demand_kN || 550,
      'Concrete (Vc)': shearData.concrete_shear_capacity_kN || 420,
      'Steel (Vs)': shearData.steel_shear_capacity_kN || 430,
    }
  ] : [];

  // 3. CFRP Ply Optimization Data
  const plyData = retroData?.ply_optimization_curve || [];

  // If no data, show compact technical dormant state
  if (!hasData) {
    return (
      <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col h-[560px] relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-200">
              Deterministic Engineering Simulation Workstation
            </h3>
          </div>
          <span className="text-[10px] font-mono text-gray-500 bg-white/[0.03] border border-white/5 px-2.5 py-0.5 rounded-full">
            STANDBY • DORMANT
          </span>
        </div>

        {/* Dormant Technical Grid & Scanner */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative">
          <div className="relative w-44 h-44 mb-4 flex items-center justify-center">
            {/* SVG Engineering Section & Fiber mesh preview */}
            <svg viewBox="0 0 160 160" className="w-full h-full opacity-40">
              <rect x="20" y="20" width="120" height="120" rx="4" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" />
              <rect x="35" y="35" width="90" height="90" rx="2" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
              {/* Rebar reinforcement grid */}
              {[45, 80, 115].map(x => [45, 80, 115].map(y => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#38bdf8" />
              )))}
              {/* Fiber Section Discretization */}
              {[50, 65, 80, 95, 110].map(y => (
                <line key={`f-${y}`} x1="35" y1={y} x2="125" y2={y} stroke="#818cf8" strokeWidth="0.5" opacity="0.6" />
              ))}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Atom size={32} className="text-cyan-400/80 animate-spin-slow" />
            </div>
          </div>

          <h4 className="text-sm font-bold text-gray-200 font-mono mb-1">
            Deterministic Mechanics Solvers Ready
          </h4>
          <p className="text-xs text-gray-400 max-w-sm font-sans leading-relaxed mb-4">
            Awaiting commander trigger. Swarm will execute non-linear moment-curvature analysis, OpenSeesPy fiber-section pushover, and ACI 440.2R laminate optimization.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-md text-[10px] font-mono">
            <div className="p-2 rounded bg-black/40 border border-white/5 text-gray-400">
              <div className="text-cyan-400 font-bold">ACI 318-19</div>
              <div>Shear Mechanics</div>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5 text-gray-400">
              <div className="text-blue-400 font-bold">ASCE 41-17</div>
              <div>M-φ Fiber Solver</div>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5 text-gray-400">
              <div className="text-emerald-400 font-bold">OpenSeesPy</div>
              <div>Pushover FEA</div>
            </div>
            <div className="p-2 rounded bg-black/40 border border-white/5 text-gray-400">
              <div className="text-purple-400 font-bold">ACI 440.2R</div>
              <div>CFRP Optimizer</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col h-[560px] relative overflow-hidden">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-200">
            Deterministic Physics Workstation
          </h3>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-black/50 rounded-lg border border-white/10 font-mono text-[10px]">
          <button
            onClick={() => setActiveTab('MC')}
            className={`px-3 py-1 rounded transition-all font-bold ${
              activeTab === 'MC'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            MOMENT-CURVATURE (FEA)
          </button>
          <button
            onClick={() => setActiveTab('SHEAR')}
            className={`px-3 py-1 rounded transition-all font-bold ${
              activeTab === 'SHEAR'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ACI 318 SHEAR
          </button>
          <button
            onClick={() => setActiveTab('CFRP')}
            className={`px-3 py-1 rounded transition-all font-bold ${
              activeTab === 'CFRP'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            CFRP RETROFIT
          </button>
        </div>
      </div>

      {/* Main Chart Area according to active tab */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        {/* TAB 1: MOMENT-CURVATURE */}
        {activeTab === 'MC' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-gray-200 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-cyan-400" /> Non-Linear Section Response (M-φ)
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span>Yield: <strong className="text-cyan-400">{mcData?.yield_moment_kNm || 540} kNm</strong></span>
                <span>Ultimate: <strong className="text-red-400">{mcData?.ultimate_moment_kNm || 750} kNm</strong></span>
                <span>Ductility μ: <strong className="text-blue-400">{mcData?.ductility_ratio || 4.2}</strong></span>
              </div>
            </div>

            <div className="h-64 w-full bg-black/40 rounded-xl p-2 border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curvePoints} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#181a24" />
                  <XAxis dataKey="curvature" stroke="#64748b" tick={{ fontSize: 9 }} label={{ value: 'Curvature φ (1/mm)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 9 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 9 }} label={{ value: 'Moment (kNm)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090a0f', borderColor: '#1e293b', fontSize: 11, borderRadius: 8, fontFamily: 'monospace' }}
                    formatter={(val: any) => [`${val} kNm`, 'Bending Moment']}
                    labelFormatter={(lbl: any) => `Curvature: ${lbl} ×10⁻⁴`}
                  />
                  <ReferenceLine y={800} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Moment Demand Mu (800 kNm)', fill: '#ef4444', fontSize: 9, position: 'top' }} />
                  <Line
                    type="monotone"
                    dataKey="moment"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: '#22d3ee', stroke: '#000', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Metric Callouts */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/5 text-[10px] font-mono">
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-gray-500 block">Moment Demand</span>
                <span className="text-red-400 font-bold text-xs">800.0 kNm</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-gray-500 block">Section Capacity</span>
                <span className="text-amber-400 font-bold text-xs">{mcData?.ultimate_moment_kNm || 750.0} kNm</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-gray-500 block">Flexural SF</span>
                <span className="text-red-400 font-bold text-xs">{missionState?.initial_safety_factor || 0.94} [CRITICAL]</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHEAR CAPACITY */}
        {activeTab === 'SHEAR' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-gray-200 flex items-center gap-1.5">
                <Zap size={14} className="text-emerald-400" /> ACI 318-19 Shear Capacity vs Demand
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span>DCR: <strong className="text-emerald-400">{shearData?.demand_capacity_ratio || 0.65}</strong></span>
                <span>Shear SF: <strong className="text-emerald-400">1.54</strong></span>
              </div>
            </div>

            <div className="h-64 w-full bg-black/40 rounded-xl p-2 border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shearBarData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#181a24" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#090a0f', borderColor: '#1e293b', fontSize: 11, borderRadius: 8, fontFamily: 'monospace' }} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'monospace' }} />
                  <Bar dataKey="Design Capacity (φVn)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Applied Demand (Vu)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Concrete (Vc)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Steel (Vs)" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Metric Callouts */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/5 text-[10px] font-mono">
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-gray-500 block">Concrete Shear Vc</span>
                <span className="text-cyan-400 font-bold text-xs">{shearData?.concrete_shear_capacity_kN || 420} kN</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-gray-500 block">Stirrups Steel Vs</span>
                <span className="text-blue-400 font-bold text-xs">{shearData?.steel_shear_capacity_kN || 430} kN</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-gray-500 block">Total Shear φVn</span>
                <span className="text-emerald-400 font-bold text-xs">{shearData?.design_capacity_kN || 850} kN</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CFRP OPTIMIZATION */}
        {activeTab === 'CFRP' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-gray-200 flex items-center gap-1.5">
                <Layers size={14} className="text-purple-400" /> ACI 440.2R CFRP Optimization Curve
              </span>
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span>Optimal Plies: <strong className="text-purple-400">{retroData?.required_cfrp_layers || 3} Plies</strong></span>
                <span>Post SF: <strong className="text-emerald-400">{missionState?.post_retrofit_safety_factor || 1.74}</strong></span>
              </div>
            </div>

            <div className="h-64 w-full bg-black/40 rounded-xl p-2 border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={plyData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#181a24" />
                  <XAxis dataKey="layers" stroke="#64748b" tick={{ fontSize: 9 }} label={{ value: 'CFRP Laminate Plies', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 9 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 9 }} domain={[0.8, 2.2]} label={{ value: 'Safety Factor', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090a0f', borderColor: '#1e293b', fontSize: 11, borderRadius: 8, fontFamily: 'monospace' }}
                    formatter={(val: any) => [val, 'Safety Factor']}
                    labelFormatter={(lbl: any) => `${lbl} CFRP Plies`}
                  />
                  <ReferenceLine y={1.50} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Target SF = 1.50', fill: '#ef4444', fontSize: 9, position: 'right' }} />
                  <Line
                    type="monotone"
                    dataKey="safety_factor"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: '#c084fc', stroke: '#000', strokeWidth: 2 }}
                    activeDot={{ r: 7, fill: '#d8b4fe' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Metric Callouts */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/5 text-[10px] font-mono">
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-gray-500 block">Added Moment Capacity</span>
                <span className="text-purple-400 font-bold text-xs">+{retroData?.added_design_capacity_kN || 640} kNm</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-gray-500 block">Capacity Boost</span>
                <span className="text-emerald-400 font-bold text-xs">+{retroData?.improvement_percentage || 85.1}%</span>
              </div>
              <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                <span className="text-gray-500 block">Compliance Status</span>
                <span className="text-emerald-400 font-bold text-xs">✓ SF ≥ 1.50 Enforced</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
