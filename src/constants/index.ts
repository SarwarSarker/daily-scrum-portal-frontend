export const APP_NAME = 'Scrumly'
export const APP_TAGLINE = 'Daily Scrum Dashboard'
export const APP_VERSION = '1.0.0'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api'

export const STORAGE_KEYS = {
  authToken: 'scrumly:auth-token',
  authUser: 'scrumly:auth-user',
  theme: 'scrumly:theme',
  sidebarCollapsed: 'scrumly:sidebar-collapsed',
} as const

export const QUERY_KEYS = {
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
  teams: ['teams'] as const,
  users: ['users'] as const,
  me: ['me'] as const,
} as const
