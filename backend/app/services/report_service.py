"""Report generation combining department, payroll, and overtime data."""
from sqlalchemy.orm import Session

from app.services.attendance_service import list_departments
from app.services.overtime_lookup import overtime_by_department
from app.services.payroll_service import list_payroll


def build_report(db: Session, department: str = "All departments", start_date: str = "", end_date: str = "") -> list[dict]:
    departments = list_departments(db)
    payroll_by_department = {row["department"]: row for row in list_payroll(db)}
    overtime_hours_by_department = overtime_by_department(db)

    period = f"{start_date} to {end_date}" if start_date or end_date else ""
    rows = []
    for dept in departments:
        if department != "All departments" and dept["name"] != department:
            continue
        payroll = payroll_by_department.get(dept["name"], {})
        rows.append(
            {
                "department": dept["name"],
                "headcount": dept["headcount"],
                "attendance": dept["attendanceRate"],
                "overtimeHours": overtime_hours_by_department.get(dept["name"], 0),
                "grossPayroll": payroll.get("gross", 0),
                "period": period,
            }
        )
    return rows
