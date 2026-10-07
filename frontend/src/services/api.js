import axios from 'axios'

export const API_CONTRACT = {
  auth: { login: '/auth/login' },
  employees: { list: '/employees', detail: (id) => `/employees/${id}` },
  attendance: { list: '/attendance' },
  overtime: { list: '/overtime' },
  leave: { list: '/leave' },
  payroll: { list: '/payroll' },
  departments: { list: '/departments' },
  analytics: { attendance: '/analytics/attendance', overtime: '/analytics/overtime', payroll: '/analytics/payroll', workforce: '/analytics/workforce' },
  reports: { list: '/reports', export: '/reports/export' },
  alerts: { list: '/alerts' },
  websocket: '/ws/dashboard',
}

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const departments = [
  { id: 'D01', name: 'Operations', headcount: 86, attendanceRate: 96.8, absenteeismRate: 3.2, overtimeHours: 428, workingHours: 39.4, wageCost: 18640000, productivity: 92 },
  { id: 'D02', name: 'Sales & Marketing', headcount: 64, attendanceRate: 94.6, absenteeismRate: 5.4, overtimeHours: 296, workingHours: 38.7, wageCost: 14820000, productivity: 88 },
  { id: 'D03', name: 'Finance', headcount: 38, attendanceRate: 97.4, absenteeismRate: 2.6, overtimeHours: 118, workingHours: 39.1, wageCost: 11960000, productivity: 95 },
  { id: 'D04', name: 'Human Resources', headcount: 24, attendanceRate: 98.1, absenteeismRate: 1.9, overtimeHours: 84, workingHours: 38.9, wageCost: 7680000, productivity: 96 },
  { id: 'D05', name: 'Technology', headcount: 52, attendanceRate: 95.8, absenteeismRate: 4.2, overtimeHours: 382, workingHours: 40.2, wageCost: 17440000, productivity: 93 },
]

const people = [
  ['Amara Osei', 'EMP-1042', 'Operations', 'Shift Supervisor', 'Active', '2022-03-14', 78500],
  ['Kwame Mensah', 'EMP-1038', 'Technology', 'Systems Analyst', 'Active', '2021-11-08', 92000],
  ['Nana Boateng', 'EMP-1026', 'Finance', 'Payroll Officer', 'Active', '2023-01-16', 68500],
  ['Akosua Owusu', 'EMP-1019', 'Human Resources', 'HR Partner', 'On leave', '2020-06-22', 81000],
  ['Kofi Addo', 'EMP-1014', 'Sales & Marketing', 'Account Executive', 'Active', '2022-09-05', 74500],
  ['Esi Mensima', 'EMP-1008', 'Operations', 'Quality Lead', 'Active', '2019-02-11', 83500],
  ['Yaw Asante', 'EMP-1003', 'Technology', 'Product Designer', 'Active', '2024-02-19', 88000],
  ['Abena Kusi', 'EMP-0997', 'Finance', 'Financial Analyst', 'Active', '2021-04-12', 72000],
  ['Kojo Arthur', 'EMP-0986', 'Operations', 'Logistics Coordinator', 'On leave', '2020-10-01', 61200],
  ['Efua Darko', 'EMP-0974', 'Sales & Marketing', 'Brand Manager', 'Active', '2018-08-27', 96500],
  ['Nii Lante', 'EMP-0962', 'Human Resources', 'People Operations', 'Active', '2022-01-10', 70200],
  ['Adwoa Sarpong', 'EMP-0951', 'Technology', 'Software Engineer', 'Active', '2023-07-03', 101000],
]

