"""Pydantic schemas for overtime endpoints."""
from pydantic import BaseModel


class OvertimeOut(BaseModel):
    department: str
    hours: float
    cost: float


class OvertimeListOut(BaseModel):
    items: list[OvertimeOut]
    total: int
