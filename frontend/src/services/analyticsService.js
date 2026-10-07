import { api, API_CONTRACT } from './api.js'
import { getAttendance, getDepartments, getLeave, getOvertime } from './attendanceService.js'
import { getEmployees } from './employeeService.js'
import { getPayroll } from './payrollService.js'

export const getAlerts = async () => (await api.get(API_CONTRACT.alerts.list)).data
export const getAnalytics = async (kind = 'attendance') => (await api.get(API_CONTRACT.analytics[kind])).data
export const getReports = async () => (await api.get(API_CONTRACT.reports.list)).data
export const createReport = async (filters) => (await api.post(API_CONTRACT.reports.export, filters)).data

export async function getWorkspaceData(kind) {
	const requests = {
		employees: getEmployees,
		attendance: getAttendance,
		overtime: getOvertime,
		leave: getLeave,
		payroll: getPayroll,
		departments: getDepartments,
		alerts: getAlerts,
	}
	const result = await requests[kind]()
	return result.items || result
}

export async function getReportPreview(filters) {
	const [departments, payroll, overtime] = await Promise.all([getDepartments(), getPayroll(), getOvertime()])
	const rows = departments.items.map((department) => ({
		department: department.name,
		headcount: department.headcount,
		attendance: department.attendanceRate,
		overtimeHours: overtime.items.find((item) => item.department === department.name)?.hours || 0,
		grossPayroll: payroll.items.find((item) => item.department === department.name)?.gross || 0,
		period: `${filters.startDate} to ${filters.endDate}`,
	}))
	return rows.filter((row) => filters.department === 'All departments' || row.department === filters.department)
}

export async function getAnalyticsView(kind) {
	if (kind === 'attendance') return (await getAnalytics(kind)).attendance
	if (kind === 'payroll') return (await getAnalytics(kind)).payroll
	if (kind === 'overtime') return (await getOvertime()).items
	return (await getDepartments()).items
}

export async function getDashboardData() {
	const [attendance, overtime, payroll, departments, alerts] = await Promise.all([
		getAnalytics('attendance'), getOvertime(), getAnalytics('payroll'), getDepartments(), getAlerts(),
	])
	return {
		charts: { attendance: attendance.attendance, overtime: overtime.items, payroll: payroll.payroll, departments: departments.items },
		alerts: alerts.items || alerts,
	}
}