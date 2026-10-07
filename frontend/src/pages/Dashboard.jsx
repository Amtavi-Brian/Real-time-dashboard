import { useMemo, useState } from 'react'
import { Activity, ArrowUpRight, Clock3, Download, Users, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useDashboard } from '../context/DashboardContext.jsx'
import { MOCK_DATA } from '../services/api.js'
import formatPercentage from '../utils/formatPercentage.js'
import KPICard from '../components/cards/KPICard.jsx'
import AttendanceChart from '../components/charts/AttendanceChart.jsx'
import OvertimeChart from '../components/charts/OvertimeChart.jsx'
import PayrollChart from '../components/charts/PayrollChart.jsx'
import DepartmentChart from '../components/charts/DepartmentChart.jsx'
import WorkforceChart from '../components/charts/WorkforceChart.jsx'
import AlertPanel from '../components/alerts/AlertPanel.jsx'

const compactCurrency = (value) => `GHS ${(value / 1000000).toFixed(1)}m`

export default function Dashboard() {
	const { user } = useAuth()
	const { metrics, alerts, charts, lastUpdated, loading, error, retry } = useDashboard()
	const [range, setRange] = useState('7 days')
	const departments = charts.departments || MOCK_DATA.departments
	const workforce = useMemo(() => departments.map(({ name, headcount }) => ({ name, value: headcount })), [departments])
	const cards = [
		{ label: 'Total employees', value: metrics.totalEmployees.toLocaleString(), delta: '+2.4%', note: 'vs last month', icon: Users, tone: 'blue' },
		{ label: 'Attendance rate', value: formatPercentage(metrics.attendanceRate), delta: '+1.2%', note: 'vs last week', icon: Activity, tone: 'green' },
		{ label: 'Absenteeism rate', value: formatPercentage(metrics.absenteeismRate), delta: '-0.6%', note: 'vs last week', icon: ArrowUpRight, tone: 'green' },
		{ label: 'Overtime hours', value: metrics.overtimeHours.toLocaleString(), delta: '+4.8%', note: 'vs last month', icon: Clock3, tone: 'amber' },
		{ label: 'Expected gross payroll', value: compactCurrency(metrics.expectedPayroll), delta: '+2.1%', note: 'October cycle', icon: Wallet, tone: 'blue' },
		{ label: 'Active employees', value: metrics.activeEmployees.toLocaleString(), delta: '98.5%', note: 'of total workforce', icon: Users, tone: 'green' },
		{ label: 'Employees on leave', value: String(metrics.employeesOnLeave), delta: '2.7%', note: 'of active workforce', icon: Users, tone: 'amber' },
		{ label: 'Average working hours', value: `${metrics.averageWorkingHours.toFixed(1)}h`, delta: '+0.3h', note: 'per employee / week', icon: Clock3, tone: 'blue' },
		{ label: 'Average overtime', value: `${metrics.averageOvertime.toFixed(1)}h`, delta: '-0.4h', note: 'per employee / month', icon: Clock3, tone: 'green' },
		{ label: 'Labour cost', value: compactCurrency(metrics.labourCost), delta: '+1.8%', note: 'month to date', icon: Wallet, tone: 'amber' },
	]
	const isManager = user?.role === 'MANAGER'
	const managerDepartment = departments.find((department) => department.name === user?.department)
	const visibleCards = isManager
		? cards.filter(({ label }) => ['Attendance rate', 'Absenteeism rate', 'Overtime hours', 'Average working hours', 'Average overtime'].includes(label)).map((card) => {
			if (card.label === 'Attendance rate') return { ...card, value: formatPercentage(managerDepartment?.attendanceRate ?? metrics.attendanceRate), note: user.department }
			if (card.label === 'Absenteeism rate') return { ...card, value: formatPercentage(managerDepartment?.absenteeismRate ?? metrics.absenteeismRate), note: user.department }
			if (card.label === 'Overtime hours') return { ...card, value: (managerDepartment?.overtimeHours ?? 0).toLocaleString(), note: user.department }
			if (card.label === 'Average working hours') return { ...card, value: `${(managerDepartment?.workingHours ?? 0).toFixed(1)}h`, note: 'team average / week' }
			return { ...card, value: `${(managerDepartment ? managerDepartment.overtimeHours / managerDepartment.headcount : 0).toFixed(1)}h`, note: 'team average / month' }
		})
		: cards
	const overtimeData = isManager ? charts.overtime.filter((item) => item.department === user.department) : charts.overtime
	const visibleAlerts = isManager ? alerts.filter((alert) => alert.department === user.department || alert.department === 'All departments') : alerts

	return <section className="page-stack dashboard-page">
		<div className="page-intro dashboard-intro"><div><span className="eyebrow">TUESDAY, 7 OCTOBER 2026 · WORKFORCE PULSE</span><h2>Good morning, {user?.name?.split(' ')[0] || 'Jordan'}</h2><p>Here’s how your people and operations are moving today.</p></div><div className="intro-actions"><span className="updated-time"><span className="connection-dot" />Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><select aria-label="Dashboard time range" value={range} onChange={(event) => setRange(event.target.value)}><option>7 days</option><option>30 days</option><option>This quarter</option></select><button className="secondary-button export-action" onClick={() => window.print()}><Download size={15} />Export</button></div></div>
		{error ? <div className="panel error-state" role="alert"><strong>Dashboard is offline</strong><span>{error}</span><button className="secondary-button" onClick={retry}>Retry</button></div> : loading ? <div className="dashboard-loading" role="status" aria-label="Loading dashboard"><div className="skeleton-kpis">{Array.from({ length: isManager ? 5 : 10 }, (_, index) => <i key={index} />)}</div><div className="skeleton-charts"><i /><i /></div></div> : <><div className={`kpi-grid ${isManager ? 'manager-kpi-grid' : ''}`}>{visibleCards.map((card) => <KPICard key={card.label} {...card} />)}</div>
		<div className="dashboard-grid charts-grid"><section className="panel chart-panel attendance-panel"><div className="panel-heading"><div><span className="eyebrow">DAILY TREND · ORGANISATION</span><h3>Attendance overview</h3></div><span className="chart-legend"><i className="legend-dot teal" />This week<i className="legend-dot coral" />Last week</span></div><AttendanceChart data={charts.attendance} /></section><section className="panel chart-panel overtime-panel"><div className="panel-heading"><div><span className="eyebrow">{isManager ? user.department?.toUpperCase() : 'MONTH TO DATE'}</span><h3>{isManager ? 'Team overtime' : 'Overtime by department'}</h3></div><span className="panel-total">{isManager ? overtimeData.reduce((total, item) => total + item.hours, 0).toLocaleString() : metrics.overtimeHours.toLocaleString()} <small>hours</small></span></div><OvertimeChart data={overtimeData} /></section></div>
		<div className={`dashboard-grid lower-grid ${isManager ? 'manager-lower-grid' : ''}`}>{!isManager && <><section className="panel chart-panel payroll-panel"><div className="panel-heading"><div><span className="eyebrow">GHS · MILLIONS</span><h3>Payroll breakdown</h3></div><Link className="text-action" to="/payroll">View payroll</Link></div><PayrollChart data={charts.payroll} /></section><section className="panel chart-panel department-panel"><div className="panel-heading"><div><span className="eyebrow">264 PEOPLE</span><h3>Workforce distribution</h3></div></div><div className="workforce-content"><WorkforceChart data={workforce} /><div className="workforce-legend">{workforce.map((item, index) => <div key={item.name}><i className={`legend-swatch swatch-${index}`} /><span>{item.name}</span><strong>{item.value}</strong></div>)}</div></div></section></>}<section className="panel alert-panel dashboard-alert-panel"><div className="panel-heading"><div><span className="eyebrow">NEEDS ATTENTION</span><h3>Live alerts</h3></div><span className="alert-count">{visibleAlerts.filter((alert) => alert.unread).length} new</span></div><AlertPanel alerts={visibleAlerts.slice(0, 4)} /></section>{!isManager && <section className="panel chart-panel department-score-panel"><div className="panel-heading"><div><span className="eyebrow">TEAM INDICATORS</span><h3>Department health</h3></div></div><DepartmentChart data={departments} /></section>}</div></>}
		<div className="dashboard-endnote"><span><span className="connection-dot" />Live workforce feed</span><span>Data refreshes automatically · {range}</span></div>
	</section>
}