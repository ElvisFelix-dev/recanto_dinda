import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { adminApi } from '../../services/api'

const AdminAuthContext = createContext(null)

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('adminUser') || 'null')
  } catch {
    return null
  }
}

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'))
  const [admin, setAdmin] = useState(readStoredUser)
  const [authReady, setAuthReady] = useState(() => !localStorage.getItem('adminToken'))

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null)
      setAdmin(null)
      setAuthReady(true)
    }
    window.addEventListener('admin:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('admin:unauthorized', handleUnauthorized)
  }, [])

  useEffect(() => {
    let active = true
    const currentToken = localStorage.getItem('adminToken')
    if (!currentToken) {
      setAuthReady(true)
      return () => { active = false }
    }

    adminApi.getMe()
      .then((response) => {
        if (!active) return
        const currentAdmin = response.data
        setAdmin(currentAdmin)
        localStorage.setItem('adminUser', JSON.stringify(currentAdmin))
        setToken(currentToken)
      })
      .catch(() => {
        if (!active) return
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        setToken(null)
        setAdmin(null)
      })
      .finally(() => {
        if (active) setAuthReady(true)
      })

    return () => { active = false }
  }, [])

  async function login(credentials) {
    const response = await adminApi.login(credentials)
    const { token: newToken, admin: adminData } = response.data || {}
    if (!newToken || !adminData) throw new Error('Resposta de autenticação inválida.')

    localStorage.setItem('adminToken', newToken)
    localStorage.setItem('adminUser', JSON.stringify(adminData))
    setToken(newToken)
    setAdmin(adminData)
    setAuthReady(true)
    return adminData
  }

  function logout() {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setToken(null)
    setAdmin(null)
    setAuthReady(true)
  }

  const value = useMemo(() => ({
    token,
    admin,
    authReady,
    isAuthenticated: Boolean(token && admin),
    login,
    logout,
  }), [token, admin, authReady])

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) throw new Error('useAdminAuth deve ser usado dentro de AdminAuthProvider.')
  return context
}
