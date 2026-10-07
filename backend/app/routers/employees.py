"""Employee directory endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.employee import EmployeeListOut, EmployeeOut
from app.services.employee_service import get_employee, list_employees

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("", response_model=EmployeeListOut)
def get_employees(db: Session = Depends(get_db)) -> EmployeeListOut:
    items = list_employees(db)
    return EmployeeListOut(items=items, total=len(items))


@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee_detail(employee_id: str, db: Session = Depends(get_db)) -> EmployeeOut:
    employee = get_employee(db, employee_id)
    if not employee:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return employee
