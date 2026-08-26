import numpy as np
import uuid
import datetime
from typing import Dict, Any, List
from backend.app.schemas.incident import StructuralParameters

def _generate_exec_id() -> str:
    return str(uuid.uuid4())

def _timestamp() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()

def analyze_moment_curvature(params: StructuralParameters) -> Dict[str, Any]:
    """
    Deterministic RC Moment-Curvature Non-Linear Section Analysis.
    Reference: ASCE 41-17 Section 10 & Park and Paulay Reinforced Concrete Structures.
    """
    b = float(params.width_mm)
    h = float(params.depth_mm)
    fc = float(params.fc_mpa)
    fy = float(params.fy_mpa)
    cover = float(params.cover_mm)
    rho_l = float(params.longitudinal_reinforcement_ratio)
    N_u = float(params.axial_load_kn) * 1000.0  # N
    moment_demand = float(params.moment_demand_knm)

    # Effective depth
    d = max(100.0, h - cover - 10.0)  # assumed 20mm rebar center
    As = rho_l * b * d  # Tension steel area (mm^2)
    Es = 200000.0  # Steel modulus MPa
    Ec = 4700.0 * np.sqrt(fc)  # Concrete modulus MPa
    
    # Beta1 factor (ACI 318-19 Section 22.2.2.4.3)
    if fc <= 28.0:
        beta1 = 0.85
    elif fc >= 55.0:
        beta1 = 0.65
    else:
        beta1 = 0.85 - 0.05 * (fc - 28.0) / 7.0

    # Yield State: steel strain eps_y = fy / Es
    eps_y = fy / Es
    # Neutral axis at yield (approx under axial load)
    c_y = max(20.0, (As * fy + N_u) / (0.7 * fc * b + 1e-5))
    c_y = min(c_y, 0.85 * d)
    phi_y = eps_y / (d - c_y)  # 1/mm
    
    # Yield Moment My (kNm)
    z_y = d - (c_y / 3.0)
    My = (As * fy * z_y + N_u * (h / 2.0 - c_y / 3.0)) / 1e6

    # Ultimate State: concrete crushing eps_cu = 0.0035
    eps_cu = 0.0035
    # Whitney stress block depth a = (As * fy + N_u) / (0.85 * fc * b)
    a_u = min((As * fy + N_u) / (0.85 * fc * b), h * 0.9)
    c_u = max(25.0, a_u / beta1)
    phi_u = eps_cu / c_u  # 1/mm
    
    # Ultimate Moment Mu (kNm)
    z_u = d - (a_u / 2.0)
    Mu_calc = (As * fy * z_u + N_u * (h / 2.0 - a_u / 2.0)) / 1e6
    Mu = max(Mu_calc, My * 1.06)

    # Section ductility factor
    ductility = max(1.5, phi_u / max(phi_y, 1e-7))
    
    # Safety Factor against Applied Moment Demand
    sf_flexure = Mu / max(moment_demand, 1.0)
    is_safe = sf_flexure >= 1.50

    # Generate 50 points discretized M-phi curve with post-yield strain hardening & softening
    phi_vals = np.linspace(0.0, phi_u * 1.25, 50)
    m_vals = []
    for p in phi_vals:
        if p <= phi_y:
            m = My * (p / phi_y)
        elif p <= phi_u:
            alpha = (p - phi_y) / (phi_u - phi_y)
            m = My + (Mu - My) * (np.sin(alpha * np.pi / 2.0))
        else:
            # Softening branch
            alpha = (p - phi_u) / (phi_u * 0.25)
            m = Mu * max(0.6, 1.0 - 0.25 * alpha)
        m_vals.append(float(np.round(m, 2)))

    curve_points = [
        {"curvature": float(np.round(p * 1e4, 4)), "moment": float(m)}
        for p, m in zip(phi_vals, m_vals)
    ]

    return {
        "execution_id": _generate_exec_id(),
        "timestamp": _timestamp(),
        "code_reference": "ASCE 41-17 / ACI 318-19 Section 22.2",
        "yield_moment_kNm": float(np.round(My, 2)),
        "yield_curvature_1_m": float(np.round(phi_y * 1000.0, 4)),
        "ultimate_moment_kNm": float(np.round(Mu, 2)),
        "ultimate_curvature_1_m": float(np.round(phi_u * 1000.0, 4)),
        "ductility_ratio": float(np.round(ductility, 2)),
        "moment_demand_kNm": float(moment_demand),
        "safety_factor": float(np.round(sf_flexure, 2)),
        "is_safe": bool(is_safe),
        "curve_data": {
            "curvatures": [float(np.round(p * 1e4, 4)) for p in phi_vals],
            "moments": m_vals,
            "points": curve_points,
            "yield_point": {"curvature": float(np.round(phi_y * 1e4, 4)), "moment": float(np.round(My, 2))},
            "ultimate_point": {"curvature": float(np.round(phi_u * 1e4, 4)), "moment": float(np.round(Mu, 2))}
        }
    }

