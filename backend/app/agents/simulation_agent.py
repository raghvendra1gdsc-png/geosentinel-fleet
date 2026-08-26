from backend.app.schemas.mission import MissionState
from backend.app.tools.tool_executor import execute_tool
from typing import Dict, Any

class SimulationAgent:
    """
    FEA Simulation Specialist.
    Executes sandboxed OpenSeesPy non-linear pushover models and parses numerical fiber stress distributions.
    """
    def __init__(self, mission_state: MissionState):
        self.state = mission_state

    async def execute_simulation(self, axial_load_kn: float = 0.0, include_fiber: bool = True) -> Dict[str, Any]:
        result = execute_tool(
            "run_structural_simulation",
            {"axial_load_kn": axial_load_kn, "include_fiber_discretization": include_fiber},
            self.state.incident
        )
        self.state.tool_results.append(result)
        return result.model_dump()
