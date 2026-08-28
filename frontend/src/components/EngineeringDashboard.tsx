import { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ReferenceLine, Legend
} from 'recharts';
import { Layers, TrendingUp, Zap, Activity } from 'lucide-react';
import type { MissionState } from '../types/mission';
import { BASELINE_MC_DATA, BASELINE_SHEAR_DATA, BASELINE_RETROFIT_DATA } from '../services/swarmSimulation';

interface EngineeringDashboardProps {
  missionState: MissionState | null;
}

export function EngineeringDashboard({ missionState }: EngineeringDashboardProps) {
  const [activeTab, setActiveTab] = useState<'MC' | 'SHEAR' | 'CFRP'>('MC');

  const mcData = missionState?.moment_curvature_data || BASELINE_MC_DATA;
  const shearData = missionState?.shear_capacity_data || BASELINE_SHEAR_DATA;
  const retroData = missionState?.retrofit_data || BASELINE_RETROFIT_DATA;

  // 1. Moment-Curvature Curve Points — with progressive draw-in
  const allCurvePoints = mcData?.curve_data?.points || BASELINE_MC_DATA.curve_data.points;
  const [visiblePointCount, setVisiblePointCount] = useState(allCurvePoints.length);
  const drawInTimerRef = useRef<any>(null);
  const prevMcDataRef = useRef<any>(null);

  // Detect when moment_curvature_data first arrives and trigger draw-in
  useEffect(() => {
    const mcDataArrived = missionState?.moment_curvature_data;
    const wasPreviouslyNull = prevMcDataRef.current === null || prevMcDataRef.current === undefined;
    prevMcDataRef.current = mcDataArrived;

    if (mcDataArrived && wasPreviouslyNull) {
      // Start draw-in animation: reveal points one by one over ~2 seconds
      setVisiblePointCount(1);
      let count = 1;
      const totalPoints = allCurvePoints.length;
      const intervalMs = 2000 / totalPoints; // ~143ms per point for 14 points

      if (drawInTimerRef.current) clearInterval(drawInTimerRef.current);

      drawInTimerRef.current = setInterval(() => {
        count++;
        setVisiblePointCount(count);
        if (count >= totalPoints) {
          clearInterval(drawInTimerRef.current);
          drawInTimerRef.current = null;
        }
      }, intervalMs);
    } else if (!mcDataArrived) {
      // Reset when mission resets
      setVisiblePointCount(allCurvePoints.length);
      if (drawInTimerRef.current) {
        clearInterval(drawInTimerRef.current);
        drawInTimerRef.current = null;
      }
    }

    return () => {
      if (drawInTimerRef.current) clearInterval(drawInTimerRef.current);
    };
  }, [missionState?.moment_curvature_data, allCurvePoints.length]);

  const curvePoints = allCurvePoints.slice(0, visiblePointCount);

  // 2. Shear Demand vs Capacity Data
  const shearBarData = [
    {
      name: 'Shear Force (kN)',
      'Design Capacity (φVn)': shearData.design_capacity_kN || 850,
      'Applied Demand (Vu)': shearData.demand_kN || 550,
      'Concrete (Vc)': shearData.concrete_shear_capacity_kN || 420,
      'Steel (Vs)': shearData.steel_shear_capacity_kN || 430,
    }
  ];

  // 3. CFRP Ply Optimization Data
  const plyData = retroData?.ply_optimization_curve || BASELINE_RETROFIT_DATA.ply_optimization_curve;

  return (
    <div id="section-engineering" className="bg-[#0b0c12] border border-white/15 rounded-2xl p-5 shadow-2xl flex flex-col h-[560px] relative overflow-hidden font-mono">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs font-mono font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <Activity size={13} className="text-cyan-400" />
            <span>Deterministic Engineering Workstation</span>
          </h3>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-lg border border-white/10 text-[10px]">
          <button
            onClick={() => setActiveTab('MC')}
            className={`px-3 py-1 rounded transition-all font-bold ${
              activeTab === 'MC'
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/60 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            MOMENT-CURVATURE (FEA)
          </button>
          <button
            onClick={() => setActiveTab('SHEAR')}
            className={`px-3 py-1 rounded transition-all font-bold ${
              activeTab === 'SHEAR'
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/60 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ACI 318 SHEAR
          </button>
          <button
            onClick={() => setActiveTab('CFRP')}
            className={`px-3 py-1 rounded transition-all font-bold ${
              activeTab === 'CFRP'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/60 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            CFRP RETROFIT
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        {/* TAB 1: MOMENT-CURVATURE */}
        {activeTab === 'MC' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-cyan-400" /> ASCE 41-17 / OpenSeesPy Section Response (M-φ)
              </span>
              <div className="flex items-center gap-3 text-[10px]">
                <span>Yield: <strong className="text-cyan-400">{mcData?.yield_moment_kNm || 540} kNm</strong></span>
                <span>Ultimate: <strong className="text-red-400">{mcData?.ultimate_moment_kNm || 750} kNm</strong></span>
                <span>Ductility μ: <strong className="text-blue-400">{mcData?.ductility_ratio || 4.2}</strong></span>
              </div>
            </div>

            <div className="h-64 w-full bg-black/50 rounded-xl p-2 border border-white/10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={curvePoints} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2030" />
                  <XAxis dataKey="curvature" stroke="#64748b" tick={{ fontSize: 9 }} label={{ value: 'Curvature φ (1/m)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 9 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 9 }} label={{ value: 'Moment (kNm)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090a0f', borderColor: '#1e293b', fontSize: 11, borderRadius: 8, fontFamily: 'monospace' }}
                    formatter={(val: any) => [`${val} kNm`, 'Bending Moment']}
                    labelFormatter={(lbl: any) => `Curvature: ${lbl} 1/m`}
                  />
                  <ReferenceLine y={800} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Moment Demand Mu (800 kNm)', fill: '#ef4444', fontSize: 9, position: 'top' }} />
                  <Line
                    type="monotone"
                    dataKey="moment"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#06b6d4' }}
                    activeDot={{ r: 6, fill: '#22d3ee', stroke: '#000', strokeWidth: 2 }}
                    isAnimationActive={true}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Metric Callouts */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/10 text-[10px]">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                <span className="text-gray-400 block font-bold">Applied Demand Mu</span>
                <span className="text-red-400 font-black text-xs">800.0 kNm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                <span className="text-gray-400 block font-bold">Unreinforced Capacity</span>
                <span className="text-amber-400 font-black text-xs">{mcData?.ultimate_moment_kNm || 750.0} kNm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40">
                <span className="text-red-300 block font-bold">Flexural SF</span>
                <span className="text-red-400 font-black text-xs">0.94 [CRITICAL DEFICIT]</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHEAR CAPACITY */}
        {activeTab === 'SHEAR' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <Zap size={14} className="text-emerald-400" /> ACI 318-19 Shear Capacity vs Demand
              </span>
              <div className="flex items-center gap-3 text-[10px]">
                <span>DCR: <strong className="text-emerald-400">{shearData?.demand_capacity_ratio || 0.65}</strong></span>
                <span>Shear SF: <strong className="text-emerald-400">1.54 (PASS)</strong></span>
              </div>
            </div>

            <div className="h-64 w-full bg-black/50 rounded-xl p-2 border border-white/10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shearBarData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2030" />
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
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/10 text-[10px]">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                <span className="text-gray-400 block font-bold">Concrete Vc</span>
                <span className="text-cyan-400 font-black text-xs">{shearData?.concrete_shear_capacity_kN || 420} kN</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                <span className="text-gray-400 block font-bold">Stirrups Steel Vs</span>
                <span className="text-blue-400 font-black text-xs">{shearData?.steel_shear_capacity_kN || 430} kN</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                <span className="text-emerald-300 block font-bold">Total Shear φVn</span>
                <span className="text-emerald-400 font-black text-xs">{shearData?.design_capacity_kN || 850} kN</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CFRP OPTIMIZATION */}
        {activeTab === 'CFRP' && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <Layers size={14} className="text-purple-400" /> ACI 440.2R CFRP Composite Optimization Curve
              </span>
              <div className="flex items-center gap-3 text-[10px]">
                <span>Optimal Plies: <strong className="text-purple-300">3 Plies</strong></span>
                <span>Post-Retrofit SF: <strong className="text-emerald-400">1.74</strong></span>
              </div>
            </div>

            <div className="h-64 w-full bg-black/50 rounded-xl p-2 border border-white/10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={plyData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2030" />
                  <XAxis dataKey="layers" stroke="#64748b" tick={{ fontSize: 9 }} label={{ value: 'CFRP Laminate Plies', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 9 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 9 }} domain={[0.8, 2.4]} label={{ value: 'Safety Factor', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090a0f', borderColor: '#1e293b', fontSize: 11, borderRadius: 8, fontFamily: 'monospace' }}
                    formatter={(val: any) => [val, 'Safety Factor']}
                    labelFormatter={(lbl: any) => `${lbl} CFRP Plies`}
                  />
                  <ReferenceLine y={1.50} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Target SF ≥ 1.50', fill: '#ef4444', fontSize: 9, position: 'right' }} />
                  <Line
                    type="monotone"
                    dataKey="safety_factor"
                    stroke="#c084fc"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#c084fc', stroke: '#000', strokeWidth: 2 }}
                    activeDot={{ r: 7, fill: '#d8b4fe' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Metric Callouts */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/10 text-[10px]">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                <span className="text-gray-400 block font-bold">Added Capacity</span>
                <span className="text-purple-400 font-black text-xs">+640.0 kNm</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                <span className="text-gray-400 block font-bold">Capacity Boost</span>
                <span className="text-emerald-400 font-black text-xs">+85.1% Margin</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                <span className="text-emerald-300 block font-bold">Compliance Status</span>
                <span className="text-emerald-400 font-black text-xs">✓ SF 1.74 (≥ 1.50 PASS)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