export const MOCK_DATA = {
  employees: people.map(([name, id, department, title, status, startDate, salary], index) => ({
    id, name, department, title, status, startDate, salary,
    email: `${name.toLowerCase().replaceAll(' ', '.')}@columbus.co.gh`,
    attendanceRate: [98.2, 94.6, 96.1, 97.9, 91.8, 98.7, 95.3, 96.8, 92.4, 97.1, 99.1, 95.8][index],
    workingHours: [40, 42, 38, 39, 37, 41, 44, 39, 36, 40, 38, 43][index],
    overtimeHours: [12, 21, 4, 6, 18, 14, 27, 5, 3, 16, 2, 24][index],
  })),
  departments,
  attendance: [
    { date: '2026-10-01', present: 247, absent: 11, late: 9, workingHours: 1956 },
    { date: '2026-10-02', present: 251, absent: 7, late: 12, workingHours: 1988 },
    { date: '2026-10-03', present: 239, absent: 19, late: 8, workingHours: 1891 },
    { date: '2026-10-04', present: 244, absent: 14, late: 11, workingHours: 1926 },
    { date: '2026-10-05', present: 252, absent: 6, late: 7, workingHours: 2004 },
    { date: '2026-10-06', present: 249, absent: 9, late: 10, workingHours: 1972 },
    { date: '2026-10-07', present: 246, absent: 12, late: 8, workingHours: 1948 },
  ],
  overtime: departments.map((department, index) => ({ department: department.name, hours: department.overtimeHours, cost: [928400, 672800, 331600, 198500, 1049200][index] })),
  payroll: departments.map((department, index) => ({
    department: department.name, basicWages: Math.round(department.wageCost * 0.82),
    overtimePay: Math.round(department.wageCost * 0.07), gross: department.wageCost,
    processed: department.wageCost - [0, 16400, 0, -8200, 25600][index],
    variance: [0, 16400, 0, -8200, 25600][index],
  })),
  leave: [
    { id: 'LV-208', employee: 'Akosua Owusu', department: 'Human Resources', type: 'Annual leave', startDate: '2026-10-06', endDate: '2026-10-10', days: 5, status: 'Approved' },
    { id: 'LV-207', employee: 'Kojo Arthur', department: 'Operations', type: 'Medical', startDate: '2026-10-07', endDate: '2026-10-08', days: 2, status: 'Approved' },
    { id: 'LV-206', employee: 'Kofi Addo', department: 'Sales & Marketing', type: 'Annual leave', startDate: '2026-10-13', endDate: '2026-10-17', days: 5, status: 'Pending' },
    { id: 'LV-205', employee: 'Nana Boateng', department: 'Finance', type: 'Personal', startDate: '2026-10-20', endDate: '2026-10-20', days: 1, status: 'Pending' },
  ],
  alerts: [
    { id: 'AL-981', type: 'High Overtime', severity: 'High', title: 'Technology overtime is above threshold', message: 'Overtime reached 382 hours this month, 18% above the department threshold.', time: '8 min ago', department: 'Technology', unread: true },
    { id: 'AL-980', type: 'Payroll Variance', severity: 'Medium', title: 'Payroll variance requires review', message: 'Two departments have a combined payroll variance of GHS 42,000.', time: '24 min ago', department: 'Finance', unread: true },
    { id: 'AL-979', type: 'Low Attendance', severity: 'Low', title: 'Attendance dipped in Sales & Marketing', message: 'Daily attendance is 91.8%, below the 94% monitoring threshold.', time: '1 hr ago', department: 'Sales & Marketing', unread: false },
    { id: 'AL-978', type: 'Leave Alert', severity: 'Low', title: 'Leave overlap in Operations', message: 'Three team members are scheduled for leave in the same week.', time: '2 hrs ago', department: 'Operations', unread: false },
    { id: 'AL-977', type: 'High Absenteeism', severity: 'High', title: 'Absenteeism rising across the business', message: 'The seven-day absenteeism rate increased to 4.1%.', time: '3 hrs ago', department: 'All departments', unread: false },
  ],
  trends: {
    attendance: [
      { day: 'Mon', rate: 94.8, last: 93.2 }, { day: 'Tue', rate: 96.2, last: 94.6 }, { day: 'Wed', rate: 92.6, last: 94.1 },
      { day: 'Thu', rate: 95.3, last: 95.0 }, { day: 'Fri', rate: 97.1, last: 95.8 }, { day: 'Sat', rate: 93.6, last: 91.7 }, { day: 'Sun', rate: 95.4, last: 92.9 },
    ],
    payroll: [
      { month: 'May', basic: 57, overtime: 8, benefits: 13 }, { month: 'Jun', basic: 59, overtime: 9, benefits: 13 },
      { month: 'Jul', basic: 58, overtime: 10, benefits: 14 }, { month: 'Aug', basic: 62, overtime: 9, benefits: 14 },
      { month: 'Sep', basic: 61, overtime: 11, benefits: 15 }, { month: 'Oct', basic: 64, overtime: 10, benefits: 15 },
    ],
  },
}

export const http = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000', timeout: 12000, headers: { 'Content-Type': 'application/json' } })

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('columbus_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('columbus_token')
    localStorage.removeItem('columbus_user')
    window.dispatchEvent(new Event('columbus:unauthorized'))
  }
  return Promise.reject(error)
})

const mockResponse = (data) => Promise.resolve({ data })
const mockAccounts = {
  'jordan.mensah@columbus.co.gh': { name: 'Jordan Mensah', role: 'ADMIN' },
  'ama.osei@columbus.co.gh': { name: 'Amara Osei', role: 'HR_MANAGER' },
  'kwame.mensah@columbus.co.gh': { name: 'Kwame Mensah', role: 'MANAGER', department: 'Technology' },
}

const mockGet = (path) => {
  if (path === API_CONTRACT.employees.list) return mockResponse({ items: MOCK_DATA.employees, total: MOCK_DATA.employees.length })
  if (path.startsWith('/employees/')) return mockResponse(MOCK_DATA.employees.find((employee) => employee.id === path.split('/').at(-1)))
  if (path === API_CONTRACT.attendance.list) return mockResponse({ items: MOCK_DATA.attendance, total: MOCK_DATA.attendance.length })
  if (path === API_CONTRACT.overtime.list) return mockResponse({ items: MOCK_DATA.overtime, total: MOCK_DATA.overtime.length })
  if (path === API_CONTRACT.leave.list) return mockResponse({ items: MOCK_DATA.leave, total: MOCK_DATA.leave.length })
  if (path === API_CONTRACT.payroll.list) return mockResponse({ items: MOCK_DATA.payroll, total: MOCK_DATA.payroll.length })
  if (path === API_CONTRACT.departments.list) return mockResponse({ items: MOCK_DATA.departments, total: MOCK_DATA.departments.length })
  if (path === API_CONTRACT.alerts.list) return mockResponse({ items: MOCK_DATA.alerts, total: MOCK_DATA.alerts.length })
  if (path.startsWith('/analytics/')) return mockResponse({ ...MOCK_DATA.trends, departments: MOCK_DATA.departments })
  return mockResponse({ items: [] })
}

export const api = {
  get: (path, config) => USE_MOCK ? mockGet(path) : http.get(path, config),
  post: (path, data, config) => {
    if (USE_MOCK && path === API_CONTRACT.auth.login) {
      const email = data.email?.trim().toLowerCase()
      const account = mockAccounts[email]
      if (!account || data.password !== 'columbus-demo') return Promise.reject(new Error('Invalid demo credentials'))
      return mockResponse({ access_token: `demo-${Date.now()}`, user: { ...account, email } })
    }
    if (USE_MOCK) return mockResponse({ success: true, filters: data })
    return http.post(path, data, config)
  },
  patch: (path, data, config) => USE_MOCK ? mockResponse({ ...data, status: 'Approved' }) : http.patch(path, data, config),
}