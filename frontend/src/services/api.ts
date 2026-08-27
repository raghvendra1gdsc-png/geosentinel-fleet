import type { MissionState, ScenarioSummary } from '../types/mission';

function getApiBaseUrl(): string {
  // 1. Explicit Vite Environment Variable
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return `${envUrl.trim().replace(/\/$/, '')}/api/v1`;
  }

  // 2. Default Local Development
  return "http://localhost:8000/api/v1";
}

const API_BASE = getApiBaseUrl();

export const api = {
  async getScenarios(): Promise<ScenarioSummary[]> {
    const res = await fetch(`${API_BASE}/scenarios`);
    if (!res.ok) throw new Error(`Failed to fetch scenarios from ${API_BASE}`);
    return res.json();
  },

  async triggerIncident(scenarioId: string = "BRIDGE_PIER"): Promise<{ mission_id: string; status: string }> {
    const res = await fetch(`${API_BASE}/trigger-incident`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario: scenarioId })
    });
    if (!res.ok) throw new Error(`Failed to trigger incident at ${API_BASE}`);
    return res.json();
  },
  
  async getMission(missionId: string): Promise<MissionState> {
    const res = await fetch(`${API_BASE}/incidents/${missionId}`);
    if (!res.ok) throw new Error(`Failed to fetch mission state for ${missionId}`);
    return res.json();
  },
  
  async getDossier(missionId: string): Promise<{ mission_id: string; dossier_markdown: string }> {
    const res = await fetch(`${API_BASE}/incidents/${missionId}/dossier`);
    if (!res.ok) throw new Error(`Failed to fetch dossier for ${missionId}`);
    return res.json();
  },

  async getHealth(): Promise<{ status: string; gemini_configured?: boolean }> {
    const rootUrl = API_BASE.replace('/api/v1', '');
    const res = await fetch(`${rootUrl}/health`);
    if (!res.ok) throw new Error(`Health check failed at ${rootUrl}`);
    return res.json();
  }
};
