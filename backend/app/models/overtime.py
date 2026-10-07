"""Department-level overtime summary ORM model."""
from sqlalchemy import Float, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class OvertimeRecord(Base):
    __tablename__ = "overtime_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    department_id: Mapped[str] = mapped_column(ForeignKey("departments.id"), unique=True, nullable=False)
    hours: Mapped[float] = mapped_column(Float, default=0)
    cost: Mapped[float] = mapped_column(Float, default=0)

    department = relationship("Department")
