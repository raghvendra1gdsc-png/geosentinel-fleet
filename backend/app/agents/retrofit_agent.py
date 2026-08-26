from backend.app.schemas.mission import MissionState
from backend.app.tools.tool_executor import execute_tool
from typing import Dict, Any

class RetrofitAgent:
    """
    Structural Retrofit & Remediation Specialist.
    Designs and optimizes ACI 440.2R composite fiber jackets (CFRP) to restore safety criteria.
    """
    def __init__(self, mission_state: MissionState):
        self.state = mission_state

    async def optimize_cfrp(self, target_sf: float = 1.50) -> Dict[str, Any]:
        result = execute_tool("optimize_cfrp_retrofit", {"target_safety_factor": target_sf}, self.state.incident)
        self.state.tool_results.append(result)
        if result.success:
            self.state.retrofit_required = True
            self.state.retrofit_details = result.data
            self.state.retrofit_data = result.data
            self.state.post_retrofit_safety_factor = result.data.get("post_retrofit_safety_factor")
        return result.model_dump()
