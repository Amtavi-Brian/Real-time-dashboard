"""Department ORM model."""
from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[str] = mapped_column(String(10), primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    headcount: Mapped[int] = mapped_column(Integer, default=0)
    attendance_rate: Mapped[float] = mapped_column(Float, default=0)
    absenteeism_rate: Mapped[float] = mapped_column(Float, default=0)
    overtime_hours: Mapped[float] = mapped_column(Float, default=0)
    working_hours: Mapped[float] = mapped_column(Float, default=0)
    wage_cost: Mapped[float] = mapped_column(Float, default=0)
    productivity: Mapped[float] = mapped_column(Float, default=0)

    employees = relationship("Employee", back_populates="department", cascade="all, delete-orphan")
