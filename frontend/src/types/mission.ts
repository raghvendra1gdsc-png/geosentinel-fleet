export interface SensorReading {
  sensor_id: string;
  sensor_type: string;
  value: number;
  unit: string;
  timestamp: string;
  status?: string;
}

export interface StructuralParameters {
  material: string;
  section_type: string;
  width_mm: number;
  depth_mm: number;
  fc_mpa: number;
  fy_mpa: number;
  fyt_mpa: number;
  cover_mm: number;
  longitudinal_reinforcement_ratio: number;
  transverse_reinforcement_ratio: number;
  stirrup_spacing_mm?: number;
  axial_load_kn: number;
  span_or_height_mm: number;
  shear_demand_kn: number;
  moment_demand_knm: number;
}

export interface Incident {
  incident_id: string;
  location: string;
  structure_type: string;
  description: string;
  severity: string;
  suspected_failure_mode?: string;
  structural_parameters: StructuralParameters;
  sensor_readings: SensorReading[];
}

export interface MissionEvent {
  event_id: string;
  mission_id: string;
  timestamp: string;
  elapsed_seconds?: number;
  agent: string;
  stage: string;
  event_type: string;
  message: string;
  tool?: string;
  tool_input?: any;
  tool_output?: any;
  status: string;
}

export interface EngineeringResult {
  metric: string;
  value: number;
  unit: string;
  source: string;
  execution_id: string;
  timestamp: string;
  code_reference?: string;
  validated: boolean;
  details?: any;
}

export interface ValidationResult {
  is_valid: boolean;
  reason: string;
  metric: string;
  threshold: number;
  actual_value: number;
  action_recommended: string;
  timestamp: string;
}

export interface MissionState {
  mission_id: string;
  incident: Incident;
  stage: string;
  start_time?: string;
  hypotheses?: string[];
  current_hypothesis?: string;
  investigation_plan?: string[];
  completed_actions?: string[];
  active_agent?: string | null;
  confidence?: number;
  initial_safety_factor?: number | null;
  post_retrofit_safety_factor?: number | null;
  retrofit_required?: boolean;
  retrofit_details?: any;
  validation_history?: ValidationResult[];
  final_decision?: string | null;
  events: MissionEvent[];
  moment_curvature_data?: any;
  shear_capacity_data?: any;
  retrofit_data?: any;
}

export interface ScenarioSummary {
  id: string;
  name: string;
  structure: string;
  location: string;
  severity: string;
  feature: string;
}
