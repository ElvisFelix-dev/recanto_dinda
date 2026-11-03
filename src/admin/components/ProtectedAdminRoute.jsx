import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import LoadingState from './LoadingState'

export default function ProtectedAdminRoute({ roles }) {
  const { isAuthenticated, authReady, admin } = useAdminAuth()
  const location = useLocation()

  if (!authReady) return <LoadingState label="Validando sessão administrativa..." />
  if (!isAuthenticated) return <Navigate to="/admin/login" replace state={{ from: location }} />
  if (roles?.length && !roles.includes(admin?.role)) return <Navigate to="/admin" replace />

  return <Outlet />
}
