import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AUTH_TOKEN_KEY } from '@/constants'

export function PublicRoute() {
  const location = useLocation()

  // Check if user is already authenticated by verifying token exists
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  const isAuthenticated = !!token

  if (isAuthenticated) {
    // Already logged in — send to the page they came from, or the dashboard
    const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/dashboard'
    return <Navigate to={from} replace />
  }

  return <Outlet />
}
