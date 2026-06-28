import { Navigate, Outlet, useLocation } from 'react-router-dom'

export function ProtectedRoute() {
  const location = useLocation()

  // Check if user is authenticated by verifying token exists
  const token = localStorage.getItem('scrumly:auth-token')
  const isAuthenticated = !!token

  if (!isAuthenticated) {
    // Redirect to login page with return location
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
