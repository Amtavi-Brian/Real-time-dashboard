import { api, API_CONTRACT } from './api.js'
export const getAttendance = async () => (await api.get(API_CONTRACT.attendance.list)).data
export const getOvertime = async () => (await api.get(API_CONTRACT.overtime.list)).data
export const getLeave = async () => (await api.get(API_CONTRACT.leave.list)).data
export const getDepartments = async () => (await api.get(API_CONTRACT.departments.list)).data
export const updateLeaveStatus = async (id, status) => (await api.patch(`${API_CONTRACT.leave.list}/${id}`, { status })).data