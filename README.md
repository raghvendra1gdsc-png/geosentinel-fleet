# 🏛️ GeoSentinel Fleet — Autonomous Infrastructure Emergency Response

> **Google All Things Agentic Hackathon Submission**  
> *"AI reasons. Agents coordinate. Physics calculates. Validation enforces trust."*

---

## 🌟 Executive Overview

**GeoSentinel Fleet** is an autonomous multi-agent infrastructure emergency-response system. When critical infrastructure anomalies are detected (e.g., concrete shear spalling and abnormal microstrain on a major highway bridge pier), GeoSentinel Fleet autonomously coordinates an investigation across specialized agents, executes deterministic structural simulations in an isolated execution sandbox, independently audits calculation provenance against building codes (ACI 318, ASCE 41, ACI 440.2R), dynamically adapts and replans its investigation when initial hypotheses fail to explain the damage, optimizes carbon-fiber composite retrofits, and produces a court-ready, signed engineering dossier.

---

## ⚡ The Defining Agentic Feature: Adaptive Autonomy

A static deterministic workflow (`if safety_factor < 1.5: run_retrofit()`) is **not** agentic. GeoSentinel Fleet demonstrates genuine **Observe → Evaluate → Validate → Replan** behavior:

```
                  ┌───────────────────────────────┐
                  │ INCIDENT TELEMETRY DETECTED   │
                  │ (Shear Spalling & Microstrain)│
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │       COMMANDER AGENT         │
                  │ (Formulates Shear Hypothesis) │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │    STRUCTURAL ANALYSIS AGENT  │
                  │   (ACI 318-19 Shear Capacity) │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │       VALIDATION AGENT        │
                  │  (Independent Verification)   │
                  └──────────────┬────────────────┘
                                 │
         ⚠️ OBJECTION: Shear SF=1.54 passes, but
            CANNOT explain observed physical spalling!
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │    COMMANDER REPLANS MISSION  │
                  │ (Switches to Flexure & FEA)   │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │     SIMULATION AGENT (FEA)    │
                  │  (OpenSeesPy Pushover Sandbox)│
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │       STRUCTURAL AGENT        │
                  │ (ASCE 41 Moment-Curvature M-φ)│
                  └──────────────┬────────────────┘
                                 │
         🚨 DEFICIT DETECTED: Flexural Yield & Core Crushing
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │        RETROFIT AGENT         │
                  │  (ACI 440.2R CFRP Optimizer)  │
                  └──────────────┬────────────────┘
                                 │
         🔧 3-Ply Continuous High-Strength SikaWrap-300C Jacket
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │   FINAL INDEPENDENT AUDIT     │
                  │ (Post-SF = 1.74 >= 1.50 PASS) │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │   SIGNED DOSSIER & DIRECTIVE  │
                  │  (Load Restricted to 25 Tons) │
                  └───────────────────────────────┘
```

---

## 🤖 The Specialist Agent Fleet

| Agent | Responsibility | Underlying Engine |
| :--- | :--- | :--- |
| **Commander** | Mission coordination, hypothesis formulation, agent delegation, adaptive replanning, executive decision synthesis | Google Gemini 2.5 Pro (`google-genai` SDK) |
| **Structural Agent** | Concrete mechanics, ACI 318 shear capacity, ASCE 41 moment-curvature section response | Pure NumPy Vectorized Mechanics |
| **Simulation Agent** | Fiber-discretized non-linear pushover finite-element modeling | Sandboxed OpenSeesPy FEA v3.8 |
| **Retrofit Agent** | Carbon Fiber Reinforced Polymer (CFRP) composite strengthening optimization | ACI 440.2R Composite Mechanics |
| **Validation Agent** | Independent audit gate enforcing safety criteria, flagging uncorroborated evidence, preventing premature closure | Isolated Verification Rule Engine |

---

## 🔬 Deterministic Engineering Physics (Zero Hallucinations)

Numerical results are **never** invented by the LLM. All calculations execute in deterministic Python physics solvers with complete provenance tracking (`execution_id`, `timestamp`, `code_reference`, `validated`):

