# 🏢 Columbus Company Limited — Real-Time HR Time & Wage Analytics Dashboard

> **From HR Data → Real-Time Insights → Better Decisions**

---

## 📌 Project Overview

The **Columbus Company Limited Real-Time HR Time & Wage Analytics Dashboard** is a web-based Human Resource analytics system designed to improve workforce monitoring, time management, attendance tracking, overtime analysis, leave management, and wage-cost control.

The system transforms employee HR data into meaningful, interactive and real-time insights through **Key Performance Indicators (KPIs), charts, reports, tables, alerts and analytics**.

The dashboard enables HR managers and company management to monitor:

- 👥 Employee workforce
- 🕒 Attendance
- ⏱️ Working hours
- 💼 Overtime
- 📅 Leave
- 💰 Wages and payroll
- 📊 Employee and department performance
- 🚨 HR alerts and exceptions
- 📈 Labour costs

The system is designed around the hypothetical HR dataset provided for the Columbus Company Limited group assignment.

---

## 🚀 Getting Started (Local Development)

This confirms the setup actually used and verified to connect the React frontend to the FastAPI backend.

### Prerequisites

- Python 3.11+ and a virtual environment (`backend/.venv`)
- Node.js 18+ and npm
- A running PostgreSQL instance with a `columbus` database

### 1. Backend (FastAPI)

```sh
cd backend
python -m venv .venv          # if not already created
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # set DATABASE_URL, SECRET_KEY, CORS_ORIGINS, etc.
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- Health check: `GET http://127.0.0.1:8000/` → `{"status": "ok", ...}`
- Interactive API docs: `http://127.0.0.1:8000/docs`
- WebSocket dashboard feed: `ws://127.0.0.1:8000/ws/dashboard`

### 2. Frontend (React + Vite)

```sh
cd frontend
npm install
cp .env.example .env    # see variables below
npm run dev
```

Open the local URL printed by Vite (defaults to `http://localhost:5173`). See [`frontend/README.md`](frontend/README.md) for demo accounts, role-based access, and mock-mode details.

### 3. Connecting the Frontend to the Backend

Set these variables in `frontend/.env` so the dashboard talks to the FastAPI/WebSocket backend instead of mock data:

| Variable | Value used locally | Purpose |
| --- | --- | --- |
| `VITE_USE_MOCK` | `false` | Disables mock data/simulated WebSocket and uses the real API |
| `VITE_API_URL` | `http://127.0.0.1:8000` | Axios REST base URL — must match the port Uvicorn is running on |
| `VITE_WS_URL` | `ws://127.0.0.1:8000/ws/dashboard` | WebSocket URL for real-time dashboard updates |

> ⚠️ The backend and frontend ports must match. If Uvicorn is started with `--port 8000`, `VITE_API_URL`/`VITE_WS_URL` must also reference `8000` (not `8001` or any other port), or API calls and the WebSocket connection will fail silently/fall back to mock data.

Also confirm `backend/.env` includes the frontend's origin in `CORS_ORIGINS`, e.g.:

```text
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174
```

### 4. Verifying the Connection

```sh
# REST API
curl http://127.0.0.1:8000/employees

# WebSocket (requires python + websockets package)
python -c "
import asyncio, websockets
async def main():
    async with websockets.connect('ws://127.0.0.1:8000/ws/dashboard') as ws:
        print(await ws.recv())
asyncio.run(main())
"
```

A successful connection returns employee JSON data from the REST call and a `dashboard.update` message from the WebSocket within a few seconds. Then open `http://localhost:5173` in the browser and sign in with a demo account — the dashboard should show live data instead of mock data.

---

## 🎯 Project Objectives

The main objective is to demonstrate how real-time HR analytics can support better workforce and wage management.

### Specific Objectives

1. Monitor employee attendance in real time.
2. Track employee working hours.
3. Monitor overtime hours and overtime costs.
4. Analyze employee absenteeism.
5. Monitor leave utilization.
6. Calculate and analyze wage and payroll costs.
7. Compare workforce performance across departments.
8. Detect unusual HR patterns through automated alerts.
9. Provide management with interactive reports and analytics.
10. Support evidence-based HR decision-making.
11. Improve workforce planning.
12. Improve payroll accuracy and labour-cost control.

---

## 🚀 Key Features

### 📊 Real-Time Dashboard

