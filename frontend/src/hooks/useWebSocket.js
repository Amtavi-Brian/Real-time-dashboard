import { useEffect, useRef, useState } from 'react'
import { API_CONTRACT, MOCK_DATA, USE_MOCK } from '../services/api.js'

const getSocketUrl = () => {
  if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  return `${apiUrl.replace(/^http/, 'ws')}${API_CONTRACT.websocket}`
}

export default function useWebSocket(onMessage) {
  const [status, setStatus] = useState(USE_MOCK ? 'live' : 'connecting')
  const messageRef = useRef(onMessage)
  const mockTick = useRef(0)
  useEffect(() => { messageRef.current = onMessage }, [onMessage])
  useEffect(() => {
    if (USE_MOCK) {
      const timer = window.setInterval(() => {
        mockTick.current += 1
        const tick = mockTick.current
        const attendance = [...MOCK_DATA.trends.attendance]
        attendance[attendance.length - 1] = { ...attendance.at(-1), rate: Number((95.4 + Math.sin(tick) * 0.5).toFixed(1)) }
        const overtime = MOCK_DATA.overtime.map((item, index) => ({ ...item, hours: item.hours + (index === tick % item.length ? tick : 0) }))
        const payload = {
          metrics: {
            attendanceRate: Number((95.6 + Math.sin(tick) * 0.3).toFixed(1)),
            overtimeHours: 1308 + tick * 2,
            averageOvertime: Number((5.1 + Math.sin(tick / 2) * 0.15).toFixed(1)),
            labourCost: 76400000 + tick * 1800,
          },
          charts: { attendance, overtime },
          updatedAt: new Date().toISOString(),
        }
        if (tick % 5 === 0) payload.alert = { id: `AL-LIVE-${Date.now()}`, type: 'High Overtime', severity: 'Medium', title: 'Overtime activity updated', message: 'A new live overtime reading is available for review.', time: 'Just now', department: 'Operations', unread: true }
        messageRef.current({ type: 'dashboard.update', payload })
      }, 12000)
      return () => window.clearInterval(timer)
    }
    let socket
    let reconnectTimer
    let retry = 0
    let disposed = false
    const connect = () => {
      if (disposed) return
      socket = new WebSocket(getSocketUrl())
      socket.onopen = () => { retry = 0; setStatus('live') }
      socket.onmessage = (event) => {
        try { messageRef.current(JSON.parse(event.data)) } catch { /* Ignore malformed frames. */ }
      }
      socket.onerror = () => socket.close()
      socket.onclose = () => {
        if (disposed) return
        setStatus('reconnecting')
        reconnectTimer = window.setTimeout(connect, Math.min(1000 * (2 ** retry++), 30000))
      }
    }
    connect()
    return () => { disposed = true; window.clearTimeout(reconnectTimer); socket?.close(); setStatus('offline') }
  }, [])
  return status
}