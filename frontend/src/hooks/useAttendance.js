import { useCallback, useEffect, useState } from 'react'
import { getAttendance } from '../services/attendanceService.js'

export default function useAttendance() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { const result = await getAttendance(); setAttendance(result.items || result) }
    catch { setError('Attendance data could not be loaded.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => {
    let active = true
    getAttendance().then((result) => { if (active) setAttendance(result.items || result) })
      .catch(() => { if (active) setError('Attendance data could not be loaded.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  return { attendance, loading, error, retry: load }
}