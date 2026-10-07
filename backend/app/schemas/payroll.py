"""Pydantic schemas for payroll endpoints."""
from pydantic import BaseModel


class PayrollOut(BaseModel):
    department: str
    basicWages: float
    overtimePay: float
    gross: float
    processed: float
    variance: float


class PayrollListOut(BaseModel):
    items: list[PayrollOut]
    total: int
