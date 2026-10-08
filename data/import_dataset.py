"""Import the Columbus HR Time & Wage dataset (Excel) into the database.

Source: data/Columbus_HR_Time_Wage_Dataset.xlsx
    - "Employee Data"       -> one row per employee for September 2026
    - "Department Summary"  -> pre-aggregated department KPIs
    - "KPI Summary"         -> company-wide KPIs (used only to sanity-check the import)

This script is idempotent: it clears the tables it owns before reloading, so
it can be re-run safely whenever the source spreadsheet changes.

Usage (from the backend virtual environment):

    python ../data/import_dataset.py [path-to-xlsx]

Notes / assumptions (the source dataset does not provide these fields):
    - Employee hire date and job title are not in the dataset, so they are
      left blank/null.
    - "Productivity" is not part of the dataset; a simple composite score
      (100 - 2x absenteeism rate) is stored for continuity with the
      Department Analytics view and is clearly derived, not sourced.
    - The dataset has no individual leave *requests* (dates/types), only an
      aggregate leave-day count per employee, so the `leave_requests` table
      is left empty rather than fabricated.
    - The dataset covers a single month, so the attendance/payroll trend
      tables get a single data point rather than an invented multi-week series.
"""
from __future__ import annotations

import sys
from datetime import date
from pathlib import Path

import pandas as pd

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
from app.models.time_wage_record import EmployeeMonthlyRecord  # noqa: E402
from app.models.user import User  # noqa: E402

DEFAULT_DATASET_PATH = Path(__file__).resolve().parent / "Columbus_HR_Time_Wage_Dataset.xlsx"

DEMO_USERS = [
    ("Jordan Mensah", "jordan.mensah@columbus.co.gh", "columbus-demo", "ADMIN"),
    ("Ama Boateng", "ama.boateng@columbus.co.gh", "columbus-demo", "HR_MANAGER"),
    ("Yaw Darko", "yaw.darko@columbus.co.gh", "columbus-demo", "MANAGER"),
]

EMPLOYEE_COLUMNS = [
    "employee_id", "employee_name", "department", "month", "working_days", "present_days",
    "absent_days", "leave_days", "late_days", "scheduled_hours", "regular_hours",
    "overtime_hours", "total_hours", "basic_wage", "ot_rate", "ot_pay",
    "expected_gross_pay", "payroll_variance", "ot_pay_processed_placeholder",
    "attendance_rate", "absenteeism_rate", "leave_utilization",
]
# The sheet has "Processed Pay" between Payroll Variance and Attendance Rate;
# name it correctly instead of the placeholder used while aligning columns.
EMPLOYEE_COLUMNS[18] = "processed_pay"

DEPARTMENT_COLUMNS = [
    "name", "headcount", "attendance_rate", "absenteeism_rate", "leave_days",
    "overtime_hours", "avg_overtime_per_employee", "basic_wage_cost", "overtime_cost",
    "total_labour_cost", "avg_hours_per_employee", "payroll_variance",
]


def load_employee_rows(xlsx_path: Path) -> pd.DataFrame:
    df = pd.read_excel(xlsx_path, sheet_name="Employee Data", header=3)
    df = df.dropna(how="all")
    df.columns = EMPLOYEE_COLUMNS
    return df.reset_index(drop=True)


def load_department_rows(xlsx_path: Path) -> pd.DataFrame:
    df = pd.read_excel(xlsx_path, sheet_name="Department Summary", header=2)
    df = df.dropna(how="all")
    df.columns = DEPARTMENT_COLUMNS
    return df.reset_index(drop=True)


def load_kpi_summary(xlsx_path: Path) -> pd.DataFrame:
    df = pd.read_excel(xlsx_path, sheet_name="KPI Summary", header=2)
    df.columns = ["kpi", "value", "interpretation"]
    return df.dropna(subset=["kpi"]).reset_index(drop=True)


