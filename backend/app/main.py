import asyncio
import uuid
from typing import Dict, Any, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.app.config import settings
from backend.app.schemas.incident import InfrastructureAnomalyPayload
from backend.app.schemas.mission import MissionState, MissionStage
from backend.app.orchestration.event_bus import global_event_bus
from backend.app.orchestration.mission_store import global_mission_store
from backend.app.orchestration.mission_runner import run_mission
from backend.app.services.dossier import generate_dossier
from backend.app.services.scenarios import SCENARIOS, list_scenario_summaries, get_bridge_pier_scenario

app = FastAPI(
    title="GeoSentinel Fleet API",
    description="Autonomous Multi-Agent Infrastructure Emergency Response Platform",
    version="1.0.0"
)

# CORS configuration supporting environment-configured origins and wildcards
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TriggerRequest(BaseModel):
    scenario: Optional[str] = "BRIDGE_PIER"
    custom_payload: Optional[InfrastructureAnomalyPayload] = None

@app.get("/")
async def root():
    return {
        "system": "GeoSentinel Fleet",
        "status": "OPERATIONAL",
        "gemini_model": settings.GEMINI_MODEL,
        "safety_threshold": settings.SAFETY_FACTOR_THRESHOLD,
        "active_missions": len(global_mission_store._missions)
    }

@app.get("/health")
async def health_check():
    """
    Lightweight health check endpoint for Render / cloud container health monitoring.
    Does NOT require Gemini API credentials to return 200 OK.
    """
    return {
        "status": "ok",
        "service": "geosentinel-backend"
    }

@app.get("/api/v1/scenarios")
async def get_scenarios():
    return list_scenario_summaries()

@app.post("/api/v1/trigger-incident")
async def trigger_incident(
    request_body: Dict[str, Any] = Body(...),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    mission_id = str(uuid.uuid4())

    # Check if payload is a scenario name or a full incident payload
    scenario_id = request_body.get("scenario")
    if scenario_id and scenario_id in SCENARIOS:
        payload = SCENARIOS[scenario_id]()
    elif "structural_parameters" in request_body:
        payload = InfrastructureAnomalyPayload(**request_body)
    else:
        # Default fallback to Bridge Pier demo
        payload = get_bridge_pier_scenario()

    # Initialize mission state
    state = MissionState(
        mission_id=mission_id,
        incident=payload,
        stage=MissionStage.PLANNING
    )
    global_mission_store.save_mission(state)

    # Launch asynchronous multi-agent orchestration
    background_tasks.add_task(run_mission, mission_id)

    return {
        "mission_id": mission_id,
        "status": "Mission Initialized",
        "incident_id": payload.incident_id,
        "structure_type": payload.structure_type,
        "location": payload.location,
        "severity": payload.severity
    }

@app.get("/api/v1/incidents/{mission_id}")
async def get_incident(mission_id: str):
    state = global_mission_store.get_mission(mission_id)
    if not state:
        raise HTTPException(status_code=404, detail="Mission not found")
    return state.model_dump()

@app.get("/api/v1/incidents/{mission_id}/dossier")
async def get_dossier(mission_id: str):
    state = global_mission_store.get_mission(mission_id)
    if not state:
        raise HTTPException(status_code=404, detail="Mission not found")

    markdown_content = generate_dossier(state)
    return {
        "mission_id": mission_id,
        "dossier_markdown": markdown_content,
        "stage": state.stage.value,
        "pre_retrofit_sf": state.initial_safety_factor,
        "post_retrofit_sf": state.post_retrofit_safety_factor
    }

@app.websocket("/ws/swarm-feed")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    q = await global_event_bus.subscribe()

    try:
        while True:
            event_json = await q.get()
            await websocket.send_text(event_json)
    except WebSocketDisconnect:
        global_event_bus.unsubscribe(q)
    except Exception:
        global_event_bus.unsubscribe(q)
