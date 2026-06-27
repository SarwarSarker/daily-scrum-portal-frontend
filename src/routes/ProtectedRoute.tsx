import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { authApi } from '@/utils/apiHelper'

export function ProtectedRoute() {
  const location = useLocation()

  // Check if user is authenticated by verifying token exists
  const isAuthenticated = authApi.isAuthenticated()

  if (!isAuthenticated) {
    // Redirect to login page with return location
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
