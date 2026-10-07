import { api, API_CONTRACT } from './api.js'
export const getEmployees = async () => (await api.get(API_CONTRACT.employees.list)).data
export const getEmployee = async (id) => (await api.get(API_CONTRACT.employees.detail(id))).data