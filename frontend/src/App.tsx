import { useState, useEffect } from 'react';
import { ShieldAlert, Zap, Activity, Cpu, Clock } from 'lucide-react';
import type { MissionEvent, MissionState, ScenarioSummary } from './types/mission';
import { WebSocketClient } from './services/websocket';
import { api } from './services/api';

import { MissionPipeline } from './components/MissionPipeline';
import { HeroMetrics } from './components/HeroMetrics';
import { ReplanAlert } from './components/ReplanAlert';
import { EvidenceChain } from './components/EvidenceChain';
import { IncidentPanel } from './components/IncidentPanel';
import { MissionGraph } from './components/MissionGraph';
import { AgentFleet } from './components/AgentFleet';
import { AgentTimeline } from './components/AgentTimeline';
import { EngineeringDashboard } from './components/EngineeringDashboard';
import { ExecutivePanel } from './components/ExecutivePanel';
import { WhyAgenticSection } from './components/WhyAgenticSection';
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
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);

  // Load scenarios & check health on mount
  useEffect(() => {
    api.getScenarios()
      .then(data => setScenarios(data))
      .catch(() => {
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

    // Check health endpoint for backend & Gemini link status
    api.getHealth()
      .then(res => {
        setWsConnected(true);
        if (res.gemini_configured !== undefined) {
          setHasGeminiKey(res.gemini_configured);
        }
      })
      .catch(() => {});
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
  const toolCallsCount = visibleEvents.filter(e => e.tool).length;
  const uniqueAgentsCount = new Set(visibleEvents.map(e => e.agent)).size;
  const hasReplanned = visibleEvents.some(e => e.event_type === 'REPLANNING' || e.stage === 'REPLANNING' || e.message.toLowerCase().includes('replan'));

  return (
    <div className="min-h-screen bg-[#05060a] bg-grid-pattern text-gray-200 selection:bg-cyan-500/30 selection:text-white font-sans antialiased">

      {/* ═══════════════ TACTICAL COMMAND HEADER (NASA / JPL MISSION CONTROL) ═══════════════ */}
      <header className="border-b border-white/10 bg-[#07080f]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Brand & System Title */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 text-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-white/20">
                  <ShieldAlert size={22} />
                </div>
                {isMissionRunning && (
                  <span className="absolute -top-1 -right-1 w-3 h-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base font-black text-white font-mono tracking-tight">
                    GEOSENTINEL FLEET
                  </h1>
                  <span className="text-[9px] font-mono font-bold bg-white/[0.04] text-gray-300 border border-white/10 px-2 py-0.5 rounded">
                    AUTONOMOUS INFRASTRUCTURE RESPONSE
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono">
                  Google All Things Agentic • 2026 Hackathon
                </div>
              </div>
            </div>

            {/* Status Strip: System Online | Gemini Link Active | Physics Engine Ready | Validation Gate Armed */}
            <div className="flex items-center gap-2 font-mono text-[10px] flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10">
                <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className={wsConnected ? 'text-emerald-300 font-bold' : 'text-amber-300'}>
                  {wsConnected ? 'SYSTEM ONLINE' : 'CONNECTING...'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10">
                <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className={hasGeminiKey ? 'text-cyan-300 font-bold' : 'text-amber-300'}>
                  {hasGeminiKey ? 'GEMINI LINK ACTIVE' : 'FALLBACK MODE'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 hidden sm:flex">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-blue-300 font-bold">PHYSICS ENGINE READY</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 hidden sm:flex">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-purple-300 font-bold">VALIDATION GATE ARMED</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800 text-red-300 font-bold">
                <span>TARGET: PIER P-04</span>
                <span className="text-red-400 font-black">[HIGH]</span>
              </div>
            </div>
          </div>

          {/* Operational Metrics Bar (Live During Execution) */}
          {(visibleEvents.length > 0 || isMissionRunning) && (
            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center gap-4 text-[10px] font-mono text-gray-400 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-cyan-400" />
                <span>Elapsed: <strong className="text-white">{visibleEvents[visibleEvents.length - 1]?.elapsed_seconds?.toFixed(1) || '0.0'}s</strong></span>
              </div>
              <span className="text-gray-700">|</span>
              <div className="flex items-center gap-1.5">
                <Cpu size={11} className="text-blue-400" />
                <span>Active Swarm: <strong className="text-cyan-300">{uniqueAgentsCount}/5 Agents</strong></span>
              </div>
              <span className="text-gray-700">|</span>
              <div className="flex items-center gap-1.5">
                <Zap size={11} className="text-amber-400" />
                <span>Tool Executions: <strong className="text-white">{toolCallsCount}</strong></span>
              </div>
              <span className="text-gray-700">|</span>
              <div className="flex items-center gap-1.5">
                <Activity size={11} className={isMissionRunning ? "text-amber-400 animate-pulse" : "text-emerald-400"} />
                <span>Phase: <strong className={isMissionRunning ? "text-amber-300 uppercase" : "text-emerald-400 uppercase"}>{missionStatus}</strong></span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ═══════════════ MAIN MISSION CONTROL VIEWPORT ═══════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* 1. Above-the-Fold Hero Emergency Incident & Dispatch Control Panel */}
        <IncidentPanel
          scenarios={scenarios}
          selectedScenario={selectedScenario}
          onSelectScenario={(id) => setSelectedScenario(id)}
          isMissionRunning={isMissionRunning}
          onTriggerMission={triggerMission}
          missionStatus={missionStatus}
        />

        {/* 2. Live Autonomous Mission Pipeline (The 7-Stage Horizontal Timeline) */}
        <MissionPipeline
          stage={missionStatus}
          activeAgent={activeAgent}
          eventsCount={visibleEvents.length}
        />

        {/* 3. Hero Engineering Metrics Transition (0.94 -> 1.74) */}
        <HeroMetrics
          missionState={missionState}
          stage={missionStatus}
        />

        {/* 4. Validation Override & Replan Moment Alert (When Triggered) */}
        <ReplanAlert
          events={visibleEvents}
          stage={missionStatus}
        />

        {/* 5. 3-Layer Evidence Chain (Reasoning -> Physics -> Validation) */}
        <EvidenceChain
          stage={missionStatus}
          hasReplanned={hasReplanned}
        />

        {/* 6. Live Swarm Topology & Control Graph (Centerpiece) */}
        <MissionGraph
          activeAgent={activeAgent}
          events={visibleEvents}
          stage={missionStatus}
          missionState={missionState}
        />

        {/* 7. Mission Replay Controls (When Activated) */}
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

        {/* 8. Autonomous Specialist Fleet Status Cards */}
        <AgentFleet
          activeAgent={activeAgent}
          events={visibleEvents}
          stage={missionStatus}
        />

        {/* 9. Main Dual Grid: Operational Swarm Terminal + Deterministic Physics Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          {/* Left Column: Live Terminal Stream with Severity Tags */}
          <AgentTimeline events={visibleEvents} />

          {/* Right Column: Deterministic Physics Workstation */}
          <EngineeringDashboard missionState={missionState} />
        </div>

        {/* 10. Concluded Executive Remediation Directive & Audit Dossier Package */}
        <ExecutivePanel
          missionState={missionState}
          onDownloadDossier={downloadDossier}
          onReplayMission={() => setIsReplaying(!isReplaying)}
          isReplaying={isReplaying}
        />

        {/* 11. Why GeoSentinel Is Truly Agentic (7-Point Breakdown for Judges) */}
        <WhyAgenticSection />
      </main>

      {/* ═══════════════ OPERATIONAL FOOTER ═══════════════ */}
      <footer className="border-t border-white/10 bg-[#07080f]/90 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-gray-500">
          <div>
            <span className="text-gray-300 font-bold">GEOSENTINEL FLEET</span> • Autonomous Infrastructure Swarm • Google All Things Agentic Hackathon
          </div>
          <div className="flex items-center gap-3">
            <span>Gemini 2.5 Pro</span>
            <span>•</span>
            <span>NumPy</span>
            <span>•</span>
            <span>OpenSeesPy</span>
            <span>•</span>
            <span>ACI 318 / ASCE 41 / ACI 440.2R</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
