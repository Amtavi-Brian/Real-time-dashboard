"""Business logic and serialization for employee records."""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.employee import Employee


def to_dict(employee: Employee) -> dict:
    return {
        "id": employee.id,
        "name": employee.name,
        "department": employee.department.name,
        "title": employee.title,
        "status": employee.status,
        "startDate": employee.start_date,
        "salary": employee.salary,
        "email": employee.email,
        "attendanceRate": employee.attendance_rate,
        "workingHours": employee.working_hours,
        "overtimeHours": employee.overtime_hours,
    }


def list_employees(db: Session) -> list[dict]:
    employees = db.scalars(select(Employee).order_by(Employee.id.desc())).all()
    return [to_dict(employee) for employee in employees]


def get_employee(db: Session, employee_id: str) -> dict | None:
    employee = db.get(Employee, employee_id)
    return to_dict(employee) if employee else None
