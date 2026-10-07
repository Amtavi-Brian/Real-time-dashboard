"""Aggregation logic for the analytics dashboard (attendance/payroll/overtime trends)."""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.analytics import AttendanceTrendPoint, PayrollTrendPoint
from app.services.attendance_service import list_departments
from app.utils.calculations import average


def _attendance_trend(db: Session) -> list[dict]:
    points = db.scalars(select(AttendanceTrendPoint).order_by(AttendanceTrendPoint.sort_order)).all()
    return [{"day": point.day, "rate": point.rate, "last": point.last} for point in points]


def _payroll_trend(db: Session) -> list[dict]:
    points = db.scalars(select(PayrollTrendPoint).order_by(PayrollTrendPoint.sort_order)).all()
    return [
        {"month": point.month, "basic": point.basic, "overtime": point.overtime, "benefits": point.benefits}
        for point in points
    ]


def get_analytics(db: Session, kind: str = "attendance") -> dict:
    """Return the combined analytics payload.

    The frontend requests a `kind` (attendance/overtime/payroll/workforce) but
    consumes the same combined shape regardless of which analytics endpoint it
    called, mirroring the mock API contract in `frontend/src/services/api.js`.
    """
    return {
        "attendance": _attendance_trend(db),
        "payroll": _payroll_trend(db),
        "departments": list_departments(db),
    }


def average_attendance_rate(db: Session) -> float:
    rates = [point.rate for point in db.scalars(select(AttendanceTrendPoint)).all()]
    return average(rates)
