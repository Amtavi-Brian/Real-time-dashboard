"""WebSocket route for the real-time dashboard channel."""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket.manager import manager

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/dashboard")
async def dashboard_socket(websocket: WebSocket) -> None:
    await manager.connect(websocket)
    try:
        while True:
            # The dashboard channel is server-push only; drain any client
            # frames (e.g. pings) without acting on them.
            await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
