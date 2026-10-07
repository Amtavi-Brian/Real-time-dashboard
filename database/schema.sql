-- Columbus HR Time & Wage Analytics Dashboard
-- Reference PostgreSQL schema (mirrors the SQLAlchemy models in backend/app/models).
-- Apply with: psql -U columbus -d columbus_hr -f database/schema.sql

CREATE TABLE IF NOT EXISTS departments (
    id               VARCHAR(10)  PRIMARY KEY,
    name             VARCHAR(120) NOT NULL UNIQUE,
    headcount        INTEGER      NOT NULL DEFAULT 0,
    attendance_rate  DOUBLE PRECISION NOT NULL DEFAULT 0,
    absenteeism_rate DOUBLE PRECISION NOT NULL DEFAULT 0,
    overtime_hours   DOUBLE PRECISION NOT NULL DEFAULT 0,
    working_hours    DOUBLE PRECISION NOT NULL DEFAULT 0,
    wage_cost        DOUBLE PRECISION NOT NULL DEFAULT 0,
    productivity     DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS employees (
    id               VARCHAR(20)  PRIMARY KEY,
    name             VARCHAR(120) NOT NULL,
    department_id    VARCHAR(10)  NOT NULL REFERENCES departments(id),
    title            VARCHAR(120) NOT NULL DEFAULT '',
    status           VARCHAR(20)  NOT NULL DEFAULT 'Active',
    start_date       DATE,
    salary           DOUBLE PRECISION NOT NULL DEFAULT 0,
    email            VARCHAR(160) NOT NULL UNIQUE,
    attendance_rate  DOUBLE PRECISION NOT NULL DEFAULT 0,
    working_hours    DOUBLE PRECISION NOT NULL DEFAULT 0,
    overtime_hours   DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id            SERIAL PRIMARY KEY,
    date          DATE NOT NULL UNIQUE,
    present       INTEGER NOT NULL DEFAULT 0,
    absent        INTEGER NOT NULL DEFAULT 0,
    late          INTEGER NOT NULL DEFAULT 0,
    working_hours DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS overtime_records (
    id            SERIAL PRIMARY KEY,
    department_id VARCHAR(10) NOT NULL UNIQUE REFERENCES departments(id),
    hours         DOUBLE PRECISION NOT NULL DEFAULT 0,
    cost          DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS payroll_records (
    id            SERIAL PRIMARY KEY,
    department_id VARCHAR(10) NOT NULL UNIQUE REFERENCES departments(id),
    basic_wages   DOUBLE PRECISION NOT NULL DEFAULT 0,
    overtime_pay  DOUBLE PRECISION NOT NULL DEFAULT 0,
    gross         DOUBLE PRECISION NOT NULL DEFAULT 0,
    processed     DOUBLE PRECISION NOT NULL DEFAULT 0,
    variance      DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS employee_monthly_records (
    id                   SERIAL PRIMARY KEY,
    employee_id          VARCHAR(20) NOT NULL REFERENCES employees(id),
    month                VARCHAR(20) NOT NULL,
    working_days         INTEGER NOT NULL DEFAULT 0,
    present_days         INTEGER NOT NULL DEFAULT 0,
    absent_days          INTEGER NOT NULL DEFAULT 0,
    leave_days           INTEGER NOT NULL DEFAULT 0,
    late_days            INTEGER NOT NULL DEFAULT 0,
    scheduled_hours      DOUBLE PRECISION NOT NULL DEFAULT 0,
    regular_hours        DOUBLE PRECISION NOT NULL DEFAULT 0,
    overtime_hours       DOUBLE PRECISION NOT NULL DEFAULT 0,
    total_hours          DOUBLE PRECISION NOT NULL DEFAULT 0,
    basic_wage           DOUBLE PRECISION NOT NULL DEFAULT 0,
    ot_rate              DOUBLE PRECISION NOT NULL DEFAULT 0,
    ot_pay               DOUBLE PRECISION NOT NULL DEFAULT 0,
    expected_gross_pay   DOUBLE PRECISION NOT NULL DEFAULT 0,
    payroll_variance     DOUBLE PRECISION NOT NULL DEFAULT 0,
    processed_pay        DOUBLE PRECISION NOT NULL DEFAULT 0,
    attendance_rate      DOUBLE PRECISION NOT NULL DEFAULT 0,
    absenteeism_rate     DOUBLE PRECISION NOT NULL DEFAULT 0,
    leave_utilization    DOUBLE PRECISION NOT NULL DEFAULT 0,
    CONSTRAINT uq_employee_month UNIQUE (employee_id, month)
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id            VARCHAR(20) PRIMARY KEY,
    employee_id   VARCHAR(20) NOT NULL REFERENCES employees(id),
    department_id VARCHAR(10) NOT NULL REFERENCES departments(id),
    type          VARCHAR(60) NOT NULL,
    start_date    DATE NOT NULL,
    end_date      DATE NOT NULL,
    days          INTEGER NOT NULL DEFAULT 1,
    status        VARCHAR(20) NOT NULL DEFAULT 'Pending'
);

CREATE TABLE IF NOT EXISTS alerts (
    id         VARCHAR(20) PRIMARY KEY,
    type       VARCHAR(60) NOT NULL,
    severity   VARCHAR(20) NOT NULL,
    title      VARCHAR(200) NOT NULL,
    message    TEXT NOT NULL,
    time       VARCHAR(40) NOT NULL DEFAULT 'Just now',
    department VARCHAR(120) NOT NULL DEFAULT 'All departments',
    unread     BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS attendance_trend_points (
    id         SERIAL PRIMARY KEY,
    day        VARCHAR(10) NOT NULL,
    rate       DOUBLE PRECISION NOT NULL,
    last       DOUBLE PRECISION NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS payroll_trend_points (
    id         SERIAL PRIMARY KEY,
    month      VARCHAR(10) NOT NULL,
    basic      DOUBLE PRECISION NOT NULL,
    overtime   DOUBLE PRECISION NOT NULL,
    benefits   DOUBLE PRECISION NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(120) NOT NULL,
    email           VARCHAR(160) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role            VARCHAR(20)  NOT NULL DEFAULT 'MANAGER'
);

CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_leave_employee ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_department ON leave_requests(department_id);
