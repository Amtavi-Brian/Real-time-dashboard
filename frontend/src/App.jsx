import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { DashboardProvider } from './context/DashboardContext.jsx'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
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

function RouteGate({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Suspense fallback={<div className="page-loading" role="status">Loading workspace…</div>}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route element={<RouteGate><DashboardLayout /></RouteGate>}>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="overtime" element={<Overtime />} />
          <Route path="leave" element={<Leave />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="departments" element={<Departments />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="settings" element={<RouteGate roles={['ADMIN', 'HR_MANAGER']}><Settings /></RouteGate>} />
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
