import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Download, Search, SlidersHorizontal } from 'lucide-react'
import { getEmployee } from '../services/employeeService.js'
import { getWorkspaceData } from '../services/analyticsService.js'
import { MOCK_DATA } from '../services/api.js'
import { updateLeaveStatus } from '../services/attendanceService.js'
import formatCurrency from '../utils/formatCurrency.js'
import formatPercentage from '../utils/formatPercentage.js'
import EmployeeTable from '../components/tables/EmployeeTable.jsx'
import AttendanceTable from '../components/tables/AttendanceTable.jsx'
import PayrollTable from '../components/tables/PayrollTable.jsx'

const views = {
  employees: { title: 'Employee directory', description: 'A current view of people, roles and attendance.', data: 'employees', columns: [['name', 'Employee'], ['department', 'Department'], ['title', 'Role'], ['attendanceRate', 'Attendance'], ['status', 'Status']] },
  attendance: { title: 'Attendance register', description: 'Daily presence, late arrivals and recorded hours.', data: 'attendance', columns: [['date', 'Date'], ['present', 'Present'], ['absent', 'Absent'], ['late', 'Late arrivals'], ['workingHours', 'Working hours']] },
  overtime: { title: 'Overtime by department', description: 'Monthly overtime load and estimated cost.', data: 'overtime', columns: [['department', 'Department'], ['hours', 'Overtime hours'], ['cost', 'Estimated cost']] },
  leave: { title: 'Leave requests', description: 'Review requests and current team availability.', data: 'leave', columns: [['employee', 'Employee'], ['department', 'Department'], ['type', 'Leave type'], ['startDate', 'Start date'], ['days', 'Days'], ['status', 'Status']] },
  payroll: { title: 'Payroll overview', description: 'Expected and processed wage costs by department.', data: 'payroll', columns: [['department', 'Department'], ['basicWages', 'Basic wages'], ['overtimePay', 'Overtime pay'], ['gross', 'Expected gross'], ['processed', 'Processed'], ['variance', 'Variance']] },
  departments: { title: 'Department comparison', description: 'Compare workforce health, cost and productivity.', data: 'departments', columns: [['name', 'Department'], ['headcount', 'Headcount'], ['attendanceRate', 'Attendance'], ['absenteeismRate', 'Absenteeism'], ['overtimeHours', 'Overtime hours'], ['wageCost', 'Wage cost'], ['productivity', 'Productivity']] },
  alerts: { title: 'Alert centre', description: 'Exceptions requiring awareness or follow-up.', data: 'alerts', columns: [['severity', 'Severity'], ['title', 'Alert'], ['department', 'Department'], ['time', 'Received']] },
}

const display = (value, key) => {
  if (['salary', 'wageCost', 'cost', 'basicWages', 'overtimePay', 'gross', 'processed', 'variance'].includes(key)) return formatCurrency(value)
  if (['attendanceRate', 'absenteeismRate', 'productivity'].includes(key)) return formatPercentage(value)
  if (key === 'status' || key === 'severity') return <span className={`status-badge status-${String(value).toLowerCase().replaceAll(' ', '-')}`}>{value}</span>
  return value ?? '—'
}

