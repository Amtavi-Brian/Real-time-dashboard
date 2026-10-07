"""Pydantic schemas for employee endpoints."""
from datetime import date

from pydantic import BaseModel


class EmployeeOut(BaseModel):
    id: str
    name: str
    department: str
    title: str
    status: str
    startDate: date
    salary: float
    email: str
    attendanceRate: float
    workingHours: float
    overtimeHours: float


class EmployeeListOut(BaseModel):
    items: list[EmployeeOut]
    total: int
