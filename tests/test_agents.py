import pytest
import uuid
from backend.app.schemas.mission import MissionState, MissionStage
from backend.app.services.scenarios import get_bridge_pier_scenario
from backend.app.agents.structural_agent import StructuralAgent
from backend.app.agents.simulation_agent import SimulationAgent
from backend.app.agents.retrofit_agent import RetrofitAgent
from backend.app.agents.validation_agent import ValidationAgent

@pytest.fixture
def mission_state():
    return MissionState(
        mission_id=str(uuid.uuid4()),
        incident=get_bridge_pier_scenario(),
        stage=MissionStage.EXECUTION
    )

@pytest.mark.asyncio
async def test_structural_agent(mission_state):
    agent = StructuralAgent(mission_state)
    res = await agent.analyze_shear(1200.0)
    assert res["success"] is True
    assert res["data"]["safety_factor"] > 0
    assert mission_state.shear_capacity_data is not None

@pytest.mark.asyncio
async def test_simulation_agent(mission_state):
    agent = SimulationAgent(mission_state)
    res = await agent.execute_simulation(axial_load_kn=2000.0, include_fiber=True)
    assert res["success"] is True
    assert "ductility_ratio" in res["data"] or "raw_stdout" in res["data"]

@pytest.mark.asyncio
async def test_retrofit_agent(mission_state):
    agent = RetrofitAgent(mission_state)
    res = await agent.optimize_cfrp(target_sf=1.50)
    assert res["success"] is True
    assert res["data"]["post_retrofit_safety_factor"] >= 1.50
    assert mission_state.retrofit_required is True

@pytest.mark.asyncio
async def test_validation_agent_rejection_and_acceptance(mission_state):
    agent = ValidationAgent(mission_state)
    
    # 1. Deficit check
    res_fail = await agent.validate("safety_factor", 0.94, "Pre-retrofit flexural capacity")
    assert res_fail["data"]["is_valid"] is False
    assert res_fail["data"]["action_recommended"] == "REPLAN_INVESTIGATION"

    # 2. Pass check
    res_pass = await agent.validate("safety_factor", 1.88, "Post-retrofit capacity")
    assert res_pass["data"]["is_valid"] is True
    assert res_pass["data"]["action_recommended"] == "PROCEED"
