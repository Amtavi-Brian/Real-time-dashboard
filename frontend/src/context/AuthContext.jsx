import { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { api, API_CONTRACT } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('columbus_user')) } catch { return null }
  })
  useEffect(() => {
    const clearSession = () => setUser(null)
    window.addEventListener('columbus:unauthorized', clearSession)
    return () => window.removeEventListener('columbus:unauthorized', clearSession)
  }, [])
  const login = async (credentials) => {
    const { data } = await api.post(API_CONTRACT.auth.login, credentials)
    localStorage.setItem('columbus_token', data.access_token)
    localStorage.setItem('columbus_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }
  const logout = () => {
    localStorage.removeItem('columbus_token')
    localStorage.removeItem('columbus_user')
    setUser(null)
  }
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired }
// Context hooks intentionally live alongside their provider for this small app.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)