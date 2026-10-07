import { Bell, ChevronDown, Menu, Moon, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../../context/AuthContext.jsx'
import { useDashboard } from '../../context/DashboardContext.jsx'

const titles = { '/': 'Overview', '/employees': 'Employees', '/attendance': 'Attendance', '/overtime': 'Overtime', '/leave': 'Leave management', '/payroll': 'Payroll', '/departments': 'Departments', '/analytics': 'Analytics', '/reports': 'Reports', '/alerts': 'Alerts', '/settings': 'Settings' }

export default function Navbar({ onMenu, dark, onTheme }) {
  const { user, logout } = useAuth()
  const { connection } = useDashboard()
  const location = useLocation()
  const status = connection === 'live' ? 'Live' : connection === 'reconnecting' || connection === 'connecting' ? 'Reconnecting' : 'Offline'
  return <header className="topbar">
    <button className="icon-button menu-button" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button>
    <div className="page-heading"><span className="eyebrow">COLUMBUS COMPANY LIMITED</span><h1>{titles[location.pathname] || 'Workspace'}</h1></div>
    <div className="topbar-actions"><div className={`connection-pill connection-${status.toLowerCase()}`} aria-live="polite"><span className="connection-dot" />{status}</div><button className="icon-button theme-toggle" onClick={onTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button><Link className="icon-button notification-button" to="/alerts" aria-label="View alerts"><Bell size={18} /><i /></Link><div className="user-menu"><div className="avatar">{user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'JM'}</div><div className="user-meta"><strong>{user?.name || 'Jordan Mensah'}</strong><span>{user?.role?.replace('_', ' ') || 'ADMIN'}</span></div><button className="icon-button logout-button" onClick={logout} title="Sign out" aria-label="Sign out"><ChevronDown size={16} /></button></div></div>
  </header>
}

Navbar.propTypes = { onMenu: PropTypes.func.isRequired, dark: PropTypes.bool.isRequired, onTheme: PropTypes.func.isRequired }