def analyze_shear_capacity(params: StructuralParameters, demand_kn: float = 0.0) -> Dict[str, Any]:
    """
    Deterministic ACI 318-19 Shear Strength Calculations with Axial Load Interaction.
    Reference: ACI 318-19 Section 22.5.
    """
    b_w = float(params.width_mm)
    h = float(params.depth_mm)
    fc = float(params.fc_mpa)
    fyt = float(params.fyt_mpa)
    cover = float(params.cover_mm)
    rho_v = float(params.transverse_reinforcement_ratio)
    N_u = float(params.axial_load_kn) * 1000.0  # N
    applied_demand = demand_kn if demand_kn > 0 else float(params.shear_demand_kn)

    d = max(100.0, h - cover - 10.0)
    Ag = b_w * h  # mm^2

    # Concrete Shear Contribution Vc (ACI 318-19 Eq. 22.5.5.1 with axial compression)
    # Vc = (0.17 * lambda * sqrt(f'c) + (N_u / (6 * Ag))) * b_w * d
    lambda_factor = 1.0  # Normal weight concrete
    axial_boost = min(0.33 * np.sqrt(fc), N_u / (6.0 * max(Ag, 1.0)))
    vc_stress = (0.17 * lambda_factor * np.sqrt(fc)) + axial_boost
    Vc_N = vc_stress * b_w * d
    Vc_kN = Vc_N / 1000.0

    # Steel Transverse Shear Contribution Vs (ACI 318-19 Eq. 22.5.10.5.3)
    # Vs = (Av * fyt * d) / s = rho_v * b_w * fyt * d
    Vs_N = rho_v * b_w * fyt * d
    Vs_kN = Vs_N / 1000.0

    # Nominal Shear Strength Vn (limit Vs <= 0.66 * sqrt(fc) * bw * d)
    Vs_max_kN = (0.66 * np.sqrt(fc) * b_w * d) / 1000.0
    Vs_kN = min(Vs_kN, Vs_max_kN)
    Vn_kN = Vc_kN + Vs_kN

    # Design Shear Strength phi * Vn (Strength reduction factor phi = 0.75)
    phi_v = 0.75
    V_cap_design_kN = phi_v * Vn_kN

    # Demand / Capacity & Safety Factor
    demand_capacity_ratio = applied_demand / max(V_cap_design_kN, 1e-4)
    safety_factor = V_cap_design_kN / max(applied_demand, 1e-4)
    is_safe = safety_factor >= 1.50

    return {
        "execution_id": _generate_exec_id(),
        "timestamp": _timestamp(),
        "code_reference": "ACI 318-19 Section 22.5",
        "concrete_shear_capacity_kN": float(np.round(Vc_kN, 2)),
        "steel_shear_capacity_kN": float(np.round(Vs_kN, 2)),
        "total_nominal_capacity_kN": float(np.round(Vn_kN, 2)),
        "design_capacity_kN": float(np.round(V_cap_design_kN, 2)),
        "demand_kN": float(np.round(applied_demand, 2)),
        "demand_capacity_ratio": float(np.round(demand_capacity_ratio, 3)),
        "safety_factor": float(np.round(safety_factor, 2)),
        "is_safe": bool(is_safe)
    }

