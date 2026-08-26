import datetime
from backend.app.schemas.mission import MissionState, ValidationResult
from backend.app.tools.tool_executor import execute_tool
from typing import Dict, Any

class ValidationAgent:
    """
    Independent Verification & Audit Agent.
    Strictly separated from calculation agents.
    Enforces ACI 318 / ASCE 41 / ACI 440.2R safety thresholds and identifies uncorroborated hypotheses.
    """
    def __init__(self, mission_state: MissionState):
        self.state = mission_state

    async def validate(self, metric: str, value: float, context: str) -> Dict[str, Any]:
        result = execute_tool(
            "validate_engineering_result",
            {"metric": metric, "value": value, "context": context},
            self.state.incident
        )
        self.state.tool_results.append(result)

        if result.success:
            val_data = result.data
            val_res = ValidationResult(
                is_valid=val_data.get("is_valid", False),
                reason=val_data.get("reason", "No reason provided."),
                metric=metric,
                threshold=val_data.get("threshold", 1.50),
                actual_value=value,
                action_recommended=val_data.get("action_recommended", "PROCEED"),
                timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
            )
            self.state.validation_history.append(val_res)

        return result.model_dump()