export default function WorkspacePage({ type }) {
  const config = views[type]
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All departments')
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState({ key: '', direction: 1 })
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [notice, setNotice] = useState('')
  const load = async () => {
    setLoading(true); setError('')
    try { setRows(await getWorkspaceData(type)) }
    catch { setError(`${config.title} could not be loaded. Check the API connection and retry.`) }
    finally { setLoading(false) }
  }
  useEffect(() => {
    let active = true
    getWorkspaceData(type).then((data) => { if (active) setRows(data) })
      .catch(() => { if (active) setError(`${config.title} could not be loaded. Check the API connection and retry.`) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [type, config.title])
  const departments = ['All departments', ...new Set(MOCK_DATA.departments.map((item) => item.name))]
  const filtered = useMemo(() => rows.filter((row) => {
    const matchesQuery = Object.values(row).some((value) => String(value).toLowerCase().includes(query.toLowerCase()))
    const matchesDepartment = department === 'All departments' || row.department === department
    return matchesQuery && matchesDepartment
  }).sort((left, right) => sort.key ? String(left[sort.key]).localeCompare(String(right[sort.key]), undefined, { numeric: true }) * sort.direction : 0), [rows, query, department, sort])
  const pageSize = 7
  const shown = filtered.slice(page * pageSize, (page + 1) * pageSize)
  const summary = useMemo(() => {
    if (type === 'employees') return [{ label: 'Total employees', value: rows.length }, { label: 'Active employees', value: rows.filter((row) => row.status === 'Active').length }, { label: 'On leave', value: rows.filter((row) => row.status === 'On leave').length }]
    if (type === 'attendance') return [{ label: 'Present today', value: rows.at(-1)?.present || 0 }, { label: 'Absent today', value: rows.at(-1)?.absent || 0 }, { label: 'Late arrivals', value: rows.at(-1)?.late || 0 }, { label: 'Hours recorded', value: (rows.at(-1)?.workingHours || 0).toLocaleString() }]
    if (type === 'overtime') return [{ label: 'Overtime hours', value: rows.reduce((sum, row) => sum + row.hours, 0).toLocaleString() }, { label: 'Overtime cost', value: formatCurrency(rows.reduce((sum, row) => sum + row.cost, 0)) }, { label: 'Departments flagged', value: rows.filter((row) => row.hours > 300).length }]
    if (type === 'leave') return [{ label: 'Pending requests', value: rows.filter((row) => row.status === 'Pending').length }, { label: 'Approved days', value: rows.filter((row) => row.status === 'Approved').reduce((sum, row) => sum + row.days, 0) }, { label: 'Currently away', value: rows.filter((row) => row.status === 'Approved' && row.startDate <= '2026-10-07' && row.endDate >= '2026-10-07').length }]
    if (type === 'payroll') return [{ label: 'Expected gross', value: formatCurrency(rows.reduce((sum, row) => sum + row.gross, 0)) }, { label: 'Processed', value: formatCurrency(rows.reduce((sum, row) => sum + row.processed, 0)) }, { label: 'Variance', value: formatCurrency(rows.reduce((sum, row) => sum + row.variance, 0)) }]
    if (type === 'departments') return [{ label: 'Departments', value: rows.length }, { label: 'Headcount', value: rows.reduce((sum, row) => sum + row.headcount, 0) }, { label: 'Average attendance', value: formatPercentage(rows.length ? rows.reduce((sum, row) => sum + row.attendanceRate, 0) / rows.length : 0) }]
    return [{ label: 'Open alerts', value: rows.length }, { label: 'High severity', value: rows.filter((row) => row.severity === 'High').length }, { label: 'Unread', value: rows.filter((row) => row.unread).length }]
  }, [rows, type])
  const downloadCsv = () => {
    const csv = [config.columns.map(([, label]) => label).join(','), ...filtered.map((row) => config.columns.map(([key]) => `"${String(row[key] ?? '').replaceAll('"', '""')}"`).join(','))].join('\n')
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = `${type}-report.csv`; link.click(); URL.revokeObjectURL(link.href)
    setNotice('CSV export is ready.')
  }
  const actOnLeave = async (id, status) => {
    try { await updateLeaveStatus(id, status); setRows((current) => current.map((row) => row.id === id ? { ...row, status } : row)); setNotice(`Request ${id} marked ${status.toLowerCase()}.`) }
    catch { setNotice(`Could not update request ${id}. Try again.`) }
  }
  const openEmployee = async (id) => {
    try { setSelectedEmployee(await getEmployee(id)) } catch { setNotice('Employee details could not be loaded.') }
  }
  return <section className="page-stack"><div className="page-intro"><div><span className="eyebrow">PEOPLE OPERATIONS</span><h2>{config.title}</h2><p>{config.description}</p></div><button className="secondary-button" onClick={downloadCsv}><Download size={16} />Export CSV</button></div><div className="summary-grid">{summary.map((item) => <div className="summary-item" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div><div className="panel table-panel"><div className="table-toolbar"><label className="search-field"><Search size={17} /><span className="sr-only">Search {config.title}</span><input placeholder="Search records…" value={query} onChange={(event) => { setQuery(event.target.value); setPage(0) }} /></label><div className="table-filters"><SlidersHorizontal size={16} /><label className="sr-only" htmlFor={`${type}-department`}>Filter by department</label><select id={`${type}-department`} value={department} onChange={(event) => { setDepartment(event.target.value); setPage(0) }}>{departments.map((item) => <option key={item}>{item}</option>)}</select></div></div>{notice && <div className="inline-notice" role="status">{notice}</div>}{error ? <div className="error-state" role="alert"><strong>We couldn’t load this view</strong><span>{error}</span><button className="secondary-button" onClick={load}>Retry</button></div> : loading ? <div className="skeleton-table" role="status" aria-label="Loading records">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div> : <><div className="table-scroll"><table><thead><tr>{config.columns.map(([key, label]) => <th key={key}><button className="sort-button" onClick={() => setSort((current) => ({ key, direction: current.key === key ? -current.direction : 1 }))}>{label}{sort.key === key && (sort.direction === 1 ? <ArrowUp size={13} /> : <ArrowDown size={13} />)}</button></th>)}{type === 'leave' && <th>Action</th>}</tr></thead>{type === 'employees' ? <EmployeeTable rows={shown} onSelect={openEmployee} /> : type === 'attendance' ? <AttendanceTable rows={shown} /> : type === 'payroll' ? <PayrollTable rows={shown} /> : <tbody>{shown.map((row, index) => <tr key={row.id || row.date || row.department || index}>{config.columns.map(([key]) => <td key={key}>{display(row[key], key)}</td>)}{type === 'leave' && <td>{row.status === 'Pending' ? <div className="row-actions"><button className="text-action" onClick={() => actOnLeave(row.id, 'Approved')}>Approve</button><button className="text-action muted-action" onClick={() => actOnLeave(row.id, 'Declined')}>Decline</button></div> : '—'}</td>}</tr>)}</tbody>}</table>{shown.length === 0 && <div className="empty-state"><Search size={22} /><strong>No matching records</strong><span>Try adjusting your search or filters.</span></div>}</div><div className="table-pagination"><span>Showing {filtered.length ? page * pageSize + 1 : 0}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length} records</span><div><button className="pagination-button" disabled={!page} onClick={() => setPage((value) => value - 1)}>Previous</button><button className="pagination-button" disabled={(page + 1) * pageSize >= filtered.length} onClick={() => setPage((value) => value + 1)}>Next</button></div></div></>}</div>{selectedEmployee && <div className="dialog-backdrop" role="presentation" onClick={() => setSelectedEmployee(null)}><section className="employee-dialog" role="dialog" aria-modal="true" aria-labelledby="employee-dialog-title" onClick={(event) => event.stopPropagation()}><button className="dialog-close" onClick={() => setSelectedEmployee(null)} aria-label="Close employee details">×</button><span className="eyebrow">EMPLOYEE PROFILE</span><h3 id="employee-dialog-title">{selectedEmployee.name}</h3><p>{selectedEmployee.title} · {selectedEmployee.department}</p><div className="employee-detail-grid"><span>Employee ID<strong>{selectedEmployee.id}</strong></span><span>Status<strong>{selectedEmployee.status}</strong></span><span>Attendance<strong>{formatPercentage(selectedEmployee.attendanceRate)}</strong></span><span>Working hours<strong>{selectedEmployee.workingHours} hrs / week</strong></span><span>Overtime this month<strong>{selectedEmployee.overtimeHours} hrs</strong></span><span>Start date<strong>{selectedEmployee.startDate}</strong></span></div><h4>Recent attendance</h4><div className="attendance-history">{MOCK_DATA.attendance.slice(-5).map((day) => <div key={day.date}><span>{day.date.slice(5)}</span><strong>{day.present} present</strong><span>{day.late} late</span></div>)}</div></section></div>}</section>
}