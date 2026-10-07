"""Pydantic schemas for analytics and report endpoints."""
from typing import Any

from pydantic import BaseModel


class AttendanceTrendPoint(BaseModel):
    day: str
    rate: float
    last: float


class PayrollTrendPoint(BaseModel):
    month: str
    basic: float
    overtime: float
    benefits: float


class AnalyticsOut(BaseModel):
    attendance: list[AttendanceTrendPoint]
    payroll: list[PayrollTrendPoint]
    departments: list[dict[str, Any]]


class ReportRow(BaseModel):
    department: str
    headcount: int
    attendance: float
    overtimeHours: float
    grossPayroll: float
    period: str


class ReportListOut(BaseModel):
    items: list[ReportRow]
    total: int


class ReportFilters(BaseModel):
    department: str = "All departments"
    startDate: str
    endDate: str


class ReportExportOut(BaseModel):
    success: bool
    filters: ReportFilters
