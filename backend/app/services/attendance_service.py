"""Business logic and serialization for attendance, overtime, leave, and departments."""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.attendance import AttendanceRecord
from app.models.department import Department
from app.models.leave import LeaveRequest
from app.models.overtime import OvertimeRecord
from app.services.department_service import to_dict as department_to_dict


def list_attendance(db: Session) -> list[dict]:
    records = db.scalars(select(AttendanceRecord).order_by(AttendanceRecord.date)).all()
    return [
        {
            "date": record.date,
            "present": record.present,
            "absent": record.absent,
            "late": record.late,
            "workingHours": record.working_hours,
        }
        for record in records
    ]


def list_overtime(db: Session) -> list[dict]:
    records = db.scalars(select(OvertimeRecord)).all()
    return [
        {"department": record.department.name, "hours": record.hours, "cost": record.cost}
        for record in records
    ]


def list_leave(db: Session) -> list[dict]:
    records = db.scalars(select(LeaveRequest).order_by(LeaveRequest.id.desc())).all()
    return [leave_to_dict(record) for record in records]


def leave_to_dict(record: LeaveRequest) -> dict:
    return {
        "id": record.id,
        "employee": record.employee.name,
        "department": record.department.name,
        "type": record.type,
        "startDate": record.start_date,
        "endDate": record.end_date,
        "days": record.days,
        "status": record.status,
    }


def update_leave_status(db: Session, leave_id: str, status: str) -> dict | None:
    record = db.get(LeaveRequest, leave_id)
    if not record:
        return None
    record.status = status
    db.commit()
    db.refresh(record)
    return leave_to_dict(record)


def list_departments(db: Session) -> list[dict]:
    departments = db.scalars(select(Department).order_by(Department.name)).all()
    return [department_to_dict(department) for department in departments]
