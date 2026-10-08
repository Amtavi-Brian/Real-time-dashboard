"""Raw per-employee, per-month time & wage fact table.

This table preserves every column from the source HR dataset
(`data/Columbus_HR_Time_Wage_Dataset.xlsx`, "Employee Data" sheet) so the
original figures stay auditable even though the API exposes aggregated views
built on top of them.
"""
from sqlalchemy import Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class EmployeeMonthlyRecord(Base):
    __tablename__ = "employee_monthly_records"
    __table_args__ = (UniqueConstraint("employee_id", "month", name="uq_employee_month"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    employee_id: Mapped[str] = mapped_column(ForeignKey("employees.id"), nullable=False)
    month: Mapped[str] = mapped_column(String(20), nullable=False)

    working_days: Mapped[int] = mapped_column(Integer, default=0)
    present_days: Mapped[int] = mapped_column(Integer, default=0)
    absent_days: Mapped[int] = mapped_column(Integer, default=0)
    leave_days: Mapped[int] = mapped_column(Integer, default=0)
    late_days: Mapped[int] = mapped_column(Integer, default=0)

    scheduled_hours: Mapped[float] = mapped_column(Float, default=0)
    regular_hours: Mapped[float] = mapped_column(Float, default=0)
    overtime_hours: Mapped[float] = mapped_column(Float, default=0)
    total_hours: Mapped[float] = mapped_column(Float, default=0)

    basic_wage: Mapped[float] = mapped_column(Float, default=0)
    ot_rate: Mapped[float] = mapped_column(Float, default=0)
    ot_pay: Mapped[float] = mapped_column(Float, default=0)
    expected_gross_pay: Mapped[float] = mapped_column(Float, default=0)
    payroll_variance: Mapped[float] = mapped_column(Float, default=0)
    processed_pay: Mapped[float] = mapped_column(Float, default=0)

    attendance_rate: Mapped[float] = mapped_column(Float, default=0)
    absenteeism_rate: Mapped[float] = mapped_column(Float, default=0)
    leave_utilization: Mapped[float] = mapped_column(Float, default=0)

    employee = relationship("Employee", back_populates="monthly_records")
