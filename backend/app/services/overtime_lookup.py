"""Small helper to look up overtime hours per department without a circular import."""
from sqlalchemy.orm import Session

from app.services.attendance_service import list_overtime


def overtime_by_department(db: Session) -> dict[str, float]:
    return {row["department"]: row["hours"] for row in list_overtime(db)}