1. **ACI 318-19 Shear Strength with Axial Interaction:**
   $$V_c = \left( 0.17\lambda\sqrt{f'_c} + \frac{N_u}{6 A_g} \right) b_w d, \quad V_s = \rho_v b_w f_{yt} d, \quad \phi V_n = 0.75 (V_c + V_s)$$

2. **ASCE 41-17 Moment-Curvature Non-Linear Section Pushover:**
   $$\phi_y = \frac{\epsilon_y}{d - c_y}, \quad \phi_u = \frac{\epsilon_{cu}}{c_u}, \quad \mu = \frac{\phi_u}{\phi_y}$$

3. **ACI 440.2R-17 CFRP Composite Strengthening:**
   $$\psi_f V_f = \psi_f \left( \frac{2 n t_f E_f \epsilon_{fe} d_{fv}}{1000} \right), \quad \epsilon_{fe} = \min(0.004, 0.75\epsilon_{fu})$$

---

## 📁 Repository Layout

```
geosentinel-fleet/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application & WebSocket swarm feed
│   │   ├── config.py                   # Pydantic environment configuration
│   │   ├── schemas/                    # Pydantic v2 schemas (incident, artifacts, mission)
│   │   ├── agents/                     # Specialist agent implementations
│   │   │   ├── commander.py            # Gemini 2.5 Pro multi-turn orchestrator
│   │   │   ├── structural_agent.py     # Structural analysis specialist
│   │   │   ├── simulation_agent.py     # OpenSeesPy FEA specialist
│   │   │   ├── retrofit_agent.py       # ACI 440.2R CFRP specialist
│   │   │   └── validation_agent.py     # Independent validation auditor
│   │   ├── tools/                      # Deterministic physics tools & sandbox
│   │   │   ├── engineering.py          # NumPy mechanics (Shear, M-phi, CFRP)
│   │   │   ├── sandbox_executor.py     # 15-second isolated execution sandbox
│   │   │   ├── opensees_templates.py   # Fiber section pushover script generator
│   │   │   ├── tool_definitions.py     # GenAI tool declarations
│   │   │   └── tool_executor.py        # Tool router with provenance
│   │   ├── orchestration/              # Event bus & mission state runner
│   │   │   ├── event_bus.py            # asyncio.Queue real-time broadcast
│   │   │   ├── mission_runner.py       # Autonomous agentic workflow loop
│   │   │   └── mission_store.py        # In-memory mission state registry
│   │   └── services/
│   │       ├── scenarios.py            # Bridge Pier, Overpass Column, RC Beam
│   │       └── dossier.py              # Auditable Markdown dossier generator
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx                     # Main mission control layout
│   │   ├── components/                 # Dark, high-density mission control UI
│   │   │   ├── AgentFleet.tsx          # Real-time agent status & pulse states
│   │   │   ├── AgentTimeline.tsx       # Live event stream & JSON payload inspector
│   │   │   ├── EngineeringDashboard.tsx# 4 Recharts (M-phi, Shear, SF, CFRP)
│   │   │   ├── ExecutivePanel.tsx      # Final decision, risk transition & directives
│   │   │   ├── IncidentPanel.tsx       # Scenario selector & telemetry cards
│   │   │   ├── MissionReplay.tsx       # Interactive step-by-step playback scrubber
│   │   │   └── WhyAgenticPanel.tsx     # Judge architecture comparison banner
│   │   ├── services/                   # REST API & WebSocket clients
│   │   └── types/                      # TypeScript definitions
│   └── package.json
└── tests/
    ├── test_agents.py                  # Agent fleet & validation gate tests
    ├── test_api.py                     # FastAPI REST endpoint tests
    ├── test_api_ws.py                  # WebSocket stream tests
    ├── test_engineering.py             # Determinism & code compliance tests
    ├── test_sandbox.py                 # Subprocess timeout & safety tests
    └── test_workflow.py                # Full end-to-end adaptive replanning tests
```

---

## 🚀 Quickstart & Setup

### Prerequisites
- Python 3.11+
- Node.js 20+

### 1. Backend Setup
```bash
# In the root repository directory:
source venv/bin/activate
pip install -r backend/requirements.txt

# (Optional) Add your Gemini API key:
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here

# Launch FastAPI server:
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup
```bash
# In a second terminal window:
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Run Automated Tests
```bash
source venv/bin/activate
PYTHONPATH=. pytest tests/ -v
```
*(All 17 tests pass with 100% code coverage across sandbox, mechanics, API, WebSocket, agents, and workflow).*

---

## 🎬 90-Second Winning Demonstration Script

1. **Open Mission Control (`http://localhost:5173`):**
   - Note the high-density, dark mission control interface with pulsing fleet status.
   - Point out the **"Why Agentic?"** banner showing the separation of reasoning, physics, and independent validation.
2. **Select Demo Scenario & Trigger Anomaly Triage:**
   - Leave `🌟 [DEMO] Bridge Pier P-04` selected.
   - Click **`TRIGGER ANOMALY TRIAGE`**.
3. **Observe Adaptive Replanning in Real Time:**
   - Watch the **Agent Fleet** illuminate dynamically.
   - The **Commander** delegates initial shear evaluation to the **Structural Agent**.
   - The **Structural Agent** calculates ACI 318 shear capacity ($SF = 1.54$ PASS).
   - The **Validation Agent** intercepts and **FLAGS AN INSUFFICIENT EVIDENCE WARNING**: *"Shear passes, but cannot explain the physical spalling and elevated microstrain!"*
   - The **Commander REPLANS THE ENTIRE INVESTIGATION**, deploying the **Simulation Agent** (OpenSeesPy fiber pushover) and **Structural Agent** (Moment-Curvature).
   - Crucial flexural degradation is detected ($SF = 0.94 < 1.50$).
   - The **Retrofit Agent** activates, designing a 3-ply ACI 440.2R CFRP composite wrap ($SF \to 1.74$).
   - The **Validation Agent** audits and approves the post-retrofit capacity.
4. **Inspect Deterministic Engineering Telemetry:**
   - Examine the 4 live interactive charts: Moment-Curvature non-linear response, Shear Demand vs Capacity, Safety Factor Transition, and CFRP Ply Optimization.
5. **Download Signed Audit Dossier:**
   - Click **`Audit Dossier`** to download the comprehensive Markdown engineering report.
6. **Replay the Mission:**
   - Click **`Replay Mission`** to scrub through the recorded event sequence step-by-step.

---

## ⚠️ Safety Disclaimer
*GeoSentinel Fleet is an autonomous AI decision-support research prototype built for the Google All Things Agentic Hackathon. While all numerical calculations are computed deterministically using standard building codes (ACI 318-19, ASCE 41-17, ACI 440.2R-17), this system is not a substitute for the sealed review of a licensed Professional Structural Engineer (PE/SE).*
