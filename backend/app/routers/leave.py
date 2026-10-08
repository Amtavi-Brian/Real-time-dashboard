"""Leave request endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.leave import LeaveListOut, LeaveOut, LeaveStatusUpdate
from app.services.attendance_service import list_leave, update_leave_status
from app.utils.validators import is_valid_leave_status

router = APIRouter(prefix="/leave", tags=["leave"])


@router.get("", response_model=LeaveListOut)
def get_leave(db: Session = Depends(get_db)) -> LeaveListOut:
    items = list_leave(db)
    return LeaveListOut(items=items, total=len(items))


@router.patch("/{leave_id}", response_model=LeaveOut)
def patch_leave_status(leave_id: str, body: LeaveStatusUpdate, db: Session = Depends(get_db)) -> LeaveOut:
    if not is_valid_leave_status(body.status):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid leave status")
    updated = update_leave_status(db, leave_id, body.status)
    if not updated:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Leave request not found")
    return updated
