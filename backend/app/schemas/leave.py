"""Pydantic schemas for leave endpoints."""
from datetime import date

from pydantic import BaseModel


class LeaveOut(BaseModel):
    id: str
    employee: str
    department: str
    type: str
    startDate: date
    endDate: date
    days: int
    status: str


class LeaveListOut(BaseModel):
    items: list[LeaveOut]
    total: int


class LeaveStatusUpdate(BaseModel):
    status: str
