import asyncio
import json
from typing import Callable, Awaitable
from backend.app.schemas.artifacts import MissionEvent

class EventBus:
    def __init__(self):
        self._queues = []

    async def subscribe(self) -> asyncio.Queue:
        q = asyncio.Queue()
        self._queues.append(q)
        return q

    def unsubscribe(self, q: asyncio.Queue):
        if q in self._queues:
            self._queues.remove(q)

    async def broadcast(self, event: MissionEvent):
        # Fire and forget to all connected queues
        for q in self._queues:
            await q.put(event.model_dump_json())

global_event_bus = EventBus()
