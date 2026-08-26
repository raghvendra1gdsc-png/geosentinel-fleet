import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine, Legend
} from 'recharts';
import { Activity, Layers, ShieldAlert, TrendingUp } from 'lucide-react';
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
      'Design Capacity (phi*Vn)': shearData.design_capacity_kN || 0,
      'Demand (Vu)': shearData.demand_kN || 0,
    }
  ] : [];

  // 3. Safety Factor Progression
  const preSF = missionState?.initial_safety_factor || 0.94;
  const postSF = missionState?.post_retrofit_safety_factor || (retroData ? retroData.post_retrofit_safety_factor : null);

  const sfComparisonData = [
    {
      stage: 'Initial Triage',
      'Safety Factor': preSF,
      status: preSF >= 1.5 ? 'PASS' : 'DEFICIT'
    },
    ...(postSF ? [{
      stage: 'Post-CFRP Retrofit',
      'Safety Factor': postSF,
      status: 'SAFE'
    }] : [])
  ];

  // 4. CFRP Ply Optimization Data
  const plyData = retroData?.ply_optimization_curve || [];

  if (!hasData) {
    return (
      <div className="bg-surface rounded-xl border border-surfaceHighlight p-6 flex flex-col items-center justify-center h-[520px] text-center shadow-xl">
        <Activity size={32} className="text-gray-600 mb-3 animate-pulse" />
        <h3 className="text-sm font-bold text-gray-300">Deterministic Engineering Physics Lab</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          Trigger the mission to observe real-time numerical solvers (NumPy mechanics & OpenSeesPy FEA).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-surfaceHighlight shadow-xl flex flex-col h-[520px] overflow-hidden">
      <div className="p-4 border-b border-surfaceHighlight bg-surfaceHighlight/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-emerald-400" />
          <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
            Deterministic Engineering Telemetry
          </h2>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-full">
          ACI 318 / ASCE 41 / ACI 440.2R
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chart 1: Moment Curvature Non-Linear Response */}
        <div className="bg-surfaceHighlight/40 p-3.5 rounded-xl border border-gray-800 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5 font-mono">
              <TrendingUp size={14} className="text-cyan-400" /> Moment vs Curvature (M-φ)
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              μ = {mcData?.ductility_ratio || '3.8'} (Ductility)
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={curvePoints} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="curvature" stroke="#71717a" tick={{ fontSize: 9 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 9 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', fontSize: 11 }}
                  formatter={(val: any) => [`${val} kNm`, 'Moment']}
                  labelFormatter={(lbl: any) => `Curvature: ${lbl} 10⁻⁴/mm`}
                />
                <Line
                  type="monotone"
                  dataKey="moment"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#38bdf8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-gray-500 font-mono flex justify-between mt-1 pt-1 border-t border-gray-800">
            <span>Yield: {mcData?.yield_moment_kNm || '—'} kNm</span>
            <span>Ultimate: {mcData?.ultimate_moment_kNm || '—'} kNm</span>
          </div>
        </div>

        {/* Chart 2: Safety Factor Transition */}
        <div className="bg-surfaceHighlight/40 p-3.5 rounded-xl border border-gray-800 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5 font-mono">
              <ShieldAlert size={14} className="text-amber-400" /> Safety Factor Transition
            </span>
            <span className="text-[10px] text-amber-400 font-mono">
              Limit: SF ≥ 1.50
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sfComparisonData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="stage" stroke="#71717a" tick={{ fontSize: 9 }} />
                <YAxis stroke="#71717a" domain={[0, 2.5]} tick={{ fontSize: 9 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', fontSize: 11 }}
                />
                <ReferenceLine y={1.50} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'SF=1.50 Threshold', fill: '#ef4444', fontSize: 9 }} />
                <Bar
                  dataKey="Safety Factor"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-gray-400 font-mono flex justify-between mt-1 pt-1 border-t border-gray-800">
            <span>Pre-SF: <strong className="text-amber-400">{preSF}</strong></span>
            <span>Post-SF: <strong className="text-green-400">{postSF || 'Pending Retrofit'}</strong></span>
          </div>
        </div>

        {/* Chart 3: Shear Demand vs Capacity */}
        <div className="bg-surfaceHighlight/40 p-3.5 rounded-xl border border-gray-800 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5 font-mono">
              <Activity size={14} className="text-emerald-400" /> ACI 318-19 Shear Capacity
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              DCR = {shearData?.demand_capacity_ratio || '0.80'}
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shearBarData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 9 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="Design Capacity (phi*Vn)" fill="#10b981" />
                <Bar dataKey="Demand (Vu)" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-gray-400 font-mono flex justify-between mt-1 pt-1 border-t border-gray-800">
            <span>Vc: {shearData?.concrete_shear_capacity_kN || 0} kN</span>
            <span>Vs: {shearData?.steel_shear_capacity_kN || 0} kN</span>
          </div>
        </div>

        {/* Chart 4: CFRP Layer Optimization Curve */}
        <div className="bg-surfaceHighlight/40 p-3.5 rounded-xl border border-gray-800 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5 font-mono">
              <Layers size={14} className="text-purple-400" /> CFRP Ply Schedule (ACI 440.2R)
            </span>
            <span className="text-[10px] text-purple-400 font-mono">
              {retroData?.required_cfrp_layers || 3} Plies Prescribed
            </span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={plyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="layers" stroke="#71717a" tick={{ fontSize: 9 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 9 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', fontSize: 11 }}
                  formatter={(val: any, name: any) => [name === 'capacity_kN' ? `${val} kN` : val, name]}
                  labelFormatter={(lbl: any) => `${lbl} CFRP Layers`}
                />
                <ReferenceLine y={1.50} stroke="#ef4444" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="safety_factor"
                  stroke="#c084fc"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#c084fc' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-gray-400 font-mono flex justify-between mt-1 pt-1 border-t border-gray-800">
            <span>Added Capacity: +{retroData?.added_design_capacity_kN || 0} kN</span>
            <span>Boost: +{retroData?.improvement_percentage || 0}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
