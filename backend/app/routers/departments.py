"""Department comparison endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.department import DepartmentOut
from app.services.attendance_service import list_departments

router = APIRouter(prefix="/departments", tags=["departments"])


@router.get("")
def get_departments(db: Session = Depends(get_db)) -> dict:
    items = [DepartmentOut(**department) for department in list_departments(db)]
    return {"items": items, "total": len(items)}
