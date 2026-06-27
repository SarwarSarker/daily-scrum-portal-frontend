import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import {
  SIGNIN_USER,
  GET_PROJECTS,
  GET_USERS,
  GET_PROFILE,
  GET_TASKS,
  GET_TEAMS,
  GET_DEPARTMENTS,
  STORAGE_KEYS,
} from '@/constants'
import type {
  LoginCredentials,
  LoginResponse,
  ApiResponse,
  ProjectsResponse,
  CreateProjectData,
  UpdateProjectData,
  ProjectData,
  UsersResponse,
  UserData,
  CreateUserData,
  UpdateUserData,
  TasksResponse,
  TaskData,
  CreateTaskData,
  UpdateTaskData,
  TeamsResponse,
  TeamData,
  CreateTeamData,
  UpdateTeamData,
  DepartmentsResponse,
  DepartmentData,
  CreateDepartmentData,
  UpdateDepartmentData,
} from '@/types/api'

// Auth API Functions
export const authApi = {
  /**
   * Login API call - authenticates user and returns token
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(SIGNIN_USER, credentials)

    // Store token from response.data.data.token
    if (response.data.data.token) {
      localStorage.setItem(STORAGE_KEYS.authToken, response.data.data.token)
    } else {
      // If no token found, logout user
      this.logout()
    }

    return response.data
  },

  /**
   * Logout user and clear stored credentials
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.authToken)
    localStorage.removeItem(STORAGE_KEYS.authUser)
  },

  /**
   * Check if user is authenticated by verifying token exists
   * @returns boolean indicating if user has valid token
   */
  isAuthenticated(): boolean {
    const token = this.getStoredToken()
    if (!token) {
      // Logout user if token not found
      this.logout()
      return false
    }
    return true
  },

  /**
   * Get stored auth token
   * @returns Token string or null
   */
  getStoredToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.authToken)
  },

  /**
   * Get stored user data from localStorage (currently returns null as API doesn't provide user data)
   * @returns User object or null
   */
  getStoredUser(): Record<string, unknown> | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.authUser)
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  },
}

// React Query Hooks for Auth
export function useLoginMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      // Invalidate and refetch queries that might depend on auth state
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

// Projects API Functions
export const projectsApi = {
  /**
   * Get all projects
   */
  async getProjects(): Promise<ProjectData[]> {
    const response = await api.get(GET_PROJECTS)

    // Extract projects array from different response formats
    let apiProjects: unknown[]

    // Format 1: { success: true, data: [...] }
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      apiProjects = (response.data as ProjectsResponse).data
    }
    // Format 2: Direct array
    else if (Array.isArray(response.data)) {
      apiProjects = response.data
    } else {
      console.warn('Unexpected API response format:', response.data)
      return []
    }

    // Transform API response to match frontend types
    return apiProjects.map((apiProject: Record<string, unknown>) => {
      // Safely extract status
      const status = apiProject.status ?? 'planning'
      const validStatus: ProjectData['status'] =
        ['planning', 'in_progress', 'continue_development', 'on_hold', 'completed', 'cancelled'].includes(status as string)
          ? (status as ProjectData['status'])
          : 'planning'

      // Type the nested objects properly
      const owner = apiProject.owner as Record<string, unknown> | undefined
      const team = apiProject.team as Record<string, unknown> | null
      const createdBy = apiProject.createdBy as Record<string, unknown> | undefined

      return {
        id: String(apiProject.id || ''),
        projectName: String(apiProject.name || ''),
        ownerId: String(apiProject.owner_id || ''),
        teamId: String(apiProject.team_id || ''),
        status: validStatus,
        description: String(apiProject.description || ''),
        blocker: apiProject.blocker ? String(apiProject.blocker) : undefined,
        createdAt: apiProject.created_at ? String(apiProject.created_at) : undefined,
        updatedAt: apiProject.updated_at ? String(apiProject.updated_at) : undefined,
        // Include nested objects if they exist
        ...(owner && {
          owner: {
            id: String(owner.id || ''),
            name: String(owner.name || ''),
            avatar: owner.avatar ? String(owner.avatar) : null,
          }
        }),
        ...(team && team !== null && {
          team: {
            id: String(team.id || ''),
            name: String(team.name || ''),
            ...(team.leadId && { leadId: String(team.leadId) })
          }
        }),
        ...(createdBy && {
          createdBy: {
            id: String(createdBy.id || ''),
            name: String(createdBy.name || ''),
            avatar: createdBy.avatar ? String(createdBy.avatar) : null,
          }
        }),
      }
    })
  },

  /**
   * Get project by ID
   */
  async getProjectById(id: string): Promise<ProjectData> {
    const response = await api.get(`${GET_PROJECTS}/${id}`)

    // Handle different response formats
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<ProjectData>).data
    }

    // If response is directly the project object
    return response.data as ProjectData
  },

  /**
   * Create new project
   */
  async createProject(project: CreateProjectData): Promise<ProjectData> {
    const response = await api.post(GET_PROJECTS, project)

    // Handle different response formats
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<ProjectData>).data
    }

    // If response is directly the project object
    return response.data as ProjectData
  },

  /**
   * Update project
   */
  async updateProject(id: string, project: UpdateProjectData): Promise<ProjectData> {
    const response = await api.put(`${GET_PROJECTS}/${id}`, project)

    // Handle different response formats
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<ProjectData>).data
    }

    // If response is directly the project object
    return response.data as ProjectData
  },

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<void> {
    await api.delete(`${GET_PROJECTS}/${id}`)
  },
}

