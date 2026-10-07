import { api, API_CONTRACT } from './api.js'
export const getPayroll = async () => (await api.get(API_CONTRACT.payroll.list)).data