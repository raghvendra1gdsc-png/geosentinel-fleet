import pytest
from backend.app.tools.engineering import (
    analyze_moment_curvature,
    analyze_shear_capacity,
    optimize_cfrp_retrofit
)
from backend.app.services.scenarios import get_bridge_pier_scenario, get_overpass_column_scenario

def test_shear_capacity_determinism():
    """Verify that identical inputs produce bit-exact identical deterministic shear capacity."""
    params = get_bridge_pier_scenario().structural_parameters
    res1 = analyze_shear_capacity(params, demand_kn=1200.0)
    res2 = analyze_shear_capacity(params, demand_kn=1200.0)

    assert res1["concrete_shear_capacity_kN"] == res2["concrete_shear_capacity_kN"]
    assert res1["steel_shear_capacity_kN"] == res2["steel_shear_capacity_kN"]
    assert res1["design_capacity_kN"] == res2["design_capacity_kN"]
    assert res1["safety_factor"] == res2["safety_factor"]
    assert res1["code_reference"] == "ACI 318-19 Section 22.5"

def test_moment_curvature_ductility():
    """Verify ASCE 41 moment-curvature calculations and section ductility ratio."""
    params = get_bridge_pier_scenario().structural_parameters
    res = analyze_moment_curvature(params)

    assert res["yield_moment_kNm"] > 0
    assert res["ultimate_moment_kNm"] >= res["yield_moment_kNm"]
    assert res["ductility_ratio"] > 1.0
    assert len(res["curve_data"]["points"]) == 50
    assert "yield_point" in res["curve_data"]
    assert "ultimate_point" in res["curve_data"]

def test_cfrp_retrofit_optimization():
    """Verify ACI 440.2R CFRP composite strengthening restores Safety Factor >= 1.50."""
    params = get_bridge_pier_scenario().structural_parameters
    # Demand that causes safety factor deficit
    res = optimize_cfrp_retrofit(params, current_demand_kn=1400.0)

    assert res["target_safety_factor"] == 1.50
    assert res["required_cfrp_layers"] >= 1
    assert res["post_retrofit_safety_factor"] >= 1.50
    assert res["added_design_capacity_kN"] > 0
    assert res["improvement_percentage"] > 0
    assert len(res["ply_optimization_curve"]) >= 2
