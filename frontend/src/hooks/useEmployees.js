import { useCallback, useEffect, useState } from 'react'
import { getEmployees } from '../services/employeeService.js'

export default function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { const result = await getEmployees(); setEmployees(result.items || result) }
    catch { setError('Employee records could not be loaded.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => {
    let active = true
    getEmployees().then((result) => { if (active) setEmployees(result.items || result) })
      .catch(() => { if (active) setError('Employee records could not be loaded.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])
  return { employees, loading, error, retry: load }
}