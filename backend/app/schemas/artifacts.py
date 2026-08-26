from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class EngineeringResult(BaseModel):
    metric: str
    value: float
    unit: str
    source: str
    execution_id: str
    timestamp: str
    code_reference: Optional[str] = None
    validated: bool = False
    details: Optional[Dict[str, Any]] = None
    
class ToolResult(BaseModel):
    tool_name: str
    success: bool
    data: Dict[str, Any]
    error: Optional[str] = None
    execution_id: str
    timestamp: str

class MissionEvent(BaseModel):
    event_id: str
    mission_id: str
    timestamp: str
    elapsed_seconds: float = 0.0
    agent: str
    stage: str
    event_type: str
    message: str
    tool: Optional[str] = None
    tool_input: Optional[Dict[str, Any]] = None
    tool_output: Optional[Dict[str, Any]] = None
    status: str = "SUCCESS"

class DossierPayload(BaseModel):
    mission_id: str
    summary: str
    incident_details: Dict[str, Any]
    structural_parameters: Dict[str, Any]
    timeline: List[MissionEvent]
    engineering_results: List[EngineeringResult]
    final_recommendation: str
    safety_factor_before: float
    safety_factor_after: Optional[float] = None
    retrofit_applied: bool
    validation_status: str
    generated_at: str
