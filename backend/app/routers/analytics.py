"""Analytics endpoints for attendance, overtime, payroll, and workforce views."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.analytics import AnalyticsOut
from app.services.analytics_service import get_analytics

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/attendance", response_model=AnalyticsOut)
def analytics_attendance(db: Session = Depends(get_db)) -> AnalyticsOut:
    return get_analytics(db, "attendance")


@router.get("/overtime", response_model=AnalyticsOut)
def analytics_overtime(db: Session = Depends(get_db)) -> AnalyticsOut:
    return get_analytics(db, "overtime")


@router.get("/payroll", response_model=AnalyticsOut)
def analytics_payroll(db: Session = Depends(get_db)) -> AnalyticsOut:
    return get_analytics(db, "payroll")


@router.get("/workforce", response_model=AnalyticsOut)
def analytics_workforce(db: Session = Depends(get_db)) -> AnalyticsOut:
    return get_analytics(db, "workforce")
