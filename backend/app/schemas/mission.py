from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from backend.app.schemas.incident import InfrastructureAnomalyPayload
from backend.app.schemas.artifacts import ToolResult, EngineeringResult, MissionEvent

class MissionStage(str, Enum):
    PLANNING = "PLANNING"
    EXECUTION = "EXECUTION"
    VALIDATION = "VALIDATION"
    REPLANNING = "REPLANNING"
    RETROFIT = "RETROFIT"
    COMPLETE = "COMPLETE"
    FAILED = "FAILED"

class AgentStatus(str, Enum):
    IDLE = "IDLE"
    PLANNING = "PLANNING"
    EXECUTING = "EXECUTING"
    VALIDATING = "VALIDATING"
    REPLANNING = "REPLANNING"
    COMPLETE = "COMPLETE"
    ERROR = "ERROR"

class ValidationResult(BaseModel):
    is_valid: bool
    reason: str
    metric: str = ""
    threshold: float = 1.5
    actual_value: float = 0.0
    action_recommended: str = ""
    timestamp: str = ""

class MissionState(BaseModel):
    mission_id: str
    incident: InfrastructureAnomalyPayload
    stage: MissionStage = MissionStage.PLANNING
    start_time: str = ""
    hypotheses: List[str] = []
    current_hypothesis: Optional[str] = None
    investigation_plan: List[str] = []
    completed_actions: List[str] = []
    tool_results: List[ToolResult] = []
    engineering_results: List[EngineeringResult] = []
    active_agent: Optional[str] = None
    confidence: float = 0.0
    initial_safety_factor: Optional[float] = None
    post_retrofit_safety_factor: Optional[float] = None
    retrofit_required: bool = False
    retrofit_details: Optional[Dict[str, Any]] = None
    validation_history: List[ValidationResult] = []
    final_decision: Optional[str] = None
    events: List[MissionEvent] = []
    moment_curvature_data: Optional[Dict[str, Any]] = None
    shear_capacity_data: Optional[Dict[str, Any]] = None
    retrofit_data: Optional[Dict[str, Any]] = None
