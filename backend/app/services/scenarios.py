import uuid
from typing import Dict, Any, List
from backend.app.schemas.incident import InfrastructureAnomalyPayload, StructuralParameters, SensorReading

def get_bridge_pier_scenario() -> InfrastructureAnomalyPayload:
    """
    Primary Demonstration Scenario:
    Bridge 14A Pier reports shear spalling + abnormal strain.
    Initial shear check passes, but validation flags insufficient evidence -> Commander replans to flexure/FEA.
    """
    return InfrastructureAnomalyPayload(
        incident_id="INC-BP-1014",
        location="Pier P-04, San Mateo Bridge Span 14A, Highway 92",
        structure_type="Reinforced Concrete Bridge Pier",
        description="Acoustic emission detected shear spalling at pier base. Vibrational strain gauges report elevated cyclic microstrain under heavy freight transit.",
        severity="HIGH",
        suspected_failure_mode="Suspected Shear Spalling & Core Crushing",
        structural_parameters=StructuralParameters(
            material="Class 40 Concrete / Grade 60 Rebar",
            section_type="Rectangular Pier Section",
            width_mm=900.0,
            depth_mm=1400.0,
            fc_mpa=32.0,
            fy_mpa=420.0,
            fyt_mpa=400.0,
            cover_mm=50.0,
            longitudinal_reinforcement_ratio=0.018,
            transverse_reinforcement_ratio=0.0022,
            stirrup_spacing_mm=175.0,
            axial_load_kn=3500.0,
            span_or_height_mm=6200.0,
            shear_demand_kn=1350.0,
            moment_demand_knm=2850.0
        ),
        sensor_readings=[
            SensorReading(sensor_id="SG-P04-A", sensor_type="Piezoelectric Strain Gauge", value=2140.0, unit="microstrain", timestamp="2026-08-26T14:10:00Z", status="ELEVATED"),
            SensorReading(sensor_id="ACC-P04-Z", sensor_type="Triaxial Accelerometer", value=0.68, unit="g", timestamp="2026-08-26T14:10:02Z", status="WARNING"),
            SensorReading(sensor_id="AE-P04-01", sensor_type="Acoustic Emission Sensor", value=84.5, unit="dB", timestamp="2026-08-26T14:10:05Z", status="CRACKING_DETECTED")
        ]
    )

def get_overpass_column_scenario() -> InfrastructureAnomalyPayload:
    """
    Scenario 2:
    Highway Overpass Column under extreme seismic/truck impact strain.
    """
    return InfrastructureAnomalyPayload(
        incident_id="INC-OC-5042",
        location="Bents 3-4, Interstate 80 Interchange",
        structure_type="Circular RC Highway Overpass Column",
        description="High axial compression combined with lateral displacement. Core confinement dilation detected by fiber optic strain ring.",
        severity="CRITICAL",
        suspected_failure_mode="Axial-Flexural P-M Interaction Overstress",
        structural_parameters=StructuralParameters(
            material="High-Performance Concrete / A706 Rebar",
            section_type="Circular Column",
            width_mm=1100.0,
            depth_mm=1100.0,
            fc_mpa=38.0,
            fy_mpa=450.0,
            fyt_mpa=420.0,
            cover_mm=60.0,
            longitudinal_reinforcement_ratio=0.024,
            transverse_reinforcement_ratio=0.0035,
            stirrup_spacing_mm=120.0,
            axial_load_kn=6500.0,
            span_or_height_mm=7500.0,
            shear_demand_kn=1800.0,
            moment_demand_knm=3900.0
        ),
        sensor_readings=[
            SensorReading(sensor_id="FOS-COL-01", sensor_type="Fiber Optic Hoop Sensor", value=3100.0, unit="microstrain", timestamp="2026-08-26T14:15:00Z", status="CRITICAL"),
            SensorReading(sensor_id="TILT-B03", sensor_type="Dual-Axis Inclinometer", value=1.42, unit="deg", timestamp="2026-08-26T14:15:01Z", status="EXCESSIVE_TILT")
        ]
    )

def get_rc_beam_scenario() -> InfrastructureAnomalyPayload:
    """
    Scenario 3:
    Parking Garage Girder experiencing flexural tension crack propagation.
    """
    return InfrastructureAnomalyPayload(
        incident_id="INC-GB-8821",
        location="Bay 4-C, Metro Multi-Level Parking Structure",
        structure_type="Continuous RC Transfer Girder",
        description="Mid-span flexural crack opening with excessive live-load sag. Visual displacement sensor exceeds L/240 serviceability threshold.",
        severity="MEDIUM",
        suspected_failure_mode="Flexural Rebar Tensile Yielding",
        structural_parameters=StructuralParameters(
            material="C30/37 Concrete / HRB400 Rebar",
            section_type="T-Beam Girder",
            width_mm=500.0,
            depth_mm=950.0,
            fc_mpa=28.0,
            fy_mpa=400.0,
            fyt_mpa=350.0,
            cover_mm=40.0,
            longitudinal_reinforcement_ratio=0.013,
            transverse_reinforcement_ratio=0.0018,
            stirrup_spacing_mm=200.0,
            axial_load_kn=200.0,
            span_or_height_mm=12000.0,
            shear_demand_kn=620.0,
            moment_demand_knm=1450.0
        ),
        sensor_readings=[
            SensorReading(sensor_id="LVDT-G04", sensor_type="Displacement Transducer (LVDT)", value=54.2, unit="mm", timestamp="2026-08-26T14:20:00Z", status="EXCESSIVE_DEFLECTION"),
            SensorReading(sensor_id="CRK-04-W", sensor_type="Digital Crack Width Gauge", value=1.85, unit="mm", timestamp="2026-08-26T14:20:03Z", status="EXCEEDS_CODE_LIMIT")
        ]
    )

SCENARIOS: Dict[str, Any] = {
    "BRIDGE_PIER": get_bridge_pier_scenario,
    "OVERPASS_COLUMN": get_overpass_column_scenario,
    "RC_BEAM": get_rc_beam_scenario
}

def list_scenario_summaries() -> List[Dict[str, Any]]:
    return [
        {
            "id": "BRIDGE_PIER",
            "name": "Bridge Pier P-04 (Recommended Demo)",
            "structure": "Reinforced Concrete Pier",
            "location": "San Mateo Bridge Span 14A",
            "severity": "HIGH",
            "feature": "Demonstrates Adaptive Replanning (Shear -> Flexure -> CFRP Retrofit)"
        },
        {
            "id": "OVERPASS_COLUMN",
            "name": "Overpass Column Bent 3-4",
            "structure": "Circular Column",
            "location": "Interstate 80 Interchange",
            "severity": "CRITICAL",
            "feature": "High Axial-Flexural Interaction & Confinement Assessment"
        },
        {
            "id": "RC_BEAM",
            "name": "Transfer Girder Bay 4-C",
            "structure": "RC Transfer Girder",
            "location": "Metro Parking Structure",
            "severity": "MEDIUM",
            "feature": "Mid-Span Flexural Tension Crack & Deflection Triage"
        }
    ]