def optimize_cfrp_retrofit(params: StructuralParameters, current_demand_kn: float = 0.0) -> Dict[str, Any]:
    """
    Deterministic ACI 440.2R-17 CFRP Shear Strengthening Design Optimization.
    Calculates exact composite ply schedule to restore Safety Factor >= 1.50.
    """
    target_sf = 1.50
    applied_demand = current_demand_kn if current_demand_kn > 0 else float(params.shear_demand_kn)
    target_capacity_kN = applied_demand * target_sf

    # Baseline calculations
    base_res = analyze_shear_capacity(params, applied_demand)
    current_capacity_kN = base_res["design_capacity_kN"]
    initial_sf = base_res["safety_factor"]
    deficit_kN = max(0.0, target_capacity_kN - current_capacity_kN)

    # Standard High-Strength Unidirectional Carbon Fiber (SikaWrap-300C / Tyfo SCH-41)
    # Properties per ACI 440.2R Table 13.1
    Ef = 230000.0  # Fiber Modulus MPa
    tf_ply = 0.166  # Nominal design thickness per ply mm
    eps_fu = 0.015  # Ultimate strain
    
    # Effective strain limit per ACI 440.2R Section 11.4: eps_fe = min(0.004, 0.75 * eps_fu)
    eps_fe = min(0.004, 0.75 * eps_fu)
    ffe = Ef * eps_fe  # Effective tensile stress in CFRP = 920 MPa

    h = float(params.depth_mm)
    cover = float(params.cover_mm)
    dfv = h - cover  # Effective depth of CFRP jacket (mm)

    # Reduction factors per ACI 440.2R
    psi_f = 0.85  # 3-sided / continuous wrap
    phi_v = 0.75  # ACI shear phi

    # Design strength contribution per single continuous 2-leg layer of CFRP:
    # Vf_ply = (2 * tf * ffe * dfv) / 1000  (kN)
    Vf_per_ply_kN = (2.0 * tf_ply * ffe * dfv) / 1000.0
    phi_psi_Vf_per_ply = phi_v * psi_f * Vf_per_ply_kN

    # Determine required plies
    if deficit_kN > 0:
        required_plies = int(np.ceil(deficit_kN / max(phi_psi_Vf_per_ply, 1e-4)))
        required_plies = max(required_plies, 1)
    else:
        # Prevent zero-ply recommendation when strengthening is requested
        required_plies = 1

    total_Vf_kN = required_plies * Vf_per_ply_kN
    cfrp_design_addition_kN = phi_v * psi_f * total_Vf_kN
    post_retrofit_capacity_kN = current_capacity_kN + cfrp_design_addition_kN
    post_retrofit_sf = post_retrofit_capacity_kN / max(applied_demand, 1e-4)
    improvement_pct = ((post_retrofit_capacity_kN - current_capacity_kN) / current_capacity_kN) * 100.0

    # Layer buildup visualization data
    layer_steps = []
    for ply in range(0, required_plies + 2):
        cap = current_capacity_kN + (ply * phi_psi_Vf_per_ply)
        sf = cap / max(applied_demand, 1e-4)
        layer_steps.append({
            "layers": ply,
            "capacity_kN": float(np.round(cap, 2)),
            "safety_factor": float(np.round(sf, 2)),
            "is_target_met": bool(sf >= target_sf)
        })

    return {
        "execution_id": _generate_exec_id(),
        "timestamp": _timestamp(),
        "code_reference": "ACI 440.2R-17 Section 11",
        "composite_material": "High-Strength Carbon Fiber (SikaWrap-300C / Epoxy Matrix)",
        "target_safety_factor": float(target_sf),
        "initial_safety_factor": float(np.round(initial_sf, 2)),
        "applied_demand_kN": float(np.round(applied_demand, 2)),
        "shear_deficit_kN": float(np.round(deficit_kN, 2)),
        "required_cfrp_layers": int(required_plies),
        "ply_thickness_total_mm": float(np.round(required_plies * tf_ply, 3)),
        "effective_fiber_stress_mpa": float(np.round(ffe, 1)),
        "cfrp_nominal_strength_kN": float(np.round(total_Vf_kN, 2)),
        "added_design_capacity_kN": float(np.round(cfrp_design_addition_kN, 2)),
        "pre_retrofit_capacity_kN": float(np.round(current_capacity_kN, 2)),
        "post_retrofit_capacity_kN": float(np.round(post_retrofit_capacity_kN, 2)),
        "post_retrofit_safety_factor": float(np.round(post_retrofit_sf, 2)),
        "improvement_percentage": float(np.round(improvement_pct, 1)),
        "is_compliant": bool(post_retrofit_sf >= target_sf),
        "ply_optimization_curve": layer_steps
    }
