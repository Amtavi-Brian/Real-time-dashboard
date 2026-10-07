import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function DashboardLayout() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('columbus_theme') === 'dark')
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('columbus_theme', dark ? 'dark' : 'light')
  }, [dark])
  return <div className="app-shell"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} role={user?.role} /><div className="main-column"><Navbar onMenu={() => setMenuOpen(true)} dark={dark} onTheme={() => setDark((value) => !value)} /><main className="content-area"><Outlet /></main><footer className="app-footer"><span>© 2026 Columbus Company Limited</span><span>HR intelligence platform · Demo data</span></footer></div></div>
}