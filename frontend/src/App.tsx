import { useState, useEffect } from 'react';
import { ShieldAlert, Play, Download, RotateCcw, Radio } from 'lucide-react';
import type { MissionEvent, MissionState, ScenarioSummary } from './types/mission';
import { WebSocketClient } from './services/websocket';
import { api } from './services/api';

import { WhyAgenticPanel } from './components/WhyAgenticPanel';
import { IncidentPanel } from './components/IncidentPanel';
import { AgentFleet } from './components/AgentFleet';
import { AgentTimeline } from './components/AgentTimeline';
import { EngineeringDashboard } from './components/EngineeringDashboard';
import { ExecutivePanel } from './components/ExecutivePanel';
import { MissionReplay } from './components/MissionReplay';

function App() {
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('BRIDGE_PIER');
  const [missionId, setMissionId] = useState<string | null>(null);
  const [missionState, setMissionState] = useState<MissionState | null>(null);
  const [events, setEvents] = useState<MissionEvent[]>([]);
  const [visibleEvents, setVisibleEvents] = useState<MissionEvent[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [missionStatus, setMissionStatus] = useState<string>('IDLE');
  const [isReplaying, setIsReplaying] = useState<boolean>(false);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  // Load scenarios on mount
  useEffect(() => {
    api.getScenarios()
      .then(data => setScenarios(data))
      .catch(() => {
        // Fallback default scenario
        setScenarios([
          {
            id: 'BRIDGE_PIER',
            name: 'Bridge Pier P-04 (Recommended Demo)',
            structure: 'Reinforced Concrete Pier',
            location: 'San Mateo Bridge Span 14A',
            severity: 'HIGH',
            feature: 'Demonstrates Adaptive Replanning (Shear -> Flexure -> CFRP Retrofit)'
          }
        ]);
      });
  }, []);

  // Connect WebSocket
  useEffect(() => {
    const ws = new WebSocketClient((event: MissionEvent) => {
      setWsConnected(true);
      setEvents(prev => {
        const next = [...prev, event];
        if (!isReplaying) {
          setVisibleEvents(next);
        }
        return next;
      });

      setActiveAgent(event.agent);

      if (event.stage === 'COMPLETE' || event.stage === 'FAILED') {
        setMissionStatus(event.stage);
        setActiveAgent(null);
      } else {
        setMissionStatus(event.stage);
      }

      // Refresh mission state
      if (missionId) {
        api.getMission(missionId)
          .then(st => setMissionState(st))
          .catch(() => {});
      }
    });

    ws.connect();
    return () => ws.disconnect();
  }, [missionId, isReplaying]);

  // Periodic poll to ensure missionState sync
  useEffect(() => {
    if (missionId && missionStatus !== 'COMPLETE') {
      const interval = setInterval(() => {
        api.getMission(missionId)
          .then(st => {
            setMissionState(st);
            if (st.stage === 'COMPLETE') {
              setMissionStatus('COMPLETE');
              setActiveAgent(null);
            }
          })
          .catch(() => {});
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [missionId, missionStatus]);

  const triggerMission = async () => {
    try {
      setMissionStatus('PLANNING');
      setEvents([]);
      setVisibleEvents([]);
      setIsReplaying(false);
      setMissionState(null);

      const data = await api.triggerIncident(selectedScenario);
      setMissionId(data.mission_id);
    } catch (e) {
      console.error("Failed to trigger mission", e);
      setMissionStatus('FAILED');
    }
  };

  const downloadDossier = async () => {
    if (!missionId) return;
    try {
      const data = await api.getDossier(missionId);
      const blob = new Blob([data.dossier_markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GEOSENTINEL-DOSSIER-${missionId.substring(0, 8).toUpperCase()}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error("Failed to download dossier", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-gray-200 p-4 sm:p-6 font-sans selection:bg-primary/30 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Top Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between bg-surface p-5 rounded-2xl border border-surfaceHighlight shadow-2xl gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldAlert size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-black text-white tracking-tight font-sans">
                  GeoSentinel Fleet
                </h1>
                <span className="text-[10px] font-mono font-bold bg-blue-950/80 text-blue-400 border border-blue-800 px-2 py-0.5 rounded-full">
                  v1.0 • Hackathon Edition
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-mono border px-2 py-0.5 rounded-full ${
                  wsConnected
                    ? 'text-green-400 bg-green-950/60 border-green-800'
                    : 'text-gray-400 bg-gray-900 border-gray-700'
                }`}>
                  <Radio size={10} className={wsConnected ? "animate-pulse" : ""} /> {wsConnected ? 'WS LIVE' : 'WS CONNECTING'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Autonomous Multi-Agent Infrastructure Emergency Response & Deterministic Physics Verification
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {events.length > 0 && missionStatus === 'COMPLETE' && (
              <>
                <button
                  onClick={() => setIsReplaying(!isReplaying)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-surfaceHighlight hover:bg-gray-800 text-gray-200 rounded-xl text-xs font-mono font-semibold border border-gray-700 transition-colors"
                >
                  <RotateCcw size={14} className="text-primary" />
                  <span>{isReplaying ? 'Live View' : 'Replay Mission'}</span>
                </button>

                <button
                  onClick={downloadDossier}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-surfaceHighlight hover:bg-gray-800 text-gray-200 rounded-xl text-xs font-mono font-semibold border border-gray-700 transition-colors"
                >
                  <Download size={14} className="text-green-400" />
                  <span>Audit Dossier</span>
                </button>
              </>
            )}

            <button
              onClick={triggerMission}
              disabled={missionStatus === 'PLANNING' || missionStatus === 'EXECUTION' || missionStatus === 'VALIDATION' || missionStatus === 'REPLANNING' || missionStatus === 'RETROFIT'}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-lg shadow-blue-600/30 text-xs font-bold font-mono tracking-wider transition-all"
            >
              <Play size={14} />
              <span>
                {missionStatus !== 'IDLE' && missionStatus !== 'COMPLETE' && missionStatus !== 'FAILED'
                  ? 'MISSION IN PROGRESS...'
                  : 'TRIGGER ANOMALY TRIAGE'}
              </span>
            </button>
          </div>
        </header>

        {/* Hackathon Judge Highlight Banner */}
        <WhyAgenticPanel />

        {/* Target Incident Selector & Telemetry */}
        <IncidentPanel
          scenarios={scenarios}
          selectedScenario={selectedScenario}
          onSelectScenario={(id) => setSelectedScenario(id)}
          isMissionRunning={missionStatus !== 'IDLE' && missionStatus !== 'COMPLETE' && missionStatus !== 'FAILED'}
        />

        {/* Mission Replay Controls (when active) */}
        {isReplaying && events.length > 0 && (
          <MissionReplay
            events={events}
            onReplayUpdate={(vis) => setVisibleEvents(vis)}
            onExitReplay={() => {
              setIsReplaying(false);
              setVisibleEvents(events);
            }}
          />
        )}

        {/* Fleet Status Cards */}
        <AgentFleet
          activeAgent={activeAgent}
          events={visibleEvents}
          stage={missionStatus}
        />

        {/* Main Dual Grid: Timeline + Physics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column: Live Agent Timeline */}
          <AgentTimeline events={visibleEvents} />

          {/* Right Column: Engineering Physics Dashboard */}
          <EngineeringDashboard missionState={missionState} />
        </div>

        {/* Executive Decision Banner (Visible upon Completion) */}
        <ExecutivePanel
          missionState={missionState}
          onDownloadDossier={downloadDossier}
        />

      </div>
    </div>
  );
}

export default App;
