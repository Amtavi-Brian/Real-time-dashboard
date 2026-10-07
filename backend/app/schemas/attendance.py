"""Pydantic schemas for attendance endpoints."""
from datetime import date

from pydantic import BaseModel


class AttendanceOut(BaseModel):
    date: date
    present: int
    absent: int
    late: int
    workingHours: float


class AttendanceListOut(BaseModel):
    items: list[AttendanceOut]
    total: int
