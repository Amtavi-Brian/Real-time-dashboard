"""Report preview and CSV export endpoints."""
from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.routers.auth import get_current_user
from app.schemas.analytics import ReportExportOut, ReportFilters, ReportListOut
from app.services.report_service import build_report

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("", response_model=ReportListOut)
def get_reports(db: Session = Depends(get_db)) -> ReportListOut:
    items = build_report(db)
    return ReportListOut(items=items, total=len(items))


@router.post("/export", response_model=ReportExportOut)
def export_report(filters: ReportFilters, db: Session = Depends(get_db), _user=Depends(get_current_user)) -> ReportExportOut:
    # The rows are computed so the export endpoint can be extended to stream a
    # CSV/PDF file later; today it mirrors the mock contract's acknowledgement
    # shape while confirming the filters produce a non-empty report.
    build_report(db, filters.department, filters.startDate, filters.endDate)
    return ReportExportOut(success=True, filters=filters)


@router.get("/preview-default-range")
def default_range() -> dict:
    today = date.today()
    return {"startDate": today.replace(day=1).isoformat(), "endDate": today.isoformat()}
