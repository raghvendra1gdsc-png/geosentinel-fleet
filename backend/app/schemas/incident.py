from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class SensorReading(BaseModel):
    sensor_id: str
    sensor_type: str
    value: float
    unit: str
    timestamp: str
    status: str = "NORMAL"

class StructuralParameters(BaseModel):
    material: str = "Reinforced Concrete"
    section_type: str = "Rectangular"
    width_mm: float
    depth_mm: float
    fc_mpa: float  # Concrete compressive strength f'c
    fy_mpa: float  # Longitudinal steel yield strength fy
    fyt_mpa: float = 400.0  # Transverse steel yield strength fyt
    cover_mm: float = 50.0
    longitudinal_reinforcement_ratio: float = 0.015  # rho_l
    transverse_reinforcement_ratio: float = 0.0025   # rho_v
    stirrup_spacing_mm: float = 150.0
    axial_load_kn: float = 2000.0
    span_or_height_mm: float = 4500.0
    shear_demand_kn: float = 1200.0
    moment_demand_knm: float = 1800.0

class InfrastructureAnomalyPayload(BaseModel):
    incident_id: str
    location: str
    structure_type: str
    description: str
    severity: str = Field(default="HIGH")
    suspected_failure_mode: str = "Shear Spalling & Flexural Yielding"
    structural_parameters: StructuralParameters
    sensor_readings: List[SensorReading] = []
