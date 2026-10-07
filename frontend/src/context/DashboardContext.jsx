import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import useWebSocket from '../hooks/useWebSocket.js'
import { MOCK_DATA } from '../services/api.js'
import { getDashboardData } from '../services/analyticsService.js'

const DashboardContext = createContext(null)
const initialMetrics = { totalEmployees: 264, attendanceRate: 95.6, absenteeismRate: 4.4, overtimeHours: 1308, expectedPayroll: 70200000, activeEmployees: 260, employeesOnLeave: 7, averageWorkingHours: 39.3, averageOvertime: 5.1, labourCost: 76400000 }
const initialCharts = { attendance: MOCK_DATA.trends.attendance, overtime: MOCK_DATA.overtime, payroll: MOCK_DATA.trends.payroll, departments: MOCK_DATA.departments }

export function DashboardProvider({ children }) {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [alerts, setAlerts] = useState(MOCK_DATA.alerts)
  const [charts, setCharts] = useState(initialCharts)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  useEffect(() => {
    let active = true
    getDashboardData().then((data) => {
      if (active) { setCharts(data.charts); setAlerts(data.alerts) }
    }).catch(() => {
      if (active) setError('Dashboard data could not be loaded. Check the API connection and retry.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reloadKey])
  const retry = () => { setLoading(true); setError(''); setReloadKey((current) => current + 1) }
  const handleMessage = useCallback((message) => {
    const payload = message?.payload || message
    if (payload.metrics) setMetrics((current) => ({ ...current, ...payload.metrics }))
    if (payload.charts) setCharts((current) => ({ ...current, ...payload.charts }))
    if (payload.alert) setAlerts((current) => [payload.alert, ...current])
    setLastUpdated(new Date())
  }, [])
  const connection = useWebSocket(handleMessage)
  const value = useMemo(() => ({ metrics, alerts, charts, connection, lastUpdated, loading, error, retry }), [metrics, alerts, charts, connection, lastUpdated, loading, error])
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

DashboardProvider.propTypes = { children: PropTypes.node.isRequired }
// Context hooks intentionally live alongside their provider for this small app.
// eslint-disable-next-line react-refresh/only-export-components
export const useDashboard = () => useContext(DashboardContext)