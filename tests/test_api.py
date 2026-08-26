import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from unittest.mock import patch

@pytest.mark.asyncio
async def test_root_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["system"] == "GeoSentinel Fleet"
    assert data["status"] == "OPERATIONAL"

@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "geosentinel-backend"

@pytest.mark.asyncio
async def test_get_scenarios():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/scenarios")
    assert response.status_code == 200
    scenarios = response.json()
    assert len(scenarios) >= 3
    ids = [s["id"] for s in scenarios]
    assert "BRIDGE_PIER" in ids

@pytest.mark.asyncio
@patch("backend.app.main.run_mission")
async def test_trigger_incident(mock_run_mission):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/v1/trigger-incident", json={"scenario": "BRIDGE_PIER"})
    assert response.status_code == 200
    data = response.json()
    assert "mission_id" in data
    assert data["status"] == "Mission Initialized"
    assert data["structure_type"] == "Reinforced Concrete Bridge Pier"

@pytest.mark.asyncio
async def test_get_incident_not_found():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/incidents/non-existent-uuid")
    assert response.status_code == 404
