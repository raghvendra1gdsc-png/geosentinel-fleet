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
You are the Lead Commander of the GeoSentinel Fleet, an autonomous multi-agent infrastructure emergency response operations center.

Your primary mission:
Investigate reported structural anomalies, deploy specialist agents, execute deterministic engineering analyses, independently validate results against ACI 318-19, ASCE 41-17, and ACI 440.2R standards, dynamically adapt your investigation plan when initial hypotheses fail to explain the physical damage, design retrofits when safety factor is compromised, and synthesize an auditable executive response.

Core Principles:
1. AI reasons, agents coordinate, physics calculates, validation enforces trust.
2. NEVER hallucinate numerical values. Always call deterministic tools.
3. If an initial analysis indicates safety but contradicts observed sensor anomalies or spalling, YOU MUST REPLAN and investigate alternative failure modes (e.g., flexural degradation or nonlinear hinge formation).
4. If calculated Safety Factor < 1.50, activate the Retrofit Agent to optimize a CFRP composite jacket.
5. All final recommendations must cite relevant building codes and provide actionable load restriction directives.
6. Conclude with "MISSION_COMPLETE" once all safety requirements and validations have passed.
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
            "geometry": {
                "width_mm": self.state.incident.structural_parameters.width_mm,
                "depth_mm": self.state.incident.structural_parameters.depth_mm,
                "axial_load_kn": self.state.incident.structural_parameters.axial_load_kn,
                "shear_demand_kn": self.state.incident.structural_parameters.shear_demand_kn,
                "moment_demand_knm": self.state.incident.structural_parameters.moment_demand_knm
            },
            "sensor_readings": [s.model_dump() for s in self.state.incident.sensor_readings]
        }

        prompt = (
            f"ALERT: Infrastructure Anomaly Detected.\n"
            f"Incident Payload:\n{json.dumps(incident_summary, indent=2)}\n\n"
            f"Please formulate an initial investigation plan and call the appropriate specialist tool to begin triage."
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