"""Daily attendance record ORM model."""
from sqlalchemy import Date, Integer
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(Date, nullable=False, unique=True)
    present: Mapped[int] = mapped_column(Integer, default=0)
    absent: Mapped[int] = mapped_column(Integer, default=0)
    late: Mapped[int] = mapped_column(Integer, default=0)
    working_hours: Mapped[float] = mapped_column(Integer, default=0)
