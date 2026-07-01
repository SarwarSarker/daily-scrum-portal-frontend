/**
 * API-related types for backend requests and responses
 */

// Generic API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

// Auth Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginData {
  token: string
}

export type LoginResponse = ApiResponse<LoginData>

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  role?: string
}

// Projects Types
export interface ProjectData {
  id: string
  name: string
  ownerId: string
  teamId: string
  category?: 'tech' | 'marketing' | 'business'
  status: 'planning' | 'in_progress' | 'continue_development' | 'on_hold' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  currentProgress?: number
  targetProgress?: number
  riskLevel?: 'low' | 'medium' | 'high' | 'critical'
  dueDate?: string
  description: string
  blocker?: string
  createdAt?: string
  updatedAt?: string
  // Nested objects from API
  owner?: {
    id: string
    name: string
    avatar: string | null
  }
  team?: {
    id: string
    name: string
    leadId?: string
  } | null
  createdBy?: {
    id: string
    name: string
    avatar: string | null
  }
  members?: Array<{
    id: string
    name: string
    avatar: string | null
  }>
  memberCount?: number
  progress?: number
  taskStats?: {
    total: number
    completed: number
    remaining: number
  }
  start_date?: string
  end_date?: string
  created_at?: string
  updated_at?: string
}

export type ProjectsResponse = ApiResponse<ProjectData[]>

export interface CreateProjectData {
  name: string
  owner_id: number
  team_id: number
  created_by: number
  status: 'planning' | 'in_progress' | 'continue_development' | 'on_hold' | 'completed'
  description: string
  blocker?: string
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string
}

// Users Types
export interface UserData {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'team_lead' | 'member'
  designation: string
  avatar?: string
  teamId?: string
  departmentId?: string
  status: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}

export type UsersResponse = ApiResponse<UserData[]>

export interface CreateUserData {
  name: string
  email: string
  password: string
  role: 'admin' | 'manager' | 'team_lead' | 'member'
  designation: string
  teamId?: string
  departmentId?: string
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string
  password?: string // Optional for updates
}

// Tasks Types
export interface TaskData {
  id: string
  projectId: string
  assignedTo: string
  createdBy: string
  title: string
  description: string
  taskType: 'feature' | 'bug' | 'chore' | 'research' | 'meeting'
  status: 'pending' | 'on_hold' | 'in_progress' | 'in_review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  progress: number
  dependencyTaskId?: string
  blocker?: string
  expectedOutput?: string
  startDate: string
  dueDate: string
  createdAt?: string
  updatedAt?: string
}

export type TasksResponse = ApiResponse<TaskData[]>

export interface CreateTaskData {
  projectId: string
  assignedTo: string
  title: string
  description: string
  taskType: 'feature' | 'bug' | 'chore' | 'research' | 'meeting'
  status: 'pending' | 'on_hold' | 'in_progress' | 'in_review' | 'completed'
  priority: 'low' | 'medium' | 'high'
  progress: number
  dependencyTaskId?: string
  blocker?: string
  expectedOutput?: string
  startDate: string
  dueDate: string
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: string
}

// Teams Types
export interface TeamData {
  id: string
  departmentId: string
  name: string
  leadId?: string
  createdAt?: string
  updatedAt?: string
}

export type TeamsResponse = ApiResponse<TeamData[]>

export interface CreateTeamData {
  departmentId: string
  name: string
  leadId?: string
}

export interface UpdateTeamData extends Partial<CreateTeamData> {
  id: string
}

// Departments Types
export interface DepartmentData {
  id: string
  name: string
  slug: string
  createdAt?: string
  updatedAt?: string
}

export type DepartmentsResponse = ApiResponse<DepartmentData[]>

export interface CreateDepartmentData {
  name: string
  slug: string
}

export interface UpdateDepartmentData extends Partial<CreateDepartmentData> {
  id: string
}
