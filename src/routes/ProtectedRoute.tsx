import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/redux/hooks'

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const location = useLocation()

  // Phase 1: auth is stubbed. Until real login is wired, allow access in dev so
  // designers can preview pages. Flip this guard on once login mutation lands.
  const DEV_BYPASS = import.meta.env.DEV

  if (!isAuthenticated && !DEV_BYPASS) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
