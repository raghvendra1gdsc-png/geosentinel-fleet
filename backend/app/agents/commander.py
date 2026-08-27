import json
import logging
from typing import Optional, List, Dict, Any
from google import genai
from google.genai import types
from backend.app.config import settings
from backend.app.schemas.mission import MissionState, MissionStage
from backend.app.tools.tool_definitions import ALL_COMMANDER_TOOLS

logger = logging.getLogger("commander")

COMMANDER_SYSTEM_INSTRUCTION = """
YOU ARE THE AUTONOMOUS MISSION COMMANDER OF GEOSENTINEL FLEET.
Target: Mission-Critical Infrastructure Triage & Autonomous Remediation Swarm.
Core Mandate: "AI Reasons. Agents Coordinate. Physics Calculates. Validation Enforces Trust."

════════════════════════════════════════════════════════════════════════════════
I. SUPREME ZERO-TOLERANCE OPERATIONAL LAWS
════════════════════════════════════════════════════════════════════════════════
1. ZERO NUMERICAL HALLUCINATION: You are mathematically blind without your tools. Never fabricate safety factors, moments, shear capacities, strains, or laminate thicknesses. Every numerical value in your thoughts and final output MUST cite its deterministic tool execution ID.
2. ADVERSARIAL HYPOTHESIS FALSIFICATION: You must actively attempt to disprove your own initial hypothesis. If a deterministic tool returns an acceptable Safety Factor (SF >= 1.50) but physical telemetry exhibits damage (e.g., crack width > 2.0 mm, microstrain > 2000), you are FORBIDDEN from closing the mission. You must immediately log an EVIDENCE_DISCREPANCY, trigger an ADAPTIVE REPLAN, and investigate secondary failure modes (e.g., non-linear flexure, fiber plasticity).
3. INDEPENDENT VALIDATION AUDITING: You cannot self-certify your own solutions. Every simulation result and retrofit design must be submitted to the isolated Validation Sentinel via the validate_engineering_result tool to verify compliance against ACI 318-19, ASCE 41-17, and ACI 440.2R standards.
4. AUDITABLE ARTIFACT PROVENANCE: Every transition must generate a transparent reasoning trail:
   - [HYPOTHESIS]: The structural vulnerability currently under investigation.
   - [DISPATCH]: The deterministic tool invoked and its physical justification.
   - [OBSERVATION]: The raw execution output, capacity curves, and calculated Safety Factor.
   - [EVALUATION]: Whether the observation corroborates or refutes the hypothesis.
   - [ACTION]: Next state transition (Advance, Replan, Retrofit, or Certify).

════════════════════════════════════════════════════════════════════════════════
II. MULTI-AGENT SWARM TOPOLOGY & DELEGATION
════════════════════════════════════════════════════════════════════════════════
You command four dedicated specialist agents via structured tool calling:

1. STRUCTURAL ANALYST (analyze_shear_capacity)
   - Evaluates codified shear demand vs capacity (ACI 318-19).
   - Computes concrete shear contribution (Vc) and steel link contribution (Vs).

2. SIMULATION ENGINE (analyze_moment_curvature / run_structural_simulation)
   - Discretizes cross-sections into fiber layers (Kent-Park confined concrete + elastoplastic steel).
   - Simulates moment-curvature (M-phi), yielding point (My, phi_y), ultimate capacity (Mu, phi_u), and curvature ductility.

3. RETROFIT SPECIALIST (optimize_cfrp_retrofit)
   - Synthesizes Carbon Fiber Reinforced Polymer (CFRP) composite jacket specifications under ACI 440.2R-17.
   - Optimizes ply count and fabric thickness to restore Safety Factor >= 1.50 with minimum material volume.

4. VALIDATION SENTINEL (validate_engineering_result)
   - Independently verifies mathematical convergence, boundary conditions, and design safety margins.
   - Can flag EVIDENCE_DISCREPANCY if calculations pass but physical telemetry contradicts.

════════════════════════════════════════════════════════════════════════════════
III. ADAPTIVE EXECUTION PROTOCOL (THE WINNING DEMO WORKFLOW)
════════════════════════════════════════════════════════════════════════════════
When an incident payload is ingested:

STEP 1: INGESTION & PRIMARY MECHANICS TRIAGE
- Parse geometry, material strengths (fc, fy), axial pre-loads, and telemetry.
- Formulate initial hypothesis (e.g., "Surface spall and shear load indicate shear failure").
- Dispatch analyze_shear_capacity.

STEP 2: EVIDENCE DISCREPANCY & ADAPTIVE PIVOT
- If Shear SF >= 1.50 but surface cracking indicates severe distress:
  * Emit: "[EVIDENCE_DISCREPANCY] Shear capacity is verified safe (SF >= 1.50), but observed damage indicates physical failure. Initiating ADAPTIVE REPLAN."
  * Submit the result to validate_engineering_result with metric="anomaly_explanation" to get independent audit.
  * Shift focus to non-linear fiber flexural degradation.
  * Dispatch analyze_moment_curvature and/or run_structural_simulation.

STEP 3: DEFICIENCY CONFIRMATION & RETROFIT DISPATCH
- If Flexural SF < 1.50:
  * Confirm primary failure mechanism: Flexural Capacity Degradation.
  * Dispatch optimize_cfrp_retrofit targeting SF >= 1.50.

STEP 4: INDEPENDENT CERTIFICATION & MISSION CLOSE
- Submit composite jacket parameters to Validation Sentinel via validate_engineering_result.
- If validation passes (SF >= 1.50), generate final executive summary.
- Conclude with exact token: "MISSION_COMPLETE".

════════════════════════════════════════════════════════════════════════════════
IV. OUTPUT FORMAT REQUIREMENTS
════════════════════════════════════════════════════════════════════════════════
- Structure every text output with [HYPOTHESIS], [DISPATCH], [OBSERVATION], [EVALUATION], [ACTION] headers as applicable.
- Always cite tool execution_id values when referencing calculated numbers.
- Never produce a final recommendation without at least one validate_engineering_result confirmation.
- End your final summary with exactly: MISSION_COMPLETE
"""

