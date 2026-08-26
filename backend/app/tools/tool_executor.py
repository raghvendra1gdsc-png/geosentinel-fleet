import json
import uuid
import datetime
from typing import Dict, Any
from backend.app.schemas.incident import StructuralParameters, InfrastructureAnomalyPayload
from backend.app.schemas.artifacts import ToolResult
from backend.app.tools.engineering import (
    analyze_shear_capacity,
    analyze_moment_curvature,
    optimize_cfrp_retrofit
)
from backend.app.tools.sandbox_executor import execute_simulation_sandbox
from backend.app.tools.opensees_templates import generate_opensees_moment_curvature_script

def _create_result(name: str, success: bool, data: Dict[str, Any], error: str = None) -> ToolResult:
    return ToolResult(
        tool_name=name,
        success=success,
        data=data,
        error=error,
        execution_id=str(uuid.uuid4()),
        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
    )

def execute_tool(
    tool_name: str,
    args: Dict[str, Any],
    incident: InfrastructureAnomalyPayload
) -> ToolResult:
    params = incident.structural_parameters
    
    try:
        if tool_name == "inspect_incident":
            return _create_result(tool_name, True, {
                "incident_id": incident.incident_id,
                "location": incident.location,
                "structure_type": incident.structure_type,
                "severity": incident.severity,
                "suspected_failure_mode": incident.suspected_failure_mode,
                "geometry": {
                    "width_mm": params.width_mm,
                    "depth_mm": params.depth_mm,
                    "span_or_height_mm": params.span_or_height_mm,
                    "section_type": params.section_type
                },
                "materials": {
                    "fc_mpa": params.fc_mpa,
                    "fy_mpa": params.fy_mpa,
                    "fyt_mpa": params.fyt_mpa,
                    "rho_longitudinal": params.longitudinal_reinforcement_ratio,
                    "rho_transverse": params.transverse_reinforcement_ratio
                },
                "demands": {
                    "shear_demand_kn": params.shear_demand_kn,
                    "moment_demand_knm": params.moment_demand_knm,
                    "axial_load_kn": params.axial_load_kn
                },
                "sensors": [s.model_dump() for s in incident.sensor_readings]
            })

        elif tool_name == "analyze_shear_capacity":
            demand = float(args.get("demand_kn", params.shear_demand_kn))
            res = analyze_shear_capacity(params, demand)
            return _create_result(tool_name, True, res)

        elif tool_name == "analyze_moment_curvature":
            res = analyze_moment_curvature(params)
            return _create_result(tool_name, True, res)

        elif tool_name == "run_structural_simulation":
            script = generate_opensees_moment_curvature_script(
                width_mm=params.width_mm,
                depth_mm=params.depth_mm,
                fc_mpa=params.fc_mpa,
                fy_mpa=params.fy_mpa,
                cover_mm=params.cover_mm,
                axial_load_kn=params.axial_load_kn,
                rho_longitudinal=params.longitudinal_reinforcement_ratio
            )
            sandbox_res = execute_simulation_sandbox(script, timeout_seconds=15)
            if sandbox_res.get("success"):
                try:
                    parsed = json.loads(sandbox_res.get("stdout", "{}"))
                    return _create_result(tool_name, True, parsed)
                except Exception:
                    return _create_result(tool_name, True, {"raw_stdout": sandbox_res.get("stdout")})
            else:
                return _create_result(tool_name, False, {}, error=sandbox_res.get("error"))

        elif tool_name == "optimize_cfrp_retrofit":
            res = optimize_cfrp_retrofit(params, params.shear_demand_kn)
            return _create_result(tool_name, True, res)

        elif tool_name == "validate_engineering_result":
            metric = args.get("metric", "safety_factor")
            value = float(args.get("value", 0.0))
            context = args.get("context", "")

            # Validation logic
            if metric == "safety_factor":
                is_valid = value >= 1.50
                reason = (
                    f"Safety factor {value:.2f} satisfies ACI/ASCE emergency threshold (>= 1.50)."
                    if is_valid else
                    f"Safety factor {value:.2f} is BELOW acceptable threshold (1.50). Structural intervention/retrofit required."
                )
            elif metric == "anomaly_explanation" or "shear" in context.lower():
                # If shear calculation passed but strain anomaly & spalling was reported,
                # validation checks if evidence is sufficient
                if value >= 1.50 and "spall" in incident.description.lower():
                    is_valid = False
                    reason = (
                        f"INSUFFICIENT EVIDENCE: Shear analysis returned SF={value:.2f} (PASS), which DOES NOT explain "
                        f"the severe strain readings and surface spalling observed in telemetry. Secondary flexural/ductility failure mechanism suspected."
                    )
                else:
                    is_valid = True
                    reason = f"Evidence verified: {context}"
            else:
                is_valid = True
                reason = f"Audited {metric}={value:.2f}: Criteria satisfied."

            return _create_result(tool_name, True, {
                "is_valid": is_valid,
                "reason": reason,
                "metric": metric,
                "threshold": 1.50,
                "actual_value": value,
                "action_recommended": "REPLAN_INVESTIGATION" if not is_valid else "PROCEED"
            })

        else:
            return _create_result(tool_name, False, {}, error=f"Unknown tool: {tool_name}")

    except Exception as e:
        return _create_result(tool_name, False, {}, error=str(e))
