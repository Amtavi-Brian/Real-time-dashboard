import { useEffect, useState } from 'react'
import { Activity, BarChart3, CircleDollarSign, Users } from 'lucide-react'
import { getAnalyticsView } from '../services/analyticsService.js'
import { MOCK_DATA } from '../services/api.js'
import AttendanceChart from '../components/charts/AttendanceChart.jsx'
import OvertimeChart from '../components/charts/OvertimeChart.jsx'
import PayrollChart from '../components/charts/PayrollChart.jsx'
import WorkforceChart from '../components/charts/WorkforceChart.jsx'
import DepartmentChart from '../components/charts/DepartmentChart.jsx'

const tabs = [
	{ id: 'attendance', label: 'Attendance', icon: Activity }, { id: 'overtime', label: 'Overtime', icon: BarChart3 },
	{ id: 'payroll', label: 'Payroll', icon: CircleDollarSign }, { id: 'workforce', label: 'Workforce', icon: Users },
]

export default function Analytics() {
	const [active, setActive] = useState('attendance')
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [reloadKey, setReloadKey] = useState(0)
	const load = () => { setLoading(true); setError(''); setReloadKey((value) => value + 1) }
	useEffect(() => {
		let current = true
		getAnalyticsView(active).then((result) => { if (current) setData(result) })
			.catch(() => { if (current) setError('Analytics could not be loaded. Retry the request.') })
			.finally(() => { if (current) setLoading(false) })
		return () => { current = false }
	}, [active, reloadKey])
	const chart = active === 'attendance' ? <AttendanceChart data={data} /> : active === 'overtime' ? <OvertimeChart data={data} /> : active === 'payroll' ? <PayrollChart data={data} /> : <div className="workforce-content analytics-workforce"><WorkforceChart data={data.map((item) => ({ name: item.name, value: item.headcount }))} /><div className="workforce-legend">{data.map((item, index) => <div key={item.name}><i className={`legend-swatch swatch-${index}`} /><span>{item.name}</span><strong>{item.headcount}</strong></div>)}</div></div>
	const title = tabs.find((tab) => tab.id === active)?.label
	return <section className="page-stack"><div className="page-intro"><div><span className="eyebrow">TRENDS & COMPARISONS</span><h2>Analytics</h2><p>Explore workforce signals across the organisation.</p></div></div><div className="analytics-tabs" role="tablist" aria-label="Analytics view">{tabs.map(({ id, label, icon: Icon }) => <button key={id} className={`analytics-tab ${active === id ? 'selected' : ''}`} role="tab" aria-selected={active === id} onClick={() => setActive(id)}><Icon size={16} />{label}</button>)}</div><section className="panel analytics-main-panel"><div className="panel-heading"><div><span className="eyebrow">{active === 'attendance' ? 'DAILY · LAST 7 DAYS' : active === 'overtime' ? 'MONTH TO DATE · HOURS' : active === 'payroll' ? 'MONTHLY · GHS MILLIONS' : 'CURRENT HEADCOUNT'}</span><h3>{title} analytics</h3></div><span className="chart-period">October 2026</span></div>{error ? <div className="error-state" role="alert"><strong>Analytics unavailable</strong><span>{error}</span><button className="secondary-button" onClick={load}>Retry</button></div> : loading ? <div className="chart-skeleton" role="status" aria-label="Loading analytics"><i /><i /><i /><i /><i /></div> : !data?.length ? <div className="empty-state">No analytics are available for this period.</div> : <div className="analytics-chart">{chart}</div>}</section><div className="analytics-support-grid"><section className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">DEPARTMENT COMPARISON</span><h3>Attendance rate</h3></div></div><DepartmentChart data={MOCK_DATA.departments} /></section><section className="analytics-note"><span className="eyebrow">READING THE SIGNAL</span><strong>Small shifts can matter.</strong><p>Compare the current period with recent department patterns to spot changes before they become operational issues.</p><div><i className="legend-dot teal" />Current period<i className="legend-dot coral" />Prior period</div></section></div></section>
}