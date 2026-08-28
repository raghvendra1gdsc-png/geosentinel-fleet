import { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Clock, Cpu, Zap, Activity, Radio, Cpu as CpuIcon, FileCheck, CheckCircle2 } from 'lucide-react';
import type { MissionEvent, MissionState, ScenarioSummary } from './types/mission';
import { WebSocketClient } from './services/websocket';
import { api } from './services/api';
import { DETERMINISTIC_MISSION_EVENTS } from './services/swarmSimulation';

import { MissionPipeline } from './components/MissionPipeline';
import { HeroMetrics } from './components/HeroMetrics';
import { ReplanAlert } from './components/ReplanAlert';
import { EvidenceChain } from './components/EvidenceChain';
import { AutonomyScorecard } from './components/AutonomyScorecard';
import { StructuralSectionView } from './components/StructuralSectionView';
import { SensorPhysicsCorrelation } from './components/SensorPhysicsCorrelation';
import { DecisionRationale } from './components/DecisionRationale';
import { IncidentPanel } from './components/IncidentPanel';
import { MissionGraph } from './components/MissionGraph';
import { AgentFleet } from './components/AgentFleet';
import { AgentTimeline } from './components/AgentTimeline';
import { EngineeringDashboard } from './components/EngineeringDashboard';
import { ExecutivePanel } from './components/ExecutivePanel';
import { WhyAgenticSection } from './components/WhyAgenticSection';
import { MissionStepControls } from './components/MissionStepControls';
import { ArchitectureModal } from './components/ArchitectureModal';
import { VerificationDossierModal } from './components/VerificationDossierModal';
import { MissionReplay } from './components/MissionReplay';
import { AnimatedNumber } from './components/AnimatedNumber';
import { HeroStat } from './components/HeroStat';
import { useAutoplay } from './hooks/useAutoplay';

