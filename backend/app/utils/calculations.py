"""Shared numeric helpers for HR/wage calculations."""
from __future__ import annotations


def safe_div(numerator: float, denominator: float, default: float = 0.0) -> float:
    """Divide, guarding against division by zero."""
    return numerator / denominator if denominator else default


def attendance_rate(present: int, absent: int, late: int = 0) -> float:
    """Percentage of expected attendance from present/absent headcounts."""
    total = present + absent
    return round(safe_div(present, total) * 100, 1)


def absenteeism_rate(present: int, absent: int) -> float:
    """Percentage of expected absence from present/absent headcounts."""
    total = present + absent
    return round(safe_div(absent, total) * 100, 1)


def overtime_cost(hours: float, hourly_rate: float) -> float:
    """Overtime wage cost for a given number of overtime hours."""
    return round(hours * hourly_rate, 2)


def gross_payroll(basic_wages: float, overtime_pay: float) -> float:
    """Expected gross payroll from basic wages and overtime pay."""
    return round(basic_wages + overtime_pay, 2)


def payroll_variance(processed: float, gross: float) -> float:
    """Difference between processed payroll and expected gross payroll."""
    return round(processed - gross, 2)


def average(values: list[float]) -> float:
    """Arithmetic mean, returning 0 for an empty list."""
    return round(safe_div(sum(values), len(values)), 1)
