export type UserRole = 'admin' | 'manager' | 'team_lead' | 'member'
export type UserStatus = 'active' | 'inactive'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  designation: string
  avatar?: string
  teamId?: string
  departmentId?: string
  status: UserStatus
}

export interface Department {
  id: string
  name: string
  slug: string
}

export interface Team {
  id: string
  departmentId: string
  name: string
  leadId?: string
}

export type ProjectStatus =
  | 'planning'
  | 'in_progress'
  | 'continue_development'
  | 'on_hold'
  | 'completed'
export type Priority = 'low' | 'medium' | 'high'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface ProjectOwner {
  id: string
  name: string
  avatar?: string | null
}

export interface ProjectTeam {
  id: string
  name: string
  leadId?: string
}

export interface Project {
  id: string
  name: string
  ownerId: string
  teamId: string
  category?: 'tech' | 'marketing' | 'business'
  status: ProjectStatus
  priority?: Priority
  currentProgress?: number
  targetProgress?: number
  riskLevel?: 'low' | 'medium' | 'high' | 'critical'
  dueDate?: string
  description: string
  blocker?: string
  createdAt?: string
  updatedAt?: string
  owner?: ProjectOwner
  team?: ProjectTeam
  createdBy?: ProjectOwner
  members?: ProjectOwner[]
  memberCount?: number
}

export type TaskStatus = 'pending' | 'on_hold' | 'in_progress' | 'in_review' | 'completed'
export type TaskType = 'feature' | 'bug' | 'chore' | 'research' | 'meeting'

export interface Task {
  id: string
  projectId: string
  assignedTo: string
  createdBy: string
  title: string
  description: string
  taskType: TaskType
  status: TaskStatus
  priority: Priority
  progress: number
  dependencyTaskId?: string
  blocker?: string
  expectedOutput?: string
  start_date: string
  end_date: string
}

export interface ProjectUpdate {
  id: string
  projectId: string
  updatedBy: string
  previousProgress: number
  currentProgress: number
  weeklyMovement: number
  status: ProjectStatus
  todayUpdate: string
  blockers?: string
  timelineNote?: string
  remarks?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
