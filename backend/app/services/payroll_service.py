"""Business logic and serialization for payroll records."""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.payroll import PayrollRecord


def list_payroll(db: Session) -> list[dict]:
    records = db.scalars(select(PayrollRecord)).all()
    return [
        {
            "department": record.department.name,
            "basicWages": record.basic_wages,
            "overtimePay": record.overtime_pay,
            "gross": record.gross,
            "processed": record.processed,
            "variance": record.variance,
        }
        for record in records
    ]
