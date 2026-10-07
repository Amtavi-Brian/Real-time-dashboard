"""Pydantic schemas for department analytics."""
from pydantic import BaseModel, ConfigDict


class DepartmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    headcount: int
    attendanceRate: float
    absenteeismRate: float
    overtimeHours: float
    workingHours: float
    wageCost: float
    productivity: float