def make_email(name: str, employee_id: str) -> str:
    slug = name.lower().strip().replace(".", "").replace("  ", " ").replace(" ", ".")
    # Several employee names repeat across the dataset, so the id suffix
    # keeps addresses unique while staying human-readable.
    return f"{slug}.{employee_id.lower()}@columbus.co.gh"


def composite_productivity(absenteeism_rate: float) -> float:
    """Derived placeholder score; the dataset has no direct productivity metric."""
    return round(max(0.0, min(100.0, 100 - 2 * absenteeism_rate)), 1)


def month_to_date(month_label: str) -> date:
    """'September 2026' -> date(2026, 9, 1)."""
    return pd.to_datetime(f"1 {month_label}").date()


def generate_alerts(departments: list[Department]) -> list[Alert]:
    alerts: list[Alert] = []
    counter = 1
    for department in sorted(departments, key=lambda d: d.absenteeism_rate, reverse=True):
        if department.absenteeism_rate > 4.5:
            alerts.append(Alert(
                id=f"AL-{900 + counter}", type="High Absenteeism", severity="High",
                title=f"{department.name} absenteeism above threshold",
                message=f"Absenteeism is {department.absenteeism_rate}%, above the 4.5% monitoring threshold.",
                time="Imported from dataset", department=department.name, unread=True, sort_order=100 - counter,
            ))
            counter += 1
        if department.attendance_rate < 90:
            alerts.append(Alert(
                id=f"AL-{900 + counter}", type="Low Attendance", severity="Medium",
                title=f"{department.name} attendance below target",
                message=f"Attendance is {department.attendance_rate}%, below the 90% target.",
                time="Imported from dataset", department=department.name, unread=True, sort_order=100 - counter,
            ))
            counter += 1
        avg_overtime = department.overtime_hours / department.headcount if department.headcount else 0
        if avg_overtime > 6:
            alerts.append(Alert(
                id=f"AL-{900 + counter}", type="High Overtime", severity="High",
                title=f"{department.name} overtime is elevated",
                message=f"Average overtime is {round(avg_overtime, 1)} hours per employee this month.",
                time="Imported from dataset", department=department.name, unread=True, sort_order=100 - counter,
            ))
            counter += 1
    return alerts


