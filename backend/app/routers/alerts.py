"""HR alert and exception endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.alert import AlertListOut
from app.services.alert_service import list_alerts

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("", response_model=AlertListOut)
def get_alerts(db: Session = Depends(get_db)) -> AlertListOut:
    items = list_alerts(db)
    return AlertListOut(items=items, total=len(items))