// React Query Hooks for Projects
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        console.log('🚀 Fetching projects from:', GET_PROJECTS)
        const projects = await projectsApi.getProjects()
        console.log('✅ Projects API response:', projects)

        // Log the first project to check data structure
        if (projects.length > 0) {
          console.log('📋 Sample project data:', projects[0])
        }

        return projects
      } catch (error) {
        console.error('❌ Failed to fetch projects:', error)
        // Don't throw error to prevent redirect, return empty array instead
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Disable retry to prevent multiple failed calls
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getProjectById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, project }: { id: string; project: UpdateProjectData }) =>
      projectsApi.updateProject(id, project),
    onSuccess: (_, variables) => {
      // Invalidate both projects list and specific project
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] })
    },
  })
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

// Users API Functions
export const usersApi = {
  /**
   * Get all users
   */
  async getUsers(): Promise<UserData[]> {
    const response = await api.get(GET_USERS)

    let rawUsers: unknown[]

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      rawUsers = (response.data as UsersResponse).data
    } else if (Array.isArray(response.data)) {
      rawUsers = response.data
    } else {
      console.warn('Unexpected API response format:', response.data)
      return []
    }

    return rawUsers.map((apiUser: Record<string, unknown>) => ({
      id: String(apiUser.id || ''),
      name: String(apiUser.name || ''),
      email: String(apiUser.email || ''),
      role: (apiUser.role as UserData['role']) || 'member',
      designation: String(apiUser.designation || apiUser.designation || ''),
      avatar: apiUser.avatar ? String(apiUser.avatar) : undefined,
      teamId: apiUser.team_id ? String(apiUser.team_id) : apiUser.teamId ? String(apiUser.teamId) : undefined,
      departmentId: apiUser.department_id ? String(apiUser.department_id) : apiUser.departmentId ? String(apiUser.departmentId) : undefined,
      status: (apiUser.status as UserData['status']) || 'active',
      createdAt: apiUser.created_at ? String(apiUser.created_at) : undefined,
      updatedAt: apiUser.updated_at ? String(apiUser.updated_at) : undefined,
    }))
  },

  /**
   * Get user profile
   */
  async getProfile(): Promise<UserData> {
    const response = await api.get(GET_PROFILE)

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const userData = (response.data as ApiResponse<UserData>).data
      // Transform field names if needed
      return {
        id: String(userData.id || ''),
        name: String(userData.name || ''),
        email: String(userData.email || ''),
        role: (userData.role as UserData['role']) || 'member',
        designation: String(userData.designation || ''),
        avatar: userData.avatar,
        teamId: userData.teamId,
        departmentId: userData.departmentId,
        status: (userData.status as UserData['status']) || 'active',
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      }
    }

    return response.data as UserData
  },

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserData> {
    const response = await api.get(`${GET_USERS}/${id}`)

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<UserData>).data
    }

    return response.data as UserData
  },

  /**
   * Create new user
   */
  async createUser(user: CreateUserData): Promise<UserData> {
    const response = await api.post(GET_USERS, user)

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<UserData>).data
    }

    return response.data as UserData
  },

  /**
   * Update user
   */
  async updateUser(id: string, user: UpdateUserData): Promise<UserData> {
    const response = await api.put(`${GET_USERS}/${id}`, user)

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<UserData>).data
    }

    return response.data as UserData
  },

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    await api.delete(`${GET_USERS}/${id}`)
  },
}