def import_dataset(xlsx_path: Path) -> None:
    Base.metadata.create_all(bind=engine)
    employees_df = load_employee_rows(xlsx_path)
    departments_df = load_department_rows(xlsx_path)
    kpi_df = load_kpi_summary(xlsx_path)

    db = SessionLocal()
    try:
        # Clear tables owned by this import so re-running is safe.
        db.query(Alert).delete()
        db.query(AttendanceTrendPoint).delete()
        db.query(PayrollTrendPoint).delete()
        db.query(LeaveRequest).delete()
        db.query(EmployeeMonthlyRecord).delete()
        db.query(AttendanceRecord).delete()
        db.query(OvertimeRecord).delete()
        db.query(PayrollRecord).delete()
        db.query(Employee).delete()
        db.query(Department).delete()
        db.flush()

        departments_by_name: dict[str, Department] = {}
        for index, row in departments_df.iterrows():
            department = Department(
                id=f"D{index + 1:02d}",
                name=row["name"],
                headcount=int(row["headcount"]),
                attendance_rate=round(float(row["attendance_rate"]), 2),
                absenteeism_rate=round(float(row["absenteeism_rate"]), 2),
                overtime_hours=round(float(row["overtime_hours"]), 1),
                working_hours=round(float(row["avg_hours_per_employee"]), 1),
                wage_cost=round(float(row["total_labour_cost"]), 2),
                productivity=composite_productivity(float(row["absenteeism_rate"])),
            )
            db.add(department)
            departments_by_name[row["name"]] = department

            db.add(OvertimeRecord(
                department_id=department.id,
                hours=round(float(row["overtime_hours"]), 1),
                cost=round(float(row["overtime_cost"]), 2),
            ))
            gross = round(float(row["total_labour_cost"]), 2)
            variance = round(float(row["payroll_variance"]), 2)
            db.add(PayrollRecord(
                department_id=department.id,
                basic_wages=round(float(row["basic_wage_cost"]), 2),
                overtime_pay=round(float(row["overtime_cost"]), 2),
                gross=gross,
                processed=round(gross - variance, 2),
                variance=variance,
            ))
        db.flush()

        month_label = str(employees_df.iloc[0]["month"])
        total_present = total_absent = total_late = 0
        total_hours = 0.0

        for _, row in employees_df.iterrows():
            department = departments_by_name.get(row["department"])
            if department is None:
                continue  # Skip rows with an unrecognized department.

            employee = Employee(
                id=str(row["employee_id"]),
                name=str(row["employee_name"]),
                department_id=department.id,
                title="",
                status="Active",
                start_date=None,
                salary=round(float(row["basic_wage"]), 2),
                email=make_email(str(row["employee_name"]), str(row["employee_id"])),
                attendance_rate=round(float(row["attendance_rate"]), 2),
                working_hours=round(float(row["total_hours"]), 1),
                overtime_hours=round(float(row["overtime_hours"]), 1),
            )
            db.add(employee)

            db.add(EmployeeMonthlyRecord(
                employee_id=employee.id,
                month=month_label,
                working_days=int(row["working_days"]),
                present_days=int(row["present_days"]),
                absent_days=int(row["absent_days"]),
                leave_days=int(row["leave_days"]),
                late_days=int(row["late_days"]),
                scheduled_hours=float(row["scheduled_hours"]),
                regular_hours=float(row["regular_hours"]),
                overtime_hours=float(row["overtime_hours"]),
                total_hours=float(row["total_hours"]),
                basic_wage=float(row["basic_wage"]),
                ot_rate=float(row["ot_rate"]),
                ot_pay=float(row["ot_pay"]),
                expected_gross_pay=float(row["expected_gross_pay"]),
                payroll_variance=float(row["payroll_variance"]),
                processed_pay=float(row["processed_pay"]),
                attendance_rate=float(row["attendance_rate"]),
                absenteeism_rate=float(row["absenteeism_rate"]),
                leave_utilization=float(row["leave_utilization"]),
            ))

            total_present += int(row["present_days"])
            total_absent += int(row["absent_days"])
            total_late += int(row["late_days"])
            total_hours += float(row["total_hours"])

        db.add(AttendanceRecord(
            date=month_to_date(month_label),
            present=total_present,
            absent=total_absent,
            late=total_late,
            working_hours=round(total_hours, 1),
        ))

        company_attendance_rate = float(kpi_df.loc[kpi_df["kpi"].str.contains("Attendance Rate", na=False), "value"].iloc[0])
        db.add(AttendanceTrendPoint(day=month_label[:3], rate=company_attendance_rate, last=company_attendance_rate, sort_order=0))

        basic_cost_millions = round(float(departments_df["basic_wage_cost"].sum()) / 1_000_000, 2)
        overtime_cost_millions = round(float(departments_df["overtime_cost"].sum()) / 1_000_000, 2)
        db.add(PayrollTrendPoint(month=month_label[:3], basic=basic_cost_millions, overtime=overtime_cost_millions, benefits=0, sort_order=0))

        db.flush()
        for alert in generate_alerts(list(departments_by_name.values())):
            db.add(alert)

        if db.query(User).count() == 0:
            for name, email, password, role in DEMO_USERS:
                db.add(User(name=name, email=email, hashed_password=hash_password(password), role=role))

        db.commit()

        print(f"Imported {len(employees_df)} employees across {len(departments_df)} departments for {month_label}.")
        print(f"Company attendance rate: {company_attendance_rate}% | Alerts generated: {len(generate_alerts(list(departments_by_name.values())))}")
        print("Demo login: jordan.mensah@columbus.co.gh / columbus-demo (ADMIN)")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_DATASET_PATH
    if not path.exists():
        raise SystemExit(f"Dataset not found: {path}")
    import_dataset(path)
