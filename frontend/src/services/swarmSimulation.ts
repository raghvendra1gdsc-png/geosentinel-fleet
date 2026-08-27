import type { MissionEvent } from '../types/mission';

// High-fidelity standard baseline engineering datasets
export const BASELINE_MC_DATA = {
  execution_id: "fea-asce41-fiber-84920",
  timestamp: new Date().toISOString(),
  code_reference: "ASCE 41-17 / ACI 318-19 Section 22.2",
  yield_moment_kNm: 540.0,
  yield_curvature_1_m: 0.0029,
  ultimate_moment_kNm: 750.0,
  ultimate_curvature_1_m: 0.0056,
  ductility_ratio: 4.2,
  moment_demand_kNm: 800.0,
  safety_factor: 0.94,
  is_safe: false,
  curve_data: {
    points: [
      { curvature: 0.0, moment: 0.0 },
      { curvature: 0.0005, moment: 120.0 },
      { curvature: 0.0010, moment: 245.0 },
      { curvature: 0.0015, moment: 370.0 },
      { curvature: 0.0020, moment: 460.0 },
      { curvature: 0.0025, moment: 515.0 },
      { curvature: 0.0029, moment: 540.0 }, // Yield Point
      { curvature: 0.0035, moment: 620.0 },
      { curvature: 0.0040, moment: 680.0 },
      { curvature: 0.0048, moment: 730.0 },
      { curvature: 0.0056, moment: 750.0 }, // Ultimate Point
      { curvature: 0.0065, moment: 710.0 },
      { curvature: 0.0075, moment: 640.0 },
      { curvature: 0.0085, moment: 560.0 }
    ]
  }
};

export const BASELINE_SHEAR_DATA = {
  execution_id: "shear-aci318-sec22-10492",
  timestamp: new Date().toISOString(),
  code_reference: "ACI 318-19 Section 22.5",
  concrete_shear_capacity_kN: 420.0,
  steel_shear_capacity_kN: 430.0,
  total_nominal_capacity_kN: 850.0,
  design_capacity_kN: 850.0,
  demand_kN: 550.0,
  demand_capacity_ratio: 0.647,
  safety_factor: 1.54,
  is_safe: true
};

export const BASELINE_RETROFIT_DATA = {
  execution_id: "cfrp-aci440-opt-59302",
  timestamp: new Date().toISOString(),
  code_reference: "ACI 440.2R-17 Section 11",
  composite_material: "High-Strength Unidirectional Carbon Fiber (SikaWrap-300C / Epoxy)",
  target_safety_factor: 1.50,
  initial_safety_factor: 0.94,
  applied_demand_kN: 800.0,
  required_cfrp_layers: 3,
  ply_thickness_total_mm: 3.0,
  effective_fiber_stress_mpa: 230000.0,
  cfrp_nominal_strength_kN: 640.0,
  added_design_capacity_kN: 640.0,
  pre_retrofit_capacity_kN: 750.0,
  post_retrofit_capacity_kN: 1390.0,
  post_retrofit_safety_factor: 1.74,
  improvement_percentage: 85.1,
  is_compliant: true,
  ply_optimization_curve: [
    { layers: 0, capacity_kN: 750.0, safety_factor: 0.94, is_target_met: false },
    { layers: 1, capacity_kN: 960.0, safety_factor: 1.20, is_target_met: false },
    { layers: 2, capacity_kN: 1180.0, safety_factor: 1.47, is_target_met: false },
    { layers: 3, capacity_kN: 1390.0, safety_factor: 1.74, is_target_met: true },
    { layers: 4, capacity_kN: 1580.0, safety_factor: 1.98, is_target_met: true },
    { layers: 5, capacity_kN: 1750.0, safety_factor: 2.19, is_target_met: true }
  ]
};

