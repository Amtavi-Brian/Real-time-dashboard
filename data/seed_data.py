"""Seed the Columbus HR database with the sample dataset used across the demo.

This mirrors the representative data bundled in the frontend's mock service
(`frontend/src/services/api.js`) so the dashboard looks identical whether
`VITE_USE_MOCK` is `true` (frontend-only) or `false` (connected to this API).

Usage (from the backend's virtual environment):

    python ../data/seed_data.py
"""
from __future__ import annotations

import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.core.database import Base, SessionLocal, engine  # noqa: E402
from app.core.security import hash_password  # noqa: E402
from app.models.alert import Alert  # noqa: E402
from app.models.analytics import AttendanceTrendPoint, PayrollTrendPoint  # noqa: E402
from app.models.attendance import AttendanceRecord  # noqa: E402
from app.models.department import Department  # noqa: E402
from app.models.employee import Employee  # noqa: E402
from app.models.leave import LeaveRequest  # noqa: E402
from app.models.overtime import OvertimeRecord  # noqa: E402
from app.models.payroll import PayrollRecord  # noqa: E402
from app.models.user import User  # noqa: E402

DEPARTMENTS = [
    dict(id="D01", name="Operations", headcount=86, attendance_rate=96.8, absenteeism_rate=3.2, overtime_hours=428, working_hours=39.4, wage_cost=18_640_000, productivity=92),
    dict(id="D02", name="Sales & Marketing", headcount=64, attendance_rate=94.6, absenteeism_rate=5.4, overtime_hours=296, working_hours=38.7, wage_cost=14_820_000, productivity=88),
    dict(id="D03", name="Finance", headcount=38, attendance_rate=97.4, absenteeism_rate=2.6, overtime_hours=118, working_hours=39.1, wage_cost=11_960_000, productivity=95),
    dict(id="D04", name="Human Resources", headcount=24, attendance_rate=98.1, absenteeism_rate=1.9, overtime_hours=84, working_hours=38.9, wage_cost=7_680_000, productivity=96),
    dict(id="D05", name="Technology", headcount=52, attendance_rate=95.8, absenteeism_rate=4.2, overtime_hours=382, working_hours=40.2, wage_cost=17_440_000, productivity=93),
]

# name, id, department name, title, status, start_date, salary, attendance_rate, working_hours, overtime_hours
EMPLOYEES = [
    ("Amara Osei", "EMP-1042", "Operations", "Shift Supervisor", "Active", "2022-03-14", 78500, 98.2, 40, 12),
    ("Kwame Mensah", "EMP-1038", "Technology", "Systems Analyst", "Active", "2021-11-08", 92000, 94.6, 42, 21),
    ("Nana Boateng", "EMP-1026", "Finance", "Payroll Officer", "Active", "2023-01-16", 68500, 96.1, 38, 4),
    ("Akosua Owusu", "EMP-1019", "Human Resources", "HR Partner", "On leave", "2020-06-22", 81000, 97.9, 39, 6),
    ("Kofi Addo", "EMP-1014", "Sales & Marketing", "Account Executive", "Active", "2022-09-05", 74500, 91.8, 37, 18),
    ("Esi Mensima", "EMP-1008", "Operations", "Quality Lead", "Active", "2019-02-11", 83500, 98.7, 41, 14),
    ("Yaw Asante", "EMP-1003", "Technology", "Product Designer", "Active", "2024-02-19", 88000, 95.3, 44, 27),
    ("Abena Kusi", "EMP-0997", "Finance", "Financial Analyst", "Active", "2021-04-12", 72000, 96.8, 39, 5),
    ("Kojo Arthur", "EMP-0986", "Operations", "Logistics Coordinator", "On leave", "2020-10-01", 61200, 92.4, 36, 3),
    ("Efua Darko", "EMP-0974", "Sales & Marketing", "Brand Manager", "Active", "2018-08-27", 96500, 97.1, 40, 16),
    ("Nii Lante", "EMP-0962", "Human Resources", "People Operations", "Active", "2022-01-10", 70200, 99.1, 38, 2),
    ("Adwoa Sarpong", "EMP-0951", "Technology", "Software Engineer", "Active", "2023-07-03", 101000, 95.8, 43, 24),
]

ATTENDANCE = [
    ("2026-10-01", 247, 11, 9, 1956),
    ("2026-10-02", 251, 7, 12, 1988),
    ("2026-10-03", 239, 19, 8, 1891),
    ("2026-10-04", 244, 14, 11, 1926),
    ("2026-10-05", 252, 6, 7, 2004),
    ("2026-10-06", 249, 9, 10, 1972),
    ("2026-10-07", 246, 12, 8, 1948),
]

OVERTIME_COST_BY_DEPARTMENT_INDEX = [928_400, 672_800, 331_600, 198_500, 1_049_200]
PAYROLL_ADJUSTMENT_BY_DEPARTMENT_INDEX = [0, 16_400, 0, -8_200, 25_600]

LEAVE = [
    ("LV-208", "Akosua Owusu", "Human Resources", "Annual leave", "2026-10-06", "2026-10-10", 5, "Approved"),
    ("LV-207", "Kojo Arthur", "Operations", "Medical", "2026-10-07", "2026-10-08", 2, "Approved"),
    ("LV-206", "Kofi Addo", "Sales & Marketing", "Annual leave", "2026-10-13", "2026-10-17", 5, "Pending"),
    ("LV-205", "Nana Boateng", "Finance", "Personal", "2026-10-20", "2026-10-20", 1, "Pending"),
]

