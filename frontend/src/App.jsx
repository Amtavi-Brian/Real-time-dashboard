import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { DashboardProvider } from './context/DashboardContext.jsx'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import { canAccessPath } from './utils/roleAccess.js'
import './App.css'

const Login = lazy(() => import('./pages/Login.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Employees = lazy(() => import('./pages/Employees.jsx'))
const Attendance = lazy(() => import('./pages/Attendance.jsx'))
const Overtime = lazy(() => import('./pages/Overtime.jsx'))
const Leave = lazy(() => import('./pages/Leave.jsx'))
const Payroll = lazy(() => import('./pages/Payroll.jsx'))
const Departments = lazy(() => import('./pages/Departments.jsx'))
const Analytics = lazy(() => import('./pages/Analytics.jsx'))
const Reports = lazy(() => import('./pages/Reports.jsx'))
const Alerts = lazy(() => import('./pages/Alerts.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))

function RouteGate({ children, path }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (path && !canAccessPath(user.role, path)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Suspense fallback={<div className="page-loading" role="status">Loading workspace…</div>}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route element={<RouteGate><DashboardLayout /></RouteGate>}>
          <Route index element={<RouteGate path="/"><Dashboard /></RouteGate>} />
          <Route path="employees" element={<RouteGate path="/employees"><Employees /></RouteGate>} />
          <Route path="attendance" element={<RouteGate path="/attendance"><Attendance /></RouteGate>} />
          <Route path="overtime" element={<RouteGate path="/overtime"><Overtime /></RouteGate>} />
          <Route path="leave" element={<RouteGate path="/leave"><Leave /></RouteGate>} />
          <Route path="payroll" element={<RouteGate path="/payroll"><Payroll /></RouteGate>} />
          <Route path="departments" element={<RouteGate path="/departments"><Departments /></RouteGate>} />
          <Route path="analytics" element={<RouteGate path="/analytics"><Analytics /></RouteGate>} />
          <Route path="reports" element={<RouteGate path="/reports"><Reports /></RouteGate>} />
          <Route path="alerts" element={<RouteGate path="/alerts"><Alerts /></RouteGate>} />
          <Route path="settings" element={<RouteGate path="/settings"><Settings /></RouteGate>} />
        </Route>
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </Suspense>
  )
}

function App() {
  return <BrowserRouter><AuthProvider><DashboardProvider><AppRoutes /></DashboardProvider></AuthProvider></BrowserRouter>
}

export default App