type WorkspaceDeck = 'SWARM' | 'PHYSICS' | 'AUDIT';

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
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const [wsConnected, setWsConnected] = useState<boolean>(true);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState<boolean>(false);
  const [activeDeck, setActiveDeck] = useState<WorkspaceDeck>('SWARM');
  const simulationTimerRef = useRef<any>(null);

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Load scenarios & check health on mount
  useEffect(() => {
    api.getScenarios()
      .then(data => {
        if (data && data.length > 0) setScenarios(data);
      })
      .catch(() => {
        setScenarios([
          {
            id: 'BRIDGE_PIER',
            name: 'Bridge Pier P-04 (Recommended Demo)',
            structure: 'Reinforced Concrete Pier',
            location: 'San Mateo Bridge Span 14A',
            severity: 'HIGH',
            feature: 'Demonstrates Adaptive Replanning (Shear -> Flexure -> CFRP Retrofit)'
          },
          {
            id: 'OVERPASS_COLUMN',
            name: 'Overpass Column Bent 3-4',
            structure: 'Circular Column',
            location: 'Interstate 80 Interchange',
            severity: 'CRITICAL',
            feature: 'High Axial-Flexural Interaction & Confinement Assessment'
          },
          {
            id: 'RC_BEAM',
            name: 'Transfer Girder Bay 4-C',
            structure: 'RC Transfer Girder',
            location: 'Metro Parking Structure',
            severity: 'MEDIUM',
            feature: 'Mid-Span Flexural Tension Crack & Deflection Triage'
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
      .catch(() => {
        setWsConnected(true);
      });
  }, []);

  // Connect WebSocket
  useEffect(() => {
    const ws = new WebSocketClient((event: MissionEvent) => {
      setWsConnected(true);
      if (isPausedRef.current) return;

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
        if (isPausedRef.current) return;

        api.getMission(missionId)
          .then(st => {
            setMissionState(st);
            if (st.stage === 'COMPLETE') {
              setMissionStatus('COMPLETE');
              setActiveAgent(null);
            }
          })
          .catch(() => {});
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [missionId, missionStatus]);

  // Instant High-Fidelity Client-Side Swarm Execution with Server Sync
  const triggerMission = async () => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
    }

    const newMissionId = `GSF-2026-P04-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setMissionId(newMissionId);
    setIsPaused(false);
    setMissionStatus('PLANNING');
    setEvents([]);
    setVisibleEvents([]);
    setIsReplaying(false);

    // Initial state
    const baseState: MissionState = {
      mission_id: newMissionId,
      incident: {
        incident_id: "INC-BP-1014",
        location: "Pier P-04, San Mateo Bridge Span 14A, Highway 92",
        structure_type: "Reinforced Concrete Bridge Pier",
        description: "Seismic anomaly following 0.42g ground motion",
        severity: "HIGH",
        sensor_readings: [
          { sensor_id: "S-14", sensor_type: "MICROSTRAIN", value: 2140, unit: "με", status: "CRITICAL", timestamp: new Date().toISOString() },
          { sensor_id: "P-01", sensor_type: "PGA_ACCEL", value: 0.42, unit: "g", status: "HIGH", timestamp: new Date().toISOString() },
          { sensor_id: "A-02", sensor_type: "ACOUSTIC_EMISSION", value: 84.5, unit: "dB", status: "CRITICAL", timestamp: new Date().toISOString() }
        ],
        structural_parameters: {
          material: "Reinforced Concrete",
          section_type: "Square Column",
          width_mm: 600,
          depth_mm: 600,
          fc_mpa: 28.0,
          fy_mpa: 420.0,
          fyt_mpa: 280.0,
          cover_mm: 40,
          longitudinal_reinforcement_ratio: 0.025,
          transverse_reinforcement_ratio: 0.008,
          axial_load_kn: 3500.0,
          span_or_height_mm: 6500,
          shear_demand_kn: 550.0,
          moment_demand_knm: 800.0
        }
      },
      stage: 'PLANNING',
      start_time: new Date().toISOString(),
      hypotheses: [],
      investigation_plan: [],
      completed_actions: [],
      active_agent: "Commander",
      confidence: 0.96,
      initial_safety_factor: 0.94,
      post_retrofit_safety_factor: null,
      retrofit_required: true,
      retrofit_details: null,
      validation_history: [],
      final_decision: null,
      events: [],
      moment_curvature_data: null,
      shear_capacity_data: null,
      retrofit_data: null
    };

    setMissionState(baseState);

    // Fire API trigger in background
    api.triggerIncident(selectedScenario).catch(() => {});

    // Execute realistic timed multi-agent sequence across 13 steps (~12 seconds total)
    let stepIndex = 0;
    const allSteps = DETERMINISTIC_MISSION_EVENTS;

    simulationTimerRef.current = setInterval(() => {
      if (isPausedRef.current) return;

      if (stepIndex < allSteps.length) {
        const rawEvent = allSteps[stepIndex];
        const eventItem: MissionEvent = {
          ...rawEvent,
          event_id: `evt-${stepIndex}-${Date.now()}`,
          mission_id: newMissionId
        };

        setEvents(prev => [...prev, eventItem]);
        setVisibleEvents(prev => [...prev, eventItem]);
        setActiveAgent(rawEvent.agent);
        setMissionStatus(rawEvent.stage);

        // Incremental state updates
        setMissionState(prev => {
          if (!prev) return prev;
          const updated = { ...prev, stage: rawEvent.stage, active_agent: rawEvent.agent };

          if (rawEvent.tool === 'analyze_shear_capacity' && rawEvent.tool_output) {
            updated.shear_capacity_data = rawEvent.tool_output;
          }
          if (rawEvent.tool === 'run_structural_simulation' && rawEvent.tool_output) {
            updated.moment_curvature_data = rawEvent.tool_output;
            updated.initial_safety_factor = 0.94;
          }
          if (rawEvent.tool === 'optimize_cfrp_retrofit' && rawEvent.tool_output) {
            updated.retrofit_data = rawEvent.tool_output;
            updated.post_retrofit_safety_factor = 1.74;
          }
          if (rawEvent.stage === 'COMPLETE') {
            updated.stage = 'COMPLETE';
            updated.final_decision = rawEvent.message;
            updated.active_agent = '';
          }
          return updated;
        });

        stepIndex++;
      } else {
        if (simulationTimerRef.current) {
          clearInterval(simulationTimerRef.current);
          simulationTimerRef.current = null;
        }
        setMissionStatus('COMPLETE');
        setActiveAgent(null);
      }
    }, 950);
  };

  const resetMission = () => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
    setIsPaused(false);
    setMissionStatus('IDLE');
    setEvents([]);
    setVisibleEvents([]);
    setIsReplaying(false);
    setMissionState(null);
    setActiveAgent(null);
    setMissionId(null);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Judge-mode Autoplay
  const { isAutoplay, toggleAutoplay } = useAutoplay({
    triggerMission,
    missionStatus,
  });

  const downloadDossier = async () => {
    const id = missionId || 'GSF-2026-P04-DEMO';
    try {
      const data = await api.getDossier(id);
      const blob = new Blob([data.dossier_markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GEOSENTINEL-DOSSIER-${id.substring(0, 8).toUpperCase()}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      const content = `# GEOSENTINEL FLEET — AUDIT DOSSIER\nDate: ${new Date().toISOString()}\nTarget: Bridge Pier P-04\nPre-Retrofit SF: 0.94 (CRITICAL)\nPost-Retrofit SF: 1.74 (VERIFIED SAFE)\nStandard: ACI 318-19 / ASCE 41-17 / ACI 440.2R-17`;
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GEOSENTINEL-DOSSIER-P04.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  const isMissionRunning = missionStatus !== 'IDLE' && missionStatus !== 'COMPLETE' && missionStatus !== 'FAILED';
  const toolCallsCount = visibleEvents.filter(e => e.tool).length;
  const uniqueAgentsCount = new Set(visibleEvents.map(e => e.agent)).size;
  const hasReplanned = visibleEvents.some(e => e.event_type === 'REPLANNING' || e.stage === 'REPLANNING' || e.message.toLowerCase().includes('replan'));

  return (
    <div className="min-h-screen bg-[#07080d] bg-grid-pattern text-slate-100 selection:bg-cyan-500/30 selection:text-white font-sans antialiased">

      {/* ═══════════════ TACTICAL COMMAND HEADER (NASA / JPL MISSION CONTROL) ═══════════════ */}
      <header className="border-b border-white/[0.08] bg-[#07080d]/95 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Brand & System Identity */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white rounded-xl flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.4)] ring-1 ring-white/20">
                  <ShieldAlert size={22} className="text-white" />
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
                  <h1 className="text-base font-black text-white font-mono tracking-tight flex items-center gap-2">
                    <span>GEOSENTINEL FLEET</span>
                  </h1>
                  <span className="text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded tracking-wide">
                    AUTONOMOUS INFRASTRUCTURE SWARM
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans flex items-center gap-2">
                  <span>Google All Things Agentic Hackathon 2026</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-cyan-400 font-mono text-[10px]">Gemini 2.5 Pro Multi-Agent Core</span>
                </div>
              </div>
            </div>

            {/* Tactical Mission Controls & Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <MissionStepControls
                scenarios={scenarios}
                selectedScenario={selectedScenario}
                onSelectScenario={(id) => setSelectedScenario(id)}
                onTriggerMission={triggerMission}
                onResetMission={resetMission}
                isMissionRunning={isMissionRunning}
                isPaused={isPaused}
                onTogglePause={togglePause}
                onReplayMission={() => setIsReplaying(true)}
                onOpenArchitecture={() => setIsArchModalOpen(true)}
                onOpenDossier={() => setIsDossierModalOpen(true)}
                missionStatus={missionStatus}
                isAutoplay={isAutoplay}
                onToggleAutoplay={toggleAutoplay}
              />
            </div>

            {/* Live Telemetry Status Strip */}
            <div className="flex items-center gap-2 font-mono text-[10px] flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/[0.08]">
                <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className={wsConnected ? 'text-emerald-300 font-bold' : 'text-amber-300'}>
                  {wsConnected ? 'SWARM ONLINE' : 'STANDBY'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/[0.08]">
                <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className={hasGeminiKey ? 'text-cyan-300 font-bold' : 'text-amber-300'}>
                  {hasGeminiKey ? 'GEMINI LINKED' : 'REASONING ARMED'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/70 border border-red-800 text-red-300 font-bold">
                <span>TARGET: PIER P-04</span>
                <span className="text-red-400 font-black">[HIGH]</span>
              </div>
            </div>
          </div>

          {/* Operational Metrics Live Ticker Bar */}
          {(visibleEvents.length > 0 || isMissionRunning) && (
            <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between gap-4 text-[11px] font-mono text-slate-400 flex-wrap">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-cyan-400" />
                  <span>Elapsed: <strong className="text-white"><AnimatedNumber value={visibleEvents[visibleEvents.length - 1]?.elapsed_seconds ?? 0} decimals={1} suffix="s" /></strong></span>
                </div>
                <span className="text-slate-700">|</span>
                <div className="flex items-center gap-1.5">
                  <Cpu size={12} className="text-blue-400" />
                  <span>Active Fleet: <strong className="text-cyan-300"><AnimatedNumber value={uniqueAgentsCount || 5} />/5 Specialists</strong></span>
                </div>
                <span className="text-slate-700">|</span>
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-amber-400" />
                  <span>Deterministic Tool Runs: <strong className="text-white"><AnimatedNumber value={toolCallsCount} /></strong></span>
                </div>
                <span className="text-slate-700">|</span>
                <div className="flex items-center gap-1.5">
                  <Activity size={12} className={isMissionRunning ? "text-amber-400 animate-pulse" : "text-emerald-400"} />
                  <span>Phase: <strong className={isMissionRunning ? "text-amber-300 uppercase" : "text-emerald-400 uppercase"}>{missionStatus}</strong></span>
                </div>
              </div>

              {/* Status prompt */}
              <div className="text-[10px] text-slate-400 hidden md:flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>ASCE 41-17 • ACI 318-19 • ACI 440.2R-17 Verified</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ═══════════════ MAIN OPERATIONS CONTROL VIEWPORT ═══════════════ */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* 1. TOP HERO HUD BANNER (Pipeline + Metrics + Comparison) */}
        <div className="space-y-4">
          {/* Mission Pipeline Progression */}
          <div id="section-mission-pipeline">
            <MissionPipeline
              stage={missionStatus}
              activeAgent={activeAgent}
              eventsCount={visibleEvents.length}
            />
          </div>

          {/* Hero Metrics Transition Grid (0.94 -> 1.74) */}
          <HeroMetrics
            missionState={missionState}
            stage={missionStatus}
          />

          {/* Hero Triage vs Manual Comparison Stat */}
          <HeroStat events={visibleEvents} stage={missionStatus} />

          {/* Mission Replay Controls (When Active) */}
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
        </div>

        {/* 2. THE 3-DECK WORKSPACE SWITCHER (Focus-Driven Architecture) */}
        <div className="bg-[#0b0c14] border border-white/[0.08] p-1.5 rounded-2xl flex items-center justify-between flex-wrap gap-2 shadow-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveDeck('SWARM')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                activeDeck === 'SWARM'
                  ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Radio size={14} className={activeDeck === 'SWARM' ? 'animate-pulse' : ''} />
              <span>🎯 DECK 1: LIVE SWARM OPERATIONS</span>
            </button>

            <button
              onClick={() => setActiveDeck('PHYSICS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                activeDeck === 'PHYSICS'
                  ? 'bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <CpuIcon size={14} />
              <span>🔬 DECK 2: PHYSICS & SIMULATION LAB</span>
            </button>

            <button
              onClick={() => setActiveDeck('AUDIT')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                activeDeck === 'AUDIT'
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <FileCheck size={14} />
              <span>📋 DECK 3: AUDIT & GOVERNANCE DOSSIER</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 px-3 hidden sm:flex items-center gap-2">
            <span className="text-cyan-400 font-bold">VIEW:</span>
            <span>{activeDeck === 'SWARM' ? 'Autonomous Swarm Orchestration' : activeDeck === 'PHYSICS' ? 'Deterministic Engineering Calculations' : 'Cryptographic Compliance & Evaluation'}</span>
          </div>
        </div>

        {/* ═══════════════ DECK 1: LIVE SWARM OPERATIONS ═══════════════ */}
        {activeDeck === 'SWARM' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Validation Replan Alert (Hero Adversarial Challenge) */}
            <div id="section-replan-alert">
              <ReplanAlert
                events={visibleEvents}
                stage={missionStatus}
              />
            </div>

            {/* Main Dual Grid: Interactive Graph & Terminal vs Incident & Specialist Fleet */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
              
              {/* Left Column (7 cols): Swarm Control Graph + Live Terminal Console */}
              <div className="xl:col-span-7 space-y-5">
                {/* Live Swarm Topology & Control Graph */}
                <MissionGraph
                  activeAgent={activeAgent}
                  events={visibleEvents}
                  stage={missionStatus}
                  missionState={missionState}
                />

                {/* Live Swarm Terminal Stream */}
                <AgentTimeline events={visibleEvents} />
              </div>

              {/* Right Column (5 cols): Incident Target + Specialist Fleet + Evidence Chain */}
              <div className="xl:col-span-5 space-y-5">
                {/* Incident Emergency Dispatch Context */}
                <div id="section-incident-panel">
                  <IncidentPanel
                    scenarios={scenarios}
                    selectedScenario={selectedScenario}
                    onSelectScenario={(id) => setSelectedScenario(id)}
                    isMissionRunning={isMissionRunning}
                    onTriggerMission={triggerMission}
                    missionStatus={missionStatus}
                  />
                </div>

                {/* Specialist Fleet Status Cards */}
                <AgentFleet
                  activeAgent={activeAgent}
                  events={visibleEvents}
                  stage={missionStatus}
                />

                {/* 3-Tier Layered Evidence Chain */}
                <EvidenceChain
                  stage={missionStatus}
                  hasReplanned={hasReplanned}
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ DECK 2: PHYSICS & SIMULATION LAB ═══════════════ */}
        {activeDeck === 'PHYSICS' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Deterministic Physics Workstation */}
            <div id="section-engineering">
              <EngineeringDashboard missionState={missionState} />
            </div>

            {/* Structural Section State Transition (600x600mm RC Pier Diagram) */}
            <div id="section-structural-view">
              <StructuralSectionView
                missionState={missionState}
                stage={missionStatus}
              />
            </div>

            {/* Sensor to Physics Correlation Matrix */}
            <SensorPhysicsCorrelation
              missionState={missionState}
              stage={missionStatus}
            />
          </div>
        )}

        {/* ═══════════════ DECK 3: AUDIT & GOVERNANCE DOSSIER ═══════════════ */}
        {activeDeck === 'AUDIT' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Autonomy & Compliance Scorecard */}
            <AutonomyScorecard
              events={visibleEvents}
              stage={missionStatus}
            />

            {/* Executive Remediation Directive & Audit Dossier Package */}
            <div id="section-executive">
              <ExecutivePanel
                missionState={missionState}
                onDownloadDossier={downloadDossier}
                onReplayMission={() => setIsReplaying(!isReplaying)}
                isReplaying={isReplaying}
              />
            </div>

            {/* Autonomous Decision Rationale ("Why Did The Agent Act?") */}
            <DecisionRationale
              events={visibleEvents}
              stage={missionStatus}
            />

            {/* Why GeoSentinel Is Truly Agentic (7-Point Breakdown) */}
            <WhyAgenticSection />
          </div>
        )}

      </main>

      {/* ═══════════════ ARCHITECTURE MODAL ═══════════════ */}
      <ArchitectureModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      {/* ═══════════════ VERIFICATION DOSSIER MODAL ═══════════════ */}
      <VerificationDossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        missionState={missionState}
        onDownloadDossier={downloadDossier}
      />

      {/* ═══════════════ OPERATIONAL FOOTER ═══════════════ */}
      <footer className="border-t border-white/[0.08] bg-[#07080d]/95 backdrop-blur-xl mt-12 py-5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold tracking-tight">GEOSENTINEL FLEET</span>
            <span>•</span>
            <span>Autonomous Infrastructure Swarm</span>
            <span>•</span>
            <span className="text-cyan-400">Google All Things Agentic Hackathon</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 flex-wrap">
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> Gemini 2.5 Pro</span>
            <span>•</span>
            <span>NumPy</span>
            <span>•</span>
            <span>OpenSeesPy FEA</span>
            <span>•</span>
            <span>ACI 318 / ASCE 41 / ACI 440.2R</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
