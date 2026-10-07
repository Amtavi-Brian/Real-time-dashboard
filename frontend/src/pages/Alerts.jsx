import { useEffect, useMemo, useState } from 'react'
import { Bell, Search } from 'lucide-react'
import AlertItem from '../components/alerts/AlertItem.jsx'
import { useDashboard } from '../context/DashboardContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getAlerts } from '../services/analyticsService.js'

export default function Alerts() {
	const { alerts: liveAlerts, connection } = useDashboard()
	const { user } = useAuth()
	const [records, setRecords] = useState([])
	const [severity, setSeverity] = useState('All severities')
	const [kind, setKind] = useState('All alert types')
	const [query, setQuery] = useState('')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const load = async () => {
		setLoading(true); setError('')
		try { const result = await getAlerts(); setRecords(result.items || result) }
		catch { setError('Alerts could not be loaded. Check your connection and retry.') }
		finally { setLoading(false) }
	}
	useEffect(() => {
		let active = true
		getAlerts().then((result) => { if (active) setRecords(result.items || result) })
			.catch(() => { if (active) setError('Alerts could not be loaded. Check your connection and retry.') })
			.finally(() => { if (active) setLoading(false) })
		return () => { active = false }
	}, [])
	const allAlerts = useMemo(() => {
		const merged = [...liveAlerts, ...records.filter((record) => !liveAlerts.some((live) => live.id === record.id))]
		return user?.role === 'MANAGER' ? merged.filter((alert) => alert.department === user.department || alert.department === 'All departments') : merged
	}, [liveAlerts, records, user])
	const types = ['All alert types', ...new Set(allAlerts.map((alert) => alert.type))]
	const visible = allAlerts.filter((alert) => (severity === 'All severities' || alert.severity === severity) && (kind === 'All alert types' || alert.type === kind) && `${alert.title} ${alert.message} ${alert.department}`.toLowerCase().includes(query.toLowerCase()))
	return <section className="page-stack"><div className="page-intro"><div><span className="eyebrow">MONITORING & EXCEPTIONS</span><h2>Alert centre</h2><p>Prioritised signals from attendance, overtime, payroll and leave.</p></div><div className="connection-pill"><span className={`connection-dot ${connection === 'live' ? '' : 'connection-offline'}`} />Live feed {connection === 'live' ? 'connected' : 'reconnecting'}</div></div><div className="alert-summary"><div><span>Open alerts</span><strong>{allAlerts.length}</strong></div><div><span>High priority</span><strong className="critical-value">{allAlerts.filter((alert) => alert.severity === 'High').length}</strong></div><div><span>Unread</span><strong>{allAlerts.filter((alert) => alert.unread).length}</strong></div></div><div className="panel alerts-page-panel"><div className="table-toolbar"><label className="search-field"><Search size={16} /><span className="sr-only">Search alerts</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search alerts…" /></label><div className="alert-filters"><label><span className="sr-only">Filter severity</span><select value={severity} onChange={(event) => setSeverity(event.target.value)}><option>All severities</option><option>High</option><option>Medium</option><option>Low</option></select></label><label><span className="sr-only">Filter alert type</span><select value={kind} onChange={(event) => setKind(event.target.value)}>{types.map((item) => <option key={item}>{item}</option>)}</select></label></div></div>{error ? <div className="error-state" role="alert"><strong>Alert feed unavailable</strong><span>{error}</span><button className="secondary-button" onClick={load}>Retry</button></div> : loading ? <div className="skeleton-table" role="status" aria-label="Loading alerts">{Array.from({ length: 5 }, (_, index) => <i key={index} />)}</div> : visible.length ? <div className="alerts-feed">{visible.map((alert) => <AlertItem key={alert.id} alert={alert} />)}</div> : <div className="empty-state"><Bell size={22} /><strong>No alerts match these filters</strong><span>Try another severity or alert type.</span></div>}</div></section>
}