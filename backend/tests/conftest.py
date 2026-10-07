"""Pytest fixtures: isolated in-memory SQLite database per test module."""
import os
import sys
from pathlib import Path

os.environ["DATABASE_URL"] = "sqlite:///./test_columbus_hr.db"

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from fastapi.testclient import TestClient

from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.main import app
from app.models.department import Department
from app.models.user import User


@pytest.fixture(scope="session", autouse=True)
def _prepare_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    db.add(Department(id="D01", name="Operations", headcount=10, attendance_rate=96, absenteeism_rate=4, overtime_hours=20, working_hours=40, wage_cost=100000, productivity=90))
    db.add(User(name="Test Admin", email="admin@columbus.co.gh", hashed_password=hash_password("secret123"), role="ADMIN"))
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)
    db_path = Path("test_columbus_hr.db")
    if db_path.exists():
        db_path.unlink()


@pytest.fixture
def client():
    return TestClient(app)