ALERTS = [
    ("AL-981", "High Overtime", "High", "Technology overtime is above threshold", "Overtime reached 382 hours this month, 18% above the department threshold.", "8 min ago", "Technology", True, 5),
    ("AL-980", "Payroll Variance", "Medium", "Payroll variance requires review", "Two departments have a combined payroll variance of GHS 42,000.", "24 min ago", "Finance", True, 4),
    ("AL-979", "Low Attendance", "Low", "Attendance dipped in Sales & Marketing", "Daily attendance is 91.8%, below the 94% monitoring threshold.", "1 hr ago", "Sales & Marketing", False, 3),
    ("AL-978", "Leave Alert", "Low", "Leave overlap in Operations", "Three team members are scheduled for leave in the same week.", "2 hrs ago", "Operations", False, 2),
    ("AL-977", "High Absenteeism", "High", "Absenteeism rising across the business", "The seven-day absenteeism rate increased to 4.1%.", "3 hrs ago", "All departments", False, 1),
]

ATTENDANCE_TREND = [
    ("Mon", 94.8, 93.2), ("Tue", 96.2, 94.6), ("Wed", 92.6, 94.1),
    ("Thu", 95.3, 95.0), ("Fri", 97.1, 95.8), ("Sat", 93.6, 91.7), ("Sun", 95.4, 92.9),
]

PAYROLL_TREND = [
    ("May", 57, 8, 13), ("Jun", 59, 9, 13), ("Jul", 58, 10, 14),
    ("Aug", 62, 9, 14), ("Sep", 61, 11, 15), ("Oct", 64, 10, 15),
]

DEMO_USERS = [
    ("Jordan Mensah", "jordan.mensah@columbus.co.gh", "columbus-demo", "ADMIN"),
    ("Ama Boateng", "ama.boateng@columbus.co.gh", "columbus-demo", "HR_MANAGER"),
    ("Yaw Darko", "yaw.darko@columbus.co.gh", "columbus-demo", "MANAGER"),
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Department).count() > 0:
            print("Database already seeded; skipping. Delete the database file to reseed.")
            return

        departments_by_name = {}
        for row in DEPARTMENTS:
            department = Department(**row)
            db.add(department)
            departments_by_name[row["name"]] = department
        db.flush()

        for name, emp_id, dept_name, title, status, start_date, salary, attendance_rate, working_hours, overtime_hours in EMPLOYEES:
            db.add(
                Employee(
                    id=emp_id,
                    name=name,
                    department_id=departments_by_name[dept_name].id,
                    title=title,
                    status=status,
                    start_date=date.fromisoformat(start_date),
                    salary=salary,
                    email=f"{name.lower().replace(' ', '.')}@columbus.co.gh",
                    attendance_rate=attendance_rate,
                    working_hours=working_hours,
                    overtime_hours=overtime_hours,
                )
            )

        for record_date, present, absent, late, working_hours in ATTENDANCE:
            db.add(AttendanceRecord(date=date.fromisoformat(record_date), present=present, absent=absent, late=late, working_hours=working_hours))

        for index, department_row in enumerate(DEPARTMENTS):
            department = departments_by_name[department_row["name"]]
            db.add(OvertimeRecord(department_id=department.id, hours=department_row["overtime_hours"], cost=OVERTIME_COST_BY_DEPARTMENT_INDEX[index]))

            adjustment = PAYROLL_ADJUSTMENT_BY_DEPARTMENT_INDEX[index]
            gross = department_row["wage_cost"]
            db.add(
                PayrollRecord(
                    department_id=department.id,
                    basic_wages=round(gross * 0.82),
                    overtime_pay=round(gross * 0.07),
                    gross=gross,
                    processed=gross - adjustment,
                    variance=adjustment,
                )
            )

        db.flush()
        employees_by_name = {employee.name: employee for employee in db.query(Employee).all()}
        for leave_id, employee_name, dept_name, leave_type, start_date, end_date, days, status in LEAVE:
            db.add(
                LeaveRequest(
                    id=leave_id,
                    employee_id=employees_by_name[employee_name].id,
                    department_id=departments_by_name[dept_name].id,
                    type=leave_type,
                    start_date=date.fromisoformat(start_date),
                    end_date=date.fromisoformat(end_date),
                    days=days,
                    status=status,
                )
            )

        for alert_id, alert_type, severity, title, message, time_label, dept_name, unread, sort_order in ALERTS:
            db.add(Alert(id=alert_id, type=alert_type, severity=severity, title=title, message=message, time=time_label, department=dept_name, unread=unread, sort_order=sort_order))

        for sort_order, (day, rate, last) in enumerate(ATTENDANCE_TREND):
            db.add(AttendanceTrendPoint(day=day, rate=rate, last=last, sort_order=sort_order))

        for sort_order, (month, basic, overtime_value, benefits) in enumerate(PAYROLL_TREND):
            db.add(PayrollTrendPoint(month=month, basic=basic, overtime=overtime_value, benefits=benefits, sort_order=sort_order))

        for name, email, password, role in DEMO_USERS:
            db.add(User(name=name, email=email, hashed_password=hash_password(password), role=role))

        db.commit()
        print("Seed complete: departments, employees, attendance, overtime, payroll, leave, alerts, trends, and demo users.")
        print("Demo login: jordan.mensah@columbus.co.gh / columbus-demo (ADMIN)")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
