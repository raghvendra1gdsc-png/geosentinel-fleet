import pytest
import uuid
from backend.app.schemas.mission import MissionState, MissionStage
from backend.app.services.scenarios import get_bridge_pier_scenario
from backend.app.orchestration.mission_store import global_mission_store
from backend.app.orchestration.mission_runner import run_mission
from backend.app.services.dossier import generate_dossier

@pytest.mark.asyncio
async def test_end_to_end_adaptive_replanning_mission():
    """
    Verifies the full autonomous lifecycle:
    Incident -> Shear -> Validation Flag -> Replanning -> Moment-Curvature -> Retrofit -> Validation -> Completion.
    """
    mission_id = str(uuid.uuid4())
    payload = get_bridge_pier_scenario()
    
    state = MissionState(
        mission_id=mission_id,
        incident=payload,
        stage=MissionStage.PLANNING
    )
    global_mission_store.save_mission(state)

    # Execute full multi-agent orchestration
    await run_mission(mission_id)

    # Fetch updated state
    updated_state = global_mission_store.get_mission(mission_id)
    assert updated_state is not None
    assert updated_state.stage == MissionStage.COMPLETE
    assert len(updated_state.events) >= 8

    # Verify that replanning event occurred
    replan_events = [e for e in updated_state.events if e.event_type == "REPLANNING" or "REPLANNING" in e.message]
    assert len(replan_events) >= 1

    # Verify that validation agent flagged evidence and subsequently passed retrofit
    val_flags = [e for e in updated_state.events if e.agent == "ValidationAgent"]
    assert len(val_flags) >= 2

    # Verify retrofit was designed and safety factor was elevated
    assert updated_state.retrofit_required is True
    assert updated_state.post_retrofit_safety_factor is not None
    assert updated_state.post_retrofit_safety_factor >= 1.50

    # Verify executive decision and dossier synthesis
    assert updated_state.final_decision is not None
    dossier_md = generate_dossier(updated_state)
    assert "GEOSENTINEL FLEET" in dossier_md
    assert "EXECUTIVE SUMMARY" in dossier_md
    assert "DETERMINISTIC ENGINEERING CALCULATIONS" in dossier_md
    assert "ACI 440.2R" in dossier_md
