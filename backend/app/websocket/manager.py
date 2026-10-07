"""Connection manager for the real-time dashboard WebSocket channel."""
from __future__ import annotations

import asyncio
import json
from datetime import datetime, timezone

from fastapi import WebSocket


class ConnectionManager:
    """Tracks connected dashboard clients and broadcasts live updates to them."""

    def __init__(self) -> None:
        self._connections: set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._connections.add(websocket)

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            self._connections.discard(websocket)

    async def broadcast(self, message: dict) -> None:
        payload = json.dumps(message, default=str)
        stale: list[WebSocket] = []
        async with self._lock:
            connections = list(self._connections)
        for connection in connections:
            try:
                await connection.send_text(payload)
            except Exception:  # noqa: BLE001 - drop unreachable sockets
                stale.append(connection)
        if stale:
            async with self._lock:
                for connection in stale:
                    self._connections.discard(connection)

    @property
    def active_count(self) -> int:
        return len(self._connections)


def dashboard_update_message(metrics: dict, charts: dict | None = None, alert: dict | None = None) -> dict:
    payload: dict = {"metrics": metrics, "updatedAt": datetime.now(timezone.utc).isoformat()}
    if charts:
        payload["charts"] = charts
    if alert:
        payload["alert"] = alert
    return {"type": "dashboard.update", "payload": payload}


manager = ConnectionManager()
