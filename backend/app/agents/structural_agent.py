from backend.app.schemas.mission import MissionState
from backend.app.tools.tool_executor import execute_tool
from typing import Dict, Any

class StructuralAgent:
    """
    Structural Analysis Specialist.
    Evaluates concrete mechanics, shear capacity, and section moment-curvature response.
    """
    def __init__(self, mission_state: MissionState):
        self.state = mission_state

    async def inspect(self) -> Dict[str, Any]:
        result = execute_tool("inspect_incident", {"incident_id": self.state.incident.incident_id}, self.state.incident)
        self.state.tool_results.append(result)
        return result.model_dump()

    async def analyze_shear(self, demand_kn: float = 0.0) -> Dict[str, Any]:
        result = execute_tool("analyze_shear_capacity", {"demand_kn": demand_kn}, self.state.incident)
        self.state.tool_results.append(result)
        if result.success:
            self.state.shear_capacity_data = result.data
            sf = result.data.get("safety_factor")
            if self.state.initial_safety_factor is None and sf is not None:
                self.state.initial_safety_factor = sf
        return result.model_dump()

    async def analyze_flexure(self) -> Dict[str, Any]:
        result = execute_tool("analyze_moment_curvature", {}, self.state.incident)
        self.state.tool_results.append(result)
        if result.success:
            self.state.moment_curvature_data = result.data
            sf = result.data.get("safety_factor")
            if sf is not None and (self.state.initial_safety_factor is None or sf < self.state.initial_safety_factor):
                self.state.initial_safety_factor = sf
        return result.model_dump()
