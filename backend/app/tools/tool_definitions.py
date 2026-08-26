from google.genai import types

inspect_incident_tool = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="inspect_incident",
            description="Deconstructs the infrastructure incident telemetry, structural geometry, material strengths, and sensor anomalies.",
            parameters=types.Schema(
                type="OBJECT",
                properties={
                    "incident_id": types.Schema(
                        type="STRING",
                        description="The unique identifier of the incident."
                    )
                },
                required=["incident_id"]
            )
        )
    ]
)

analyze_shear_capacity_tool = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="analyze_shear_capacity",
            description="Executes deterministic ACI 318-19 shear capacity calculations including concrete contribution (Vc), steel stirrup contribution (Vs), and axial load interaction.",
            parameters=types.Schema(
                type="OBJECT",
                properties={
                    "demand_kn": types.Schema(
                        type="NUMBER",
                        description="Applied shear force demand in kN. If 0, uses incident design demand."
                    )
                }
            )
        )
    ]
)

analyze_moment_curvature_tool = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="analyze_moment_curvature",
            description="Performs non-linear moment-curvature section analysis under axial load to compute yield moment, ultimate moment, ductility ratio, and full M-phi curve.",
            parameters=types.Schema(
                type="OBJECT",
                properties={}
            )
        )
    ]
)

run_structural_simulation_tool = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="run_structural_simulation",
            description="Executes a high-fidelity OpenSeesPy finite element simulation in an isolated execution sandbox to assess non-linear pushover behavior and hinge formation.",
            parameters=types.Schema(
                type="OBJECT",
                properties={
                    "axial_load_kn": types.Schema(type="NUMBER", description="Axial compression force in kN."),
                    "include_fiber_discretization": types.Schema(type="BOOLEAN", description="Whether to use 2D fiber discretization.")
                }
            )
        )
    ]
)

optimize_cfrp_retrofit_tool = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="optimize_cfrp_retrofit",
            description="Designs and optimizes an ACI 440.2R Carbon Fiber Reinforced Polymer (CFRP) composite jacket to restore structural safety factor to >= 1.50.",
            parameters=types.Schema(
                type="OBJECT",
                properties={
                    "target_safety_factor": types.Schema(
                        type="NUMBER",
                        description="Target Safety Factor (default 1.50)."
                    )
                }
            )
        )
    ]
)

validate_engineering_result_tool = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="validate_engineering_result",
            description="Performs independent engineering validation against ACI/ASCE safety criteria, checks calculation provenance, and verifies if current evidence sufficiently explains the incident anomaly.",
            parameters=types.Schema(
                type="OBJECT",
                properties={
                    "metric": types.Schema(type="STRING", description="The metric being audited, e.g. 'safety_factor' or 'anomaly_explanation'."),
                    "value": types.Schema(type="NUMBER", description="Numerical value of the metric."),
                    "context": types.Schema(type="STRING", description="Engineering context and rationale for verification.")
                },
                required=["metric", "value", "context"]
            )
        )
    ]
)

ALL_COMMANDER_TOOLS = [
    inspect_incident_tool,
    analyze_shear_capacity_tool,
    analyze_moment_curvature_tool,
    run_structural_simulation_tool,
    optimize_cfrp_retrofit_tool,
    validate_engineering_result_tool
]
