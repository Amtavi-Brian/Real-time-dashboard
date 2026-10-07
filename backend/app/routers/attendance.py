"""Attendance record endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.attendance import AttendanceListOut
from app.services.attendance_service import list_attendance

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.get("", response_model=AttendanceListOut)
def get_attendance(db: Session = Depends(get_db)) -> AttendanceListOut:
    items = list_attendance(db)
    return AttendanceListOut(items=items, total=len(items))
