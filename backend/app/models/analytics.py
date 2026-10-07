"""Pre-aggregated trend series used by the analytics dashboard charts."""
from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AttendanceTrendPoint(Base):
    """One point of the rolling weekly attendance-rate trend."""

    __tablename__ = "attendance_trend_points"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    day: Mapped[str] = mapped_column(String(10), nullable=False)
    rate: Mapped[float] = mapped_column(Float, nullable=False)
    last: Mapped[float] = mapped_column(Float, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)


class PayrollTrendPoint(Base):
    """One point of the monthly payroll composition trend."""

    __tablename__ = "payroll_trend_points"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    month: Mapped[str] = mapped_column(String(10), nullable=False)
    basic: Mapped[float] = mapped_column(Float, nullable=False)
    overtime: Mapped[float] = mapped_column(Float, nullable=False)
    benefits: Mapped[float] = mapped_column(Float, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
