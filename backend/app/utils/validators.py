"""Lightweight validation helpers used outside of Pydantic request parsing."""
from __future__ import annotations

ALLOWED_LEAVE_STATUSES = {"Pending", "Approved", "Rejected"}
ALLOWED_ROLES = {"ADMIN", "HR_MANAGER", "MANAGER"}
ALLOWED_SEVERITIES = {"Low", "Medium", "High"}


def is_valid_leave_status(status: str) -> bool:
    return status in ALLOWED_LEAVE_STATUSES


def is_valid_role(role: str) -> bool:
    return role in ALLOWED_ROLES


def is_valid_severity(severity: str) -> bool:
    return severity in ALLOWED_SEVERITIES
