import { useEffect, useState } from 'react'
import { Download, FileText, Printer } from 'lucide-react'
import { createReport, getReportPreview } from '../services/analyticsService.js'
import { MOCK_DATA } from '../services/api.js'
import formatCurrency from '../utils/formatCurrency.js'
import formatPercentage from '../utils/formatPercentage.js'

const initialFilters = { startDate: '2026-10-01', endDate: '2026-10-07', department: 'All departments' }

export default function Reports() {
	const [filters, setFilters] = useState(initialFilters)
	const [rows, setRows] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [notice, setNotice] = useState('')
	const load = async () => {
		setLoading(true); setError(''); setNotice('')
		try { setRows(await getReportPreview(filters)) } catch { setError('Report preview could not be generated. Retry the request.') }
		finally { setLoading(false) }
	}
	useEffect(() => {
		let active = true
		getReportPreview(initialFilters).then((data) => { if (active) setRows(data) })
			.catch(() => { if (active) setError('Report preview could not be generated. Retry the request.') })
			.finally(() => { if (active) setLoading(false) })
		return () => { active = false }
	}, [])
	const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
	const exportCsv = async () => {
		try {
			await createReport(filters)
			const headers = ['Department', 'Headcount', 'Attendance', 'Overtime hours', 'Gross payroll', 'Period']
			const csv = [headers.join(','), ...rows.map((row) => [row.department, row.headcount, row.attendance, row.overtimeHours, row.grossPayroll, row.period].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))].join('\n')
			const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
			const link = document.createElement('a'); link.href = url; link.download = 'columbus-hr-report.csv'; link.click(); URL.revokeObjectURL(url)
			setNotice('CSV report downloaded.')
		} catch { setNotice('The report export could not be completed.') }
	}
	return <section className="page-stack"><div className="page-intro"><div><span className="eyebrow">REPORT BUILDER</span><h2>Reports</h2><p>Define a reporting period, preview department metrics and export.</p></div></div><section className="panel report-filters"><div className="report-filter-field"><label htmlFor="report-start">From</label><input id="report-start" type="date" value={filters.startDate} onChange={(event) => update('startDate', event.target.value)} /></div><div className="report-filter-field"><label htmlFor="report-end">To</label><input id="report-end" type="date" value={filters.endDate} onChange={(event) => update('endDate', event.target.value)} /></div><div className="report-filter-field"><label htmlFor="report-department">Department</label><select id="report-department" value={filters.department} onChange={(event) => update('department', event.target.value)}><option>All departments</option>{MOCK_DATA.departments.map((department) => <option key={department.id}>{department.name}</option>)}</select></div><button className="primary-button" onClick={load} disabled={loading}>Generate preview</button></section><div className="report-preview-heading"><div><span className="eyebrow">PREVIEW</span><h3>Workforce & labour summary</h3><p>{filters.startDate} to {filters.endDate} · {filters.department}</p></div><div className="report-export-actions"><button className="secondary-button" onClick={exportCsv} disabled={loading}><Download size={15} />CSV</button><button className="secondary-button" onClick={() => window.print()} disabled={loading}><Printer size={15} />PDF / Print</button></div></div>{notice && <div className="inline-notice" role="status">{notice}</div>}{error ? <div className="panel error-state" role="alert"><strong>Report preview unavailable</strong><span>{error}</span><button className="secondary-button" onClick={load}>Retry</button></div> : loading ? <div className="panel skeleton-table" role="status" aria-label="Generating report">{Array.from({ length: 5 }, (_, index) => <i key={index} />)}</div> : <div className="panel report-preview"><div className="report-meta"><FileText size={17} /><span>Columbus Company Limited · HR Analytics</span></div>{rows.length ? <div className="table-scroll"><table><thead><tr><th>Department</th><th>Headcount</th><th>Attendance</th><th>Overtime</th><th>Gross payroll</th><th>Period</th></tr></thead><tbody>{rows.map((row) => <tr key={row.department}><td><strong>{row.department}</strong></td><td>{row.headcount}</td><td>{formatPercentage(row.attendance)}</td><td>{row.overtimeHours} hrs</td><td>{formatCurrency(row.grossPayroll)}</td><td>{row.period}</td></tr>)}</tbody></table></div> : <div className="empty-state">No report data matches the selected filters.</div>}<div className="report-footnote">Generated for internal workforce planning · Columbus Company Limited</div></div>}</section>
}