export const DETERMINISTIC_MISSION_EVENTS: Omit<MissionEvent, 'event_id' | 'mission_id'>[] = [
  {
    timestamp: new Date().toISOString(),
    elapsed_seconds: 0.0,
    agent: "Commander",
    stage: "PLANNING",
    event_type: "DECISION",
    message: "Mission initialized for Reinforced Concrete Bridge Pier (San Mateo Bridge Span 14A). Severity: HIGH. Engaging Autonomous Multi-Agent Swarm.",
    status: "SUCCESS"
  },
  {
    timestamp: new Date().toISOString(),
    elapsed_seconds: 0.8,
    agent: "Commander",
    stage: "PLANNING",
    event_type: "DECISION",
    message: "[HYPOTHESIS] H1: Surface spalling and elevated microstrain (2,140 με) indicate primary shear failure at pier base.\n[ACTION] Dispatching StructuralAgent → analyze_shear_capacity (ACI 318-19) with demand_kn=550.0.",
    status: "SUCCESS"
  },
  {
    timestamp: new Date().toISOString(),
    elapsed_seconds: 1.6,
    agent: "Commander",
    stage: "EXECUTION",
    event_type: "DELEGATION",
    message: "[DISPATCH] StructuralAgent.analyze_shear_capacity(demand_kn=550.0)",
    tool: "analyze_shear_capacity",
    tool_input: { demand_kn: 550.0 },
    status: "SUCCESS"
  },
  {
    timestamp: new Date().toISOString(),
    elapsed_seconds: 2.5,
    agent: "StructuralAgent",
    stage: "EXECUTION",
    event_type: "RESULT",
    message: "[OBSERVATION] ACI 318-19 Shear Analysis: Vc=420.0kN, Vs=430.0kN, φVn=850.0kN. Applied Demand=550.0kN. Safety Factor = 1.54 (PASS).\n[EVALUATION] Shear capacity exceeds demand. H1 (primary shear failure) is NOT confirmed by calculations.",
    tool: "analyze_shear_capacity",
    tool_output: BASELINE_SHEAR_DATA,
    status: "SUCCESS"
  },
  {
    timestamp: new Date().toISOString(),
    elapsed_seconds: 3.5,
    agent: "Commander",
    stage: "VALIDATION",
    event_type: "DELEGATION",
    message: "[DISPATCH] ValidationAgent.validate_engineering_result(metric='anomaly_explanation', value=1.54, context='Shear spalling and strain anomaly observed')\n[EVALUATION] Shear SF=1.54 PASSES code check, but physical telemetry (microstrain=2,140 με) contradicts structural adequacy.",
    tool: "validate_engineering_result",
    tool_input: { metric: "anomaly_explanation", value: 1.54, context: "Shear spalling and strain anomaly observed" },
    status: "SUCCESS"
  },
  {
    timestamp: new Date().toISOString(),
    elapsed_seconds: 4.4,
    agent: "ValidationAgent",
    stage: "VALIDATION",
    event_type: "VALIDATION_FLAG",
    message: "[OBSERVATION] INDEPENDENT AUDIT REJECTION: Shear analysis returned SF=1.54 (PASS), which DOES NOT explain the severe strain readings (2,140 με) and acoustic spalling (84.5 dB) observed in physical telemetry.\n[EVALUATION] Validation Sentinel has REJECTED the shear-only hypothesis. Action recommended: REPLAN_INVESTIGATION.",
    tool: "validate_engineering_result",
    tool_output: {
      is_valid: false,
      reason: "INSUFFICIENT EVIDENCE: Shear analysis returned SF=1.54 (PASS), which DOES NOT explain severe strain readings (2,140 με) and acoustic spalling (84.5 dB). Secondary flexural/ductility failure suspected.",
      metric: "anomaly_explanation",
      threshold: 1.5,
      actual_value: 1.54,
      action_recommended: "REPLAN_INVESTIGATION"
    },
    status: "WARNING"
  },
  {
    timestamp: new Date().toISOString(),
    elapsed_seconds: 5.6,
    agent: "Commander",
    stage: "REPLANNING",
    event_type: "REPLANNING",
    message: "[EVIDENCE_DISCREPANCY] Shear capacity is verified safe (SF=1.54), but observed sensor telemetry (microstrain=2,140 με, acoustic emission=84.5 dB) indicates severe structural distress. Shear alone DOES NOT explain the physical damage.\n[HYPOTHESIS] H2: Damage is caused by flexural yield, cyclic ductility degradation, and plastic hinge formation — not shear.\n[ACTION] Deploying OpenSeesPy FEA pushover simulation and ASCE 41-17 Moment-Curvature analysis.",
    status: "SUCCESS"
  },
  {
    timestamp: new Date().toISOString(),
    elapsed_seconds: 6.8,
    agent: "Commander",
    stage: "EXECUTION",
    event_type: "DELEGATION",
    message: "[DISPATCH] SimulationAgent.run_structural_simulation(axial_load_kn=3500.0, include_fiber_discretization=True)",
    tool: "run_structural_simulation",
    tool_input: { axial_load_kn: 3500.0, include_fiber_discretization: true },
    status: "SUCCESS"
  },
  {
    timestamp: new Date().toISOString(),
    elapsed_seconds: 8.0,
    agent: "SimulationAgent",
    stage: "EXECUTION",
    event_type: "RESULT",
    message: "[OBSERVATION] OpenSeesPy FEA Pushover complete. 288 Fiber sections converged. Peak Moment=750.0kNm, Plastic Hinge ductility ratio=4.2.\n[EVALUATION] Non-linear fiber model confirms plastic hinge formation under axial-flexural interaction. True Safety Factor = 0.94 (CRITICAL DEFICIT).",
    tool: "run_structural_simulation",
    tool_output: BASELINE_MC_DATA,
    status: "WARNING"
  },
  {
    timestamp: new Date().toISOString(),
    elapsed_seconds: 9.2,
    agent: "Commander",
    stage: "RETROFIT",
    event_type: "DELEGATION",
    message: "[ACTION] Flexural deficit confirmed (SF=0.94 < 1.50). Activating RetrofitAgent → optimize_cfrp_retrofit(target_sf=1.50) per ACI 440.2R-17.",
    tool: "optimize_cfrp_retrofit",
    tool_input: { target_safety_factor: 1.50 },
    status: "SUCCESS"
  },
  {
    timestamp: new Date().toISOString(),
    elapsed_seconds: 10.5,
    agent: "RetrofitAgent",
    stage: "RETROFIT",
    event_type: "RESULT",
    message: "[OBSERVATION] CFRP Retrofit Optimization: Designed 3-layer continuous SikaWrap-300C composite jacket (total thickness 3.00mm). Added Capacity = +640.0kNm (+85.1%). Post-Retrofit SF = 1.74.\n[EVALUATION] CFRP jacket restores safety margin above emergency threshold (SF ≥ 1.50).",
    tool: "optimize_cfrp_retrofit",
    tool_output: BASELINE_RETROFIT_DATA,
    status: "SUCCESS"
  },
  {
    timestamp: new Date().toISOString(),
    elapsed_seconds: 11.5,
    agent: "ValidationAgent",
    stage: "VALIDATION",
    event_type: "VALIDATION_PASS",
    message: "[OBSERVATION] INDEPENDENT VERIFICATION PASSED: Post-retrofit safety factor 1.74 exceeds emergency threshold 1.50. ACI 440.2R-17 and ASCE 41-17 compliance verified.\n[EVALUATION] All safety criteria satisfied. Mission certified safe.",
    tool: "validate_engineering_result",
    tool_output: {
      is_valid: true,
      reason: "Safety factor 1.74 satisfies ACI/ASCE emergency threshold (>= 1.50).",
      metric: "safety_factor",
      threshold: 1.5,
      actual_value: 1.74,
      action_recommended: "PROCEED"
    },
    status: "SUCCESS"
  },
  {
    timestamp: new Date().toISOString(),
    elapsed_seconds: 12.4,
    agent: "Commander",
    stage: "COMPLETE",
    event_type: "DECISION",
    message: `MISSION_COMPLETE

[HYPOTHESIS TRAIL]
  H1: Primary shear failure → REFUTED (Shear SF=1.54, physical damage unexplained)
  H2: Flexural yield & plastic hinge → CONFIRMED (True SF=0.94, Critical Deficit)

[EXECUTIVE SUMMARY]
  Structural condition: HIGH RISK (SF=0.94) → MITIGATED (SF=1.74)
  Primary failure mechanism: Flexural Plastic Hinge Yielding (not shear)
  Prescribed Intervention: 3-ply high-strength unidirectional CFRP composite jacket (SikaWrap-300C/Epoxy)
  Immediate Action: Enforce 25-ton gross vehicle load restriction until composite cure (72 hours)
  Code Compliance: ACI 318-19 ✓ | ASCE 41-17 ✓ | ACI 440.2R-17 ✓`,
    status: "SUCCESS"
  }
];
