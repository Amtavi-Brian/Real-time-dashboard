"""Serialization helpers for department records."""
from app.models.department import Department


def to_dict(department: Department) -> dict:
    return {
        "id": department.id,
        "name": department.name,
        "headcount": department.headcount,
        "attendanceRate": department.attendance_rate,
        "absenteeismRate": department.absenteeism_rate,
        "overtimeHours": department.overtime_hours,
        "workingHours": department.working_hours,
        "wageCost": department.wage_cost,
        "productivity": department.productivity,
    }
