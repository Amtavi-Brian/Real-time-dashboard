"""Employee ORM model."""
from sqlalchemy import Date, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    department_id: Mapped[str] = mapped_column(ForeignKey("departments.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(120), default="")
    status: Mapped[str] = mapped_column(String(20), default="Active")
    # Nullable because the source HR dataset does not record a hire date.
    start_date: Mapped[str | None] = mapped_column(Date, nullable=True)
    salary: Mapped[float] = mapped_column(Float, default=0)
    email: Mapped[str] = mapped_column(String(160), unique=True, nullable=False)
    attendance_rate: Mapped[float] = mapped_column(Float, default=0)
    working_hours: Mapped[float] = mapped_column(Float, default=0)
    overtime_hours: Mapped[float] = mapped_column(Float, default=0)

    department = relationship("Department", back_populates="employees")
    monthly_records = relationship("EmployeeMonthlyRecord", back_populates="employee", cascade="all, delete-orphan")
