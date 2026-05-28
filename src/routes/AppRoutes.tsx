import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ProtectedRoute } from './ProtectedRoute'

const LoginPage = lazy(() => import('@/pages/auth/Login').then((m) => ({ default: m.LoginPage })))
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPassword').then((m) => ({ default: m.ForgotPasswordPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/dashboard/Dashboard').then((m) => ({ default: m.DashboardPage })),
)
const ProjectsPage = lazy(() =>
  import('@/pages/projects/Projects').then((m) => ({ default: m.ProjectsPage })),
)
const ProjectDetailsPage = lazy(() =>
  import('@/pages/projects/ProjectDetails').then((m) => ({ default: m.ProjectDetailsPage })),
)
const TasksPage = lazy(() =>
  import('@/pages/tasks/Tasks').then((m) => ({ default: m.TasksPage })),
)
const TeamsPage = lazy(() =>
  import('@/pages/teams/Teams').then((m) => ({ default: m.TeamsPage })),
)
const UsersPage = lazy(() =>
  import('@/pages/users/Users').then((m) => ({ default: m.UsersPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/settings/Settings').then((m) => ({ default: m.SettingsPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound').then((m) => ({ default: m.NotFoundPage })),
)

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