The main dashboard provides an overview of the organization's workforce.

It displays:

- Total employees
- Attendance rate
- Absenteeism rate
- Overtime hours
- Expected gross payroll
- Active employees
- Employees on leave
- Average working hours
- Average overtime
- Labour costs

---

### 👥 Employee Management

HR administrators can:

- View employees
- Search employees
- Filter employees
- View employee information
- View department assignments
- Monitor employee status
- View individual attendance performance

---

### 🕒 Attendance Management

The system monitors employee attendance and working hours.

It provides:

- Attendance rate
- Absenteeism rate
- Present days
- Absent days
- Late records
- Working hours
- Attendance by department
- Employee attendance history

---

### ⏱️ Overtime Management

The system provides detailed overtime analytics.

HR managers can monitor:

- Total overtime hours
- Overtime by employee
- Overtime by department
- Average overtime per employee
- Overtime cost
- High-overtime departments
- Overtime trends

---

### 📅 Leave Management

The system tracks employee leave.

It provides:

- Leave requests
- Leave approvals
- Leave days
- Leave types
- Employees currently on leave
- Leave utilization
- Department leave trends

---

### 💰 Payroll & Wage Analytics

The system provides wage and payroll analysis.

It monitors:

- Basic wages
- Overtime pay
- Expected gross payroll
- Processed payroll
- Payroll variance
- Labour cost
- Department wage costs

---

### 🏢 Department Analytics

Management can compare departments based on:

- Attendance
- Absenteeism
- Overtime
- Working hours
- Employee count
- Wage costs
- Productivity indicators

---

### 🚨 Alerts & Exceptions

The dashboard automatically identifies HR issues.

Example alerts include:

```text
🚨 High Absenteeism
Administration has exceeded the absenteeism threshold.

⚠️ High Overtime
Operations has recorded unusually high overtime.

💰 Payroll Variance
Payroll variance detected for employees.

🔵 Low Attendance
Employee attendance is below the required threshold.

📅 Leave Alert
High leave utilization detected.
```

---

## ⚡ Real-Time Architecture

The system uses WebSockets to provide real-time dashboard updates.

The general data flow is:

```text
             HR DATA
                │
                ▼
        ┌─────────────────┐
        │    PostgreSQL   │
        │     Database    │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │     FastAPI     │
        │     Backend     │
        └────────┬────────┘
                 │
        ┌────────┴─────────┐
        │                  │
     REST API          WebSocket
        │                  │
        └────────┬─────────┘
                 ▼
        ┌─────────────────┐
        │ React Dashboard │
        └────────┬────────┘
                 │
       ┌─────────┼──────────┐
       ▼         ▼          ▼
 Attendance   Payroll   Overtime
 Analytics    Analytics Analytics
       │         │          │
       └─────────┼──────────┘
                 ▼
        Management Insights
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| React | User interface |
| Vite | Frontend development/build tool |
| Tailwind CSS | UI styling |
| Recharts | Data visualization |
| Axios | API communication |
| React Router | Application navigation |

### Backend

| Technology | Purpose |
| --- | --- |
| FastAPI | REST API |
| Python | Backend programming |
| SQLAlchemy | Database ORM |
| Pydantic | Data validation |
| WebSockets | Real-time communication |
| Pandas | HR data processing |

### Database

**PostgreSQL** is used to store:

- Employees
- Departments
- Attendance
- Overtime
- Leave
- Payroll
- Alerts
- User accounts

### Authentication

The application uses:

- JWT authentication
- Role-based access control
- Secure password hashing

Possible roles include:

- `ADMIN`
- `HR_MANAGER`
- `MANAGER`

---

## 📂 Project Structure

```text
columbus-hr-dashboard/
│
├── frontend/
│   ├── public/
│   │   └── logo.png
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── DashboardLayout.jsx
│   │   │   │
│   │   │   ├── cards/
│   │   │   │   ├── KPICard.jsx
│   │   │   │   ├── AttendanceCard.jsx
│   │   │   │   ├── PayrollCard.jsx
│   │   │   │   └── OvertimeCard.jsx
│   │   │   │
│   │   │   ├── charts/
│   │   │   │   ├── AttendanceChart.jsx
│   │   │   │   ├── OvertimeChart.jsx
│   │   │   │   ├── PayrollChart.jsx
│   │   │   │   ├── DepartmentChart.jsx
│   │   │   │   └── WorkforceChart.jsx
│   │   │   │
│   │   │   ├── tables/
│   │   │   │   ├── EmployeeTable.jsx
│   │   │   │   ├── AttendanceTable.jsx
│   │   │   │   └── PayrollTable.jsx
│   │   │   │
│   │   │   └── alerts/
│   │   │       ├── AlertPanel.jsx
│   │   │       └── AlertItem.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Overtime.jsx
│   │   │   ├── Leave.jsx
│   │   │   ├── Payroll.jsx
│   │   │   ├── Departments.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Reports.jsx
│   │   │   ├── Alerts.jsx
│   │   │   └── Settings.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── employeeService.js
│   │   │   ├── attendanceService.js
│   │   │   ├── payrollService.js
│   │   │   └── analyticsService.js
│   │   │
│   │   ├── hooks/
│   │   │   ├── useEmployees.js
│   │   │   ├── useAttendance.js
│   │   │   └── useWebSocket.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── DashboardContext.jsx
│   │   │
│   │   ├── utils/
│   │   │   ├── formatCurrency.js
│   │   │   ├── formatPercentage.js
│   │   │   └── calculations.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   │
│   │   ├── models/
│   │   │   ├── employee.py
│   │   │   ├── attendance.py
│   │   │   ├── overtime.py
│   │   │   ├── leave.py
│   │   │   ├── payroll.py
│   │   │   └── department.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── employee.py
│   │   │   ├── attendance.py
│   │   │   ├── overtime.py
│   │   │   ├── leave.py
│   │   │   ├── payroll.py
│   │   │   └── analytics.py
│   │   │
│   │   ├── routers/
│   │   │   ├── employees.py
│   │   │   ├── attendance.py
│   │   │   ├── overtime.py
│   │   │   ├── leave.py
│   │   │   ├── payroll.py
│   │   │   ├── departments.py
│   │   │   ├── analytics.py
│   │   │   ├── reports.py
│   │   │   └── alerts.py
│   │   │
│   │   ├── services/
│   │   │   ├── employee_service.py
│   │   │   ├── attendance_service.py
│   │   │   ├── payroll_service.py
│   │   │   ├── analytics_service.py
│   │   │   ├── alert_service.py
│   │   │   └── report_service.py
│   │   │
│   │   ├── websocket/
│   │   │   └── manager.py
│   │   │
│   │   └── utils/
│   │       ├── calculations.py
│   │       └── validators.py
│   │
│   ├── tests/
│   ├── requirements.txt
│   └── .env
│
├── data/
│   ├── employee_data.xlsx
│   ├── employee_data.csv
│   └── seed_data.py
│
├── database/
│   ├── migrations/
│   └── schema.sql
│
├── docker/
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## 📊 Dashboard KPIs

The main dashboard provides the following KPIs:

| KPI | Description |
| --- | --- |
| Total Employees | Number of employees |
| Attendance Rate | Percentage of expected attendance |
| Absenteeism Rate | Percentage of employee absence |
| Overtime Hours | Total recorded overtime |
| Expected Gross Payroll | Expected employee wage cost |
| Active Employees | Currently active employees |
| Employees on Leave | Employees currently on approved leave |
| Average Working Hours | Average employee working hours |
| Average Overtime | Average overtime per employee |
| Labour Cost | Total employee wage cost |

---

## 📈 Analytics

The system provides several analytical visualizations.

**Attendance Analytics**
- Attendance by department
- Attendance trends
- Employee attendance
- Absenteeism trends

**Overtime Analytics**
- Overtime by department
- Overtime trends
- Overtime cost
- Average overtime per employee

**Payroll Analytics**
- Basic wage cost
- Overtime cost
- Gross payroll
- Payroll variance
- Department labour cost

**Workforce Analytics**
- Employee distribution
- Department size
- Active vs inactive employees
- Leave utilization

---

## 📥 Data Import

The system supports importing the hypothetical HR dataset from Excel or CSV.

Data flow:

```text
Excel / CSV
     ↓
Pandas
     ↓
Validation
     ↓
Data Transformation
     ↓
PostgreSQL
     ↓
FastAPI
     ↓
React Dashboard
```

The `data/` directory contains the initial dataset and database seeding utilities.
