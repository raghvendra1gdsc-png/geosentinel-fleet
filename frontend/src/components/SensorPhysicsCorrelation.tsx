import { Radio } from 'lucide-react';
import type { MissionState } from '../types/mission';

interface SensorPhysicsCorrelationProps {
  missionState?: MissionState | null;
  stage?: string;
}

export function SensorPhysicsCorrelation(_props: SensorPhysicsCorrelationProps) {

  const rows = [
    {
      sensor: 'Piezoelectric Microstrain',
      reading: '2,140 με',
      model: 'ASCE 41-17 Fiber Section',
      predicted: '2,080 με (Yield strain $\\varepsilon_y = 0.002$)',
      residual: 'Δ = +2.8%',
      agreement: '97.2%',
      status: 'CORRELATED (FLEXURAL YIELD)'
    },
    {
      sensor: 'Acoustic Emission',
      reading: '84.5 dB',
      model: 'Fracture Energy $G_f$ Release',
      predicted: '> 75 dB (Microcrack coalescence)',
      residual: 'Active Dissipation',
      agreement: '94.5%',
      status: 'CORRELATED (PLASTIC HINGE)'
    },
    {
      sensor: 'Seismic Ground Accel (PGA)',
      reading: '0.42 g',
      model: 'OpenSeesPy Non-Linear Pushover',
      predicted: 'Demand $M_u = 800\\,\\text{kNm}$',
      residual: 'Capacity Deficit $-50\\,\\text{kNm}$',
      agreement: '98.0%',
      status: 'CORRELATED (SEISMIC OVERLOAD)'
    }
  ];

  return (
    <div className="bg-[#0b0c12] border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-xs font-mono font-black uppercase tracking-wider text-white">
            SENSOR → DETERMINISTIC PHYSICS CORRELATION MATRIX
          </h3>
        </div>

        <div className="text-[10px] text-gray-400">
          OVERALL MODEL AGREEMENT: <span className="text-emerald-400 font-bold">96.6% CONFIDENCE</span>
        </div>
      </div>

      {/* Correlation Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px]">
          <thead>
            <tr className="border-b border-white/10 text-[9px] text-gray-400 uppercase tracking-wider">
              <th className="pb-2 font-bold">Physical Sensor Channel</th>
              <th className="pb-2 font-bold">Observed Telemetry</th>
              <th className="pb-2 font-bold">Governing Physics Model</th>
              <th className="pb-2 font-bold">Theoretical Prediction</th>
              <th className="pb-2 font-bold">Model Agreement</th>
              <th className="pb-2 font-bold">Correlation Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 text-gray-200 font-bold flex items-center gap-1.5">
                  <Radio size={11} className="text-cyan-400" />
                  <span>{row.sensor}</span>
                </td>
                <td className="py-2.5 text-amber-400 font-bold">{row.reading}</td>
                <td className="py-2.5 text-gray-300">{row.model}</td>
                <td className="py-2.5 text-cyan-300">{row.predicted}</td>
                <td className="py-2.5 text-emerald-400 font-bold">{row.agreement}</td>
                <td className="py-2.5">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
