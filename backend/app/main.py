"""FastAPI application entrypoint."""
import asyncio
import math
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import Base, SessionLocal, engine
from app.models import alert, analytics, attendance, department, employee, leave, overtime, payroll, user  # noqa: F401
from app.routers import alerts, analytics as analytics_router, attendance as attendance_router, auth
from app.routers import departments, employees, leave as leave_router, overtime as overtime_router, payroll as payroll_router, reports
from app.services.analytics_service import get_analytics
from app.services.attendance_service import list_departments
from app.websocket.manager import dashboard_update_message, manager
from app.websocket.routes import router as websocket_router

settings = get_settings()


def _aggregate_metrics(db) -> dict:
    departments = list_departments(db)
    headcount = sum(item["headcount"] for item in departments) or 1
    attendance_rate = sum(item["attendanceRate"] * item["headcount"] for item in departments) / headcount
    overtime_hours = sum(item["overtimeHours"] for item in departments)
    labour_cost = sum(item["wageCost"] for item in departments)
    return {
        "attendanceRate": round(attendance_rate, 1),
        "overtimeHours": round(overtime_hours, 1),
        "averageOvertime": round(overtime_hours / headcount, 1),
        "labourCost": round(labour_cost, 2),
    }


async def _broadcast_loop() -> None:
    tick = 0
    while True:
        await asyncio.sleep(settings.ws_broadcast_interval_seconds)
        if manager.active_count == 0:
            continue
        tick += 1
        db = SessionLocal()
        try:
            metrics = _aggregate_metrics(db)
            metrics["attendanceRate"] = round(metrics["attendanceRate"] + math.sin(tick) * 0.3, 1)
            charts = get_analytics(db, "attendance")
        finally:
            db.close()
        await manager.broadcast(dashboard_update_message(metrics, {"attendance": charts["attendance"]}))


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    task = asyncio.create_task(_broadcast_loop())
    try:
        yield
    finally:
        task.cancel()


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(employees.router)
app.include_router(attendance_router.router)
app.include_router(overtime_router.router)
app.include_router(leave_router.router)
app.include_router(payroll_router.router)
app.include_router(departments.router)
app.include_router(analytics_router.router)
app.include_router(reports.router)
app.include_router(alerts.router)
app.include_router(websocket_router)


@app.get("/", tags=["health"])
def health_check() -> dict:
    return {"status": "ok", "service": settings.app_name, "time": time.time()}
