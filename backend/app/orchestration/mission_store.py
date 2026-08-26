from typing import Dict
from backend.app.schemas.mission import MissionState

class MissionStore:
    def __init__(self):
        self._missions: Dict[str, MissionState] = {}

    def get_mission(self, mission_id: str) -> MissionState:
        return self._missions.get(mission_id)

    def save_mission(self, state: MissionState):
        self._missions[state.mission_id] = state

    def update_mission(self, mission_id: str, state: MissionState):
        self._missions[mission_id] = state

global_mission_store = MissionStore()