// Tasks API Functions
export const tasksApi = {
  /**
   * Get all tasks
   */
  async getTasks(): Promise<TaskData[]> {
    const response = await api.get(GET_TASKS)

    let rawTasks: unknown[]

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      rawTasks = (response.data as TasksResponse).data
    } else if (Array.isArray(response.data)) {
      rawTasks = response.data
    } else {
      console.warn('Unexpected API response format:', response.data)
      return []
    }

    return rawTasks.map((apiTask: Record<string, unknown>) => ({
      id: String(apiTask.id || ''),
      projectId: String(apiTask.project_id ?? apiTask.projectId ?? ''),
      assignedTo: String(apiTask.assigned_to ?? apiTask.assignedTo ?? ''),
      createdBy: String(apiTask.created_by ?? apiTask.createdBy ?? ''),
      title: String(apiTask.title || ''),
      description: String(apiTask.description || ''),
      taskType: (apiTask.task_type ?? apiTask.taskType ?? 'feature') as TaskData['taskType'],
      status: (apiTask.status ?? 'todo') as TaskData['status'],
      priority: (apiTask.priority ?? 'medium') as TaskData['priority'],
      progress: Number(apiTask.progress ?? 0),
      dependencyTaskId: apiTask.dependency_task_id ?? apiTask.dependencyTaskId ? String(apiTask.dependency_task_id ?? apiTask.dependencyTaskId) : undefined,
      blocker: apiTask.blocker ? String(apiTask.blocker) : undefined,
      expectedOutput: apiTask.expected_output ?? apiTask.expectedOutput ? String(apiTask.expected_output ?? apiTask.expectedOutput) : undefined,
      startDate: String(apiTask.start_date ?? apiTask.startDate ?? new Date().toISOString()),
      dueDate: String(apiTask.due_date ?? apiTask.dueDate ?? new Date().toISOString()),
      createdAt: apiTask.created_at ? String(apiTask.created_at) : undefined,
      updatedAt: apiTask.updated_at ? String(apiTask.updated_at) : undefined,
    }))
  },

  /**
   * Get task by ID
   */
  async getTaskById(id: string): Promise<TaskData> {
    const response = await api.get(`${GET_TASKS}/${id}`)

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<TaskData>).data
    }

    return response.data as TaskData
  },

  /**
   * Create new task
   */
  async createTask(task: CreateTaskData): Promise<TaskData> {
    const response = await api.post(GET_TASKS, task)

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<TaskData>).data
    }

    return response.data as TaskData
  },

  /**
   * Update task
   */
  async updateTask(id: string, task: UpdateTaskData): Promise<TaskData> {
    const response = await api.put(`${GET_TASKS}/${id}`, task)

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<TaskData>).data
    }

    return response.data as TaskData
  },

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<void> {
    await api.delete(`${GET_TASKS}/${id}`)
  },
}

// Teams API Functions
export const teamsApi = {
  /**
   * Get all teams
   */
  async getTeams(): Promise<TeamData[]> {
    const response = await api.get(GET_TEAMS)

    let rawTeams: unknown[]

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      rawTeams = (response.data as TeamsResponse).data
    } else if (Array.isArray(response.data)) {
      rawTeams = response.data
    } else {
      console.warn('Unexpected API response format:', response.data)
      return []
    }

    return rawTeams.map((apiTeam: Record<string, unknown>) => ({
      id: String(apiTeam.id || ''),
      departmentId: String(apiTeam.department_id ?? apiTeam.departmentId ?? ''),
      name: String(apiTeam.name || ''),
      leadId: apiTeam.lead_id ?? apiTeam.leadId ? String(apiTeam.lead_id ?? apiTeam.leadId) : undefined,
      createdAt: apiTeam.created_at ? String(apiTeam.created_at) : undefined,
      updatedAt: apiTeam.updated_at ? String(apiTeam.updated_at) : undefined,
    }))
  },

  /**
   * Get team by ID
   */
  async getTeamById(id: string): Promise<TeamData> {
    const response = await api.get(`${GET_TEAMS}/${id}`)

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<TeamData>).data
    }

    return response.data as TeamData
  },

  /**
   * Create new team
   */
  async createTeam(team: CreateTeamData): Promise<TeamData> {
    const response = await api.post(GET_TEAMS, team)

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<TeamData>).data
    }

    return response.data as TeamData
  },

  /**
   * Update team
   */
  async updateTeam(id: string, team: UpdateTeamData): Promise<TeamData> {
    const response = await api.put(`${GET_TEAMS}/${id}`, team)

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<TeamData>).data
    }

    return response.data as TeamData
  },

  /**
   * Delete team
   */
  async deleteTeam(id: string): Promise<void> {
    await api.delete(`${GET_TEAMS}/${id}`)
  },
}

