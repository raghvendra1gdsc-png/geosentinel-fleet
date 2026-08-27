import { useState, useEffect } from 'react';
import { ShieldAlert, Download, RotateCcw, Radio, Zap, Globe, Activity } from 'lucide-react';
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

  const isMissionRunning = missionStatus !== 'IDLE' && missionStatus !== 'COMPLETE' && missionStatus !== 'FAILED';

  return (
    <div className="min-h-screen bg-[#050507] bg-grid-pattern text-gray-200 selection:bg-primary/30 selection:text-white">

      {/* ═══════════════ HERO HEADER ═══════════════ */}
      <header className="relative overflow-hidden border-b border-white/5">
        {/* Ambient gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Brand */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-white/10">
                  <ShieldAlert size={28} />
                </div>
                {/* Pulse ring */}
                {isMissionRunning && (
                  <span className="absolute -top-1 -right-1 w-4 h-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500" />
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-black text-white tracking-tight">
                    GeoSentinel Fleet
                  </h1>
                  <span className="text-[10px] font-mono font-bold bg-gradient-to-r from-blue-950/80 to-indigo-950/80 text-blue-300 border border-blue-700/50 px-2.5 py-0.5 rounded-full">
                    v1.0 • Hackathon
                  </span>
                  <span className={`flex items-center gap-1.5 text-[10px] font-mono font-semibold border px-2.5 py-0.5 rounded-full transition-all ${
                    wsConnected
                      ? 'text-emerald-300 bg-emerald-950/60 border-emerald-700/50 glow-green'
                      : 'text-gray-400 bg-gray-900/60 border-gray-700'
                  }`}>
                    <Radio size={10} className={wsConnected ? "animate-pulse" : ""} />
                    {wsConnected ? 'WS LIVE' : 'CONNECTING'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 max-w-lg leading-relaxed">
                  Autonomous Multi-Agent Infrastructure Emergency Response — Powered by <span className="text-blue-400 font-semibold">Google Gemini 2.5 Pro</span>
                </p>
              </div>
            </div>

            {/* Right: Action buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              {events.length > 0 && missionStatus === 'COMPLETE' && (
                <>
                  <button
                    onClick={() => setIsReplaying(!isReplaying)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl text-xs font-mono font-semibold border border-white/10 transition-all hover:border-white/20"
                  >
                    <RotateCcw size={14} className="text-cyan-400" />
                    <span>{isReplaying ? 'Live View' : 'Replay Mission'}</span>
                  </button>

                  <button
                    onClick={downloadDossier}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 rounded-xl text-xs font-mono font-semibold border border-white/10 transition-all hover:border-white/20"
                  >
                    <Download size={14} className="text-green-400" />
                    <span>Audit Dossier</span>
                  </button>
                </>
              )}

              <button
                onClick={triggerMission}
                disabled={isMissionRunning}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-lg shadow-blue-600/25 text-xs font-bold font-mono tracking-wider transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isMissionRunning ? (
                  <Activity size={14} className="animate-spin-slow" />
                ) : (
                  <Zap size={14} className="group-hover:animate-pulse" />
                )}
                <span>
                  {isMissionRunning
                    ? 'MISSION IN PROGRESS...'
                    : 'TRIGGER ANOMALY TRIAGE'}
                </span>
              </button>
            </div>
          </div>

          {/* Live Stats Bar (during or after mission) */}
          {(events.length > 0 || isMissionRunning) && (
            <div className="mt-4 flex items-center gap-4 text-[10px] font-mono text-gray-400">
              <div className="flex items-center gap-1.5">
                <Globe size={11} className="text-blue-400" />
                <span>{events.length} events streamed</span>
              </div>
              <span className="text-gray-700">|</span>
              <div className="flex items-center gap-1.5">
                <Activity size={11} className={isMissionRunning ? "text-amber-400 animate-pulse" : "text-emerald-400"} />
                <span className={isMissionRunning ? "text-amber-400" : "text-emerald-400"}>
                  {missionStatus}
                </span>
              </div>
              {missionState?.initial_safety_factor && (
                <>
                  <span className="text-gray-700">|</span>
                  <span>Pre-SF: <strong className="text-amber-400">{missionState.initial_safety_factor}</strong></span>
                  {missionState.post_retrofit_safety_factor && (
                    <span>→ Post-SF: <strong className="text-emerald-400">{missionState.post_retrofit_safety_factor}</strong></span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Hackathon Judge Highlight Banner */}
        <WhyAgenticPanel />

        {/* Target Incident Selector & Telemetry */}
        <IncidentPanel
          scenarios={scenarios}
          selectedScenario={selectedScenario}
          onSelectScenario={(id) => setSelectedScenario(id)}
          isMissionRunning={isMissionRunning}
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
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-[10px] font-mono text-gray-600">
          <span>GeoSentinel Fleet v1.0 • Google All Things Agentic Hackathon 2026</span>
          <span>Gemini 2.5 Pro • NumPy • OpenSeesPy • ACI 318 / ASCE 41 / ACI 440.2R</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
