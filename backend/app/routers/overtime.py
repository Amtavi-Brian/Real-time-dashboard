"""Overtime analytics endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.overtime import OvertimeListOut
from app.services.attendance_service import list_overtime

router = APIRouter(prefix="/overtime", tags=["overtime"])


@router.get("", response_model=OvertimeListOut)
def get_overtime(db: Session = Depends(get_db)) -> OvertimeListOut:
    items = list_overtime(db)
    return OvertimeListOut(items=items, total=len(items))
