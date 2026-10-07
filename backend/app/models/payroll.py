"""Department-level payroll summary ORM model."""
from sqlalchemy import Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class PayrollRecord(Base):
    __tablename__ = "payroll_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    department_id: Mapped[str] = mapped_column(ForeignKey("departments.id"), unique=True, nullable=False)
    basic_wages: Mapped[float] = mapped_column(Float, default=0)
    overtime_pay: Mapped[float] = mapped_column(Float, default=0)
    gross: Mapped[float] = mapped_column(Float, default=0)
    processed: Mapped[float] = mapped_column(Float, default=0)
    variance: Mapped[float] = mapped_column(Float, default=0)

    department = relationship("Department")