// Departments API Functions
export const departmentsApi = {
  /**
   * Get all departments
   */
  async getDepartments(): Promise<DepartmentData[]> {
    const response = await api.get(GET_DEPARTMENTS)

    let rawDepartments: unknown[]

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      rawDepartments = (response.data as DepartmentsResponse).data
    } else if (Array.isArray(response.data)) {
      rawDepartments = response.data
    } else {
      console.warn('Unexpected API response format:', response.data)
      return []
    }

    return rawDepartments.map((apiDepartment: Record<string, unknown>) => ({
      id: String(apiDepartment.id || ''),
      name: String(apiDepartment.name || ''),
      slug: String(apiDepartment.slug || ''),
      createdAt: apiDepartment.created_at ? String(apiDepartment.created_at) : undefined,
      updatedAt: apiDepartment.updated_at ? String(apiDepartment.updated_at) : undefined,
    }))
  },

  /**
   * Get department by ID
   */
  async getDepartmentById(id: string): Promise<DepartmentData> {
    const response = await api.get(`${GET_DEPARTMENTS}/${id}`)

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<DepartmentData>).data
    }

    return response.data as DepartmentData
  },

  /**
   * Create new department
   */
  async createDepartment(department: CreateDepartmentData): Promise<DepartmentData> {
    const response = await api.post(GET_DEPARTMENTS, department)

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<DepartmentData>).data
    }

    return response.data as DepartmentData
  },

  /**
   * Update department
   */
  async updateDepartment(id: string, department: UpdateDepartmentData): Promise<DepartmentData> {
    const response = await api.put(`${GET_DEPARTMENTS}/${id}`, department)

    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return (response.data as ApiResponse<DepartmentData>).data
    }

    return response.data as DepartmentData
  },

  /**
   * Delete department
   */
  async deleteDepartment(id: string): Promise<void> {
    await api.delete(`${GET_DEPARTMENTS}/${id}`)
  },
}

// React Query Hooks for Users
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProfile() {
  return useQuery({
    queryKey: ['me'],
    queryFn: usersApi.getProfile,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, user }: { id: string; user: UpdateUserData }) =>
      usersApi.updateUser(id, user),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// React Query Hooks for Tasks
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.getTasks,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksApi.getTaskById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tasksApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: UpdateTaskData }) =>
      tasksApi.updateTask(id, task),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] })
    },
  })
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

// React Query Hooks for Teams
export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: teamsApi.getTeams,
    staleTime: 5 * 60 * 1000,
  })
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: () => teamsApi.getTeamById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateTeamMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: teamsApi.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

export function useUpdateTeamMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, team }: { id: string; team: UpdateTeamData }) =>
      teamsApi.updateTeam(id, team),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: ['teams', variables.id] })
    },
  })
}

export function useDeleteTeamMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: teamsApi.deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

// React Query Hooks for Departments
export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: departmentsApi.getDepartments,
    staleTime: 5 * 60 * 1000,
  })
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: ['departments', id],
    queryFn: () => departmentsApi.getDepartmentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateDepartmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: departmentsApi.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
    },
  })
}

export function useUpdateDepartmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, department }: { id: string; department: UpdateDepartmentData }) =>
      departmentsApi.updateDepartment(id, department),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      queryClient.invalidateQueries({ queryKey: ['departments', variables.id] })
    },
  })
}

export function useDeleteDepartmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: departmentsApi.deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
    },
  })
}
