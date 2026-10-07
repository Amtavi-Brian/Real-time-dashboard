import { Activity, Bell, BriefcaseBusiness, Building2, CalendarDays, ChartNoAxesCombined, Clock3, FileBarChart2, LayoutDashboard, Settings, Users, Wallet, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

const navigation = [
  { label: 'Overview', path: '/', icon: LayoutDashboard }, { label: 'Employees', path: '/employees', icon: Users },
  { label: 'Attendance', path: '/attendance', icon: CalendarDays }, { label: 'Overtime', path: '/overtime', icon: Clock3 },
  { label: 'Leave', path: '/leave', icon: BriefcaseBusiness }, { label: 'Payroll', path: '/payroll', icon: Wallet },
  { label: 'Departments', path: '/departments', icon: Building2 }, { label: 'Analytics', path: '/analytics', icon: ChartNoAxesCombined },
  { label: 'Reports', path: '/reports', icon: FileBarChart2 }, { label: 'Alerts', path: '/alerts', icon: Bell },
]

export default function Sidebar({ open, onClose, role }) {
  return <>
    <button className={`sidebar-scrim ${open ? 'visible' : ''}`} onClick={onClose} aria-label="Close navigation" />
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} aria-label="Main navigation">
      <div className="brand-lockup"><div className="brand-mark">C</div><div><strong>Columbus</strong><span>PEOPLE INTELLIGENCE</span></div><button className="icon-button sidebar-close" onClick={onClose} aria-label="Close menu"><X size={18} /></button></div>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="nav-list">{navigation.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} end={path === '/'} onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18} strokeWidth={1.8} /><span>{label}</span>{label === 'Alerts' && <i className="nav-count">5</i>}</NavLink>)}</nav>
      {['ADMIN', 'HR_MANAGER'].includes(role) && <div className="sidebar-footer"><NavLink to="/settings" onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Settings size={18} strokeWidth={1.8} /><span>Settings</span></NavLink><div className="sidebar-note"><Activity size={16} /><span>People, in real time.</span></div></div>}
    </aside>
  </>
}

Sidebar.propTypes = { open: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired, role: PropTypes.string }