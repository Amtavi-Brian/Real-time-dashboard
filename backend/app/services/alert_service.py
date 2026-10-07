"""Business logic and serialization for HR alerts."""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.alert import Alert


def to_dict(alert: Alert) -> dict:
    return {
        "id": alert.id,
        "type": alert.type,
        "severity": alert.severity,
        "title": alert.title,
        "message": alert.message,
        "time": alert.time,
        "department": alert.department,
        "unread": alert.unread,
    }


def list_alerts(db: Session) -> list[dict]:
    alerts = db.scalars(select(Alert).order_by(Alert.sort_order.desc())).all()
    return [to_dict(alert) for alert in alerts]
