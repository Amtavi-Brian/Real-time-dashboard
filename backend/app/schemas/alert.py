"""Pydantic schemas for alert endpoints."""
from pydantic import BaseModel


class AlertOut(BaseModel):
    id: str
    type: str
    severity: str
    title: str
    message: str
    time: str
    department: str
    unread: bool


class AlertListOut(BaseModel):
    items: list[AlertOut]
    total: int