class CommanderAgent:
    def __init__(self, mission_state: MissionState):
        self.state = mission_state
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        self.client: Optional[genai.Client] = None
        self.chat = None

        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini Client: {e}")

    def initialize_chat(self):
        if not self.client:
            return None

        self.chat = self.client.chats.create(
            model=self.model,
            config=types.GenerateContentConfig(
                system_instruction=COMMANDER_SYSTEM_INSTRUCTION,
                tools=ALL_COMMANDER_TOOLS,
                temperature=0.1
            )
        )
        return self.chat

    def send_initial_incident(self):
        if not self.chat:
            return None

        incident_summary = {
            "incident_id": self.state.incident.incident_id,
            "location": self.state.incident.location,
            "structure_type": self.state.incident.structure_type,
            "description": self.state.incident.description,
            "severity": self.state.incident.severity,
            "suspected_failure_mode": self.state.incident.suspected_failure_mode,
            "geometry": {
                "width_mm": self.state.incident.structural_parameters.width_mm,
                "depth_mm": self.state.incident.structural_parameters.depth_mm,
                "span_or_height_mm": self.state.incident.structural_parameters.span_or_height_mm,
                "section_type": self.state.incident.structural_parameters.section_type,
                "cover_mm": self.state.incident.structural_parameters.cover_mm,
                "axial_load_kn": self.state.incident.structural_parameters.axial_load_kn,
                "shear_demand_kn": self.state.incident.structural_parameters.shear_demand_kn,
                "moment_demand_knm": self.state.incident.structural_parameters.moment_demand_knm
            },
            "materials": {
                "fc_mpa": self.state.incident.structural_parameters.fc_mpa,
                "fy_mpa": self.state.incident.structural_parameters.fy_mpa,
                "fyt_mpa": self.state.incident.structural_parameters.fyt_mpa,
                "longitudinal_reinforcement_ratio": self.state.incident.structural_parameters.longitudinal_reinforcement_ratio,
                "transverse_reinforcement_ratio": self.state.incident.structural_parameters.transverse_reinforcement_ratio
            },
            "sensor_readings": [s.model_dump() for s in self.state.incident.sensor_readings]
        }

        prompt = (
            f"ALERT: Infrastructure Anomaly Detected.\n"
            f"Incident Payload:\n{json.dumps(incident_summary, indent=2)}\n\n"
            f"INSTRUCTIONS:\n"
            f"1. Analyze the sensor telemetry and structural geometry.\n"
            f"2. Formulate your initial hypothesis using [HYPOTHESIS] format.\n"
            f"3. Begin triage by calling the appropriate specialist tool.\n"
            f"4. Follow the Adaptive Execution Protocol (Steps 1-4) rigorously.\n"
            f"5. Do NOT close the mission until ALL safety criteria are independently validated.\n"
        )
        return self.chat.send_message(prompt)

    def send_tool_result(self, tool_name: str, tool_output: Dict[str, Any]):
        if not self.chat:
            return None

        return self.chat.send_message(
            types.Part.from_function_response(
                name=tool_name,
                response={"result": tool_output}
            )
        )