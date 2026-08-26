import pytest
import json
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.orchestration.event_bus import global_event_bus
from backend.app.schemas.artifacts import MissionEvent

def test_websocket_stream():
    client = TestClient(app)
    with client.websocket_connect("/ws/swarm-feed") as websocket:
        # Create and broadcast dummy event
        test_evt = MissionEvent(
            event_id="test-e1",
            mission_id="test-m1",
            timestamp="2026-08-26T14:00:00Z",
            elapsed_seconds=1.2,
            agent="Commander",
            stage="PLANNING",
            event_type="DECISION",
            message="Test swarm event broadcast",
            status="SUCCESS"
        )
        
        # Broadcast event
        import asyncio
        asyncio.run(global_event_bus.broadcast(test_evt))
        
        # Receive on websocket
        data = websocket.receive_text()
        parsed = json.loads(data)
        assert parsed["agent"] == "Commander"
        assert parsed["stage"] == "PLANNING"
        assert parsed["message"] == "Test swarm event broadcast"
