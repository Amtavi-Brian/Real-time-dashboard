"""Payroll summary endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.payroll import PayrollListOut
from app.services.payroll_service import list_payroll

router = APIRouter(prefix="/payroll", tags=["payroll"])


@router.get("", response_model=PayrollListOut)
def get_payroll(db: Session = Depends(get_db)) -> PayrollListOut:
    items = list_payroll(db)
    return PayrollListOut(items=items, total=len(items))
