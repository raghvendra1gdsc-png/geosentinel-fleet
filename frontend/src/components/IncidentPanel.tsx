import { MapPin, Radio, Sparkles, Sliders } from 'lucide-react';
import type { ScenarioSummary } from '../types/mission';

interface IncidentPanelProps {
  scenarios: ScenarioSummary[];
  selectedScenario: string;
  onSelectScenario: (id: string) => void;
  isMissionRunning: boolean;
}

export function IncidentPanel({
  scenarios,
  selectedScenario,
  onSelectScenario,
  isMissionRunning
}: IncidentPanelProps) {
  const current = scenarios.find(s => s.id === selectedScenario) || scenarios[0];

  return (
    <div className="bg-surface rounded-xl p-4 border border-surfaceHighlight shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-primary" />
          <h2 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
            Incident Telemetry & Scenario Dispatch
          </h2>
        </div>

        {/* Scenario selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 font-mono">Select Target:</label>
          <select
            value={selectedScenario}
            onChange={(e) => onSelectScenario(e.target.value)}
            disabled={isMissionRunning}
            className="bg-surfaceHighlight border border-gray-700 text-white text-xs rounded-lg px-3 py-1.5 font-sans focus:ring-1 focus:ring-primary focus:outline-none disabled:opacity-50"
          >
            {scenarios.map((sc) => (
              <option key={sc.id} value={sc.id}>
                {sc.id === 'BRIDGE_PIER' ? '🌟 [DEMO] ' : ''}{sc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {current && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Target Summary */}
          <div className="bg-surfaceHighlight/50 p-3 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-mono text-gray-400">Structure</span>
              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                current.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' :
                current.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-blue-950 text-blue-400 border border-blue-800'
              }`}>
                {current.severity} SEVERITY
              </span>
            </div>
            <div className="text-sm font-bold text-gray-100">{current.structure}</div>
            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-primary shrink-0" />
              <span className="truncate">{current.location}</span>
            </div>
          </div>

          {/* Card 2: Demonstration Workflow Feature */}
          <div className="bg-surfaceHighlight/50 p-3 rounded-lg border border-gray-800">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-primary font-bold mb-1">
              <Sparkles size={12} />
              <span>Demonstration Workflow</span>
            </div>
            <div className="text-xs text-gray-300 leading-relaxed font-sans">
              {current.feature}
            </div>
          </div>

          {/* Card 3: Sensory Channel Status */}
          <div className="bg-surfaceHighlight/50 p-3 rounded-lg border border-gray-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] uppercase font-mono text-gray-400">
              <span>IoT Sensory Network</span>
              <span className="flex items-center gap-1 text-green-400">
                <Radio size={10} className="animate-pulse" /> ONLINE
              </span>
            </div>
            <div className="text-xs text-gray-300 font-mono mt-1 space-y-0.5">
              <div>• Piezoelectric Strain: <span className="text-amber-400">2140 με</span></div>
              <div>• Acoustic Emission: <span className="text-red-400">84.5 dB (Cracking)</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
