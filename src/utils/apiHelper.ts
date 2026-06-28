import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_BASE_URL, SIGNIN_USER, GET_PROJECTS, GET_USERS, GET_PROFILE, GET_TASKS, GET_TEAMS, GET_DEPARTMENTS } from '@/constants'
import type { ProjectData, CreateProjectData, UpdateProjectData, UserData, CreateUserData, UpdateUserData, TaskData, CreateTaskData, UpdateTaskData, TeamData, CreateTeamData, UpdateTeamData, DepartmentData, CreateDepartmentData, UpdateDepartmentData, LoginCredentials, LoginResponse } from '@/types/api'

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('scrumly:auth-token')
}

// Make authenticated API calls
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('scrumly:auth-token')
      localStorage.removeItem('scrumly:auth-user')
      window.location.href = '/login'
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// ============================================
// AUTH API
// ============================================

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetchAPI<LoginResponse>(SIGNIN_USER, {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

  if (response.data?.token) {
    localStorage.setItem('scrumly:auth-token', response.data.token)
  }

  return response
}

export function logout(): void {
  localStorage.removeItem('scrumly:auth-token')
  localStorage.removeItem('scrumly:auth-user')
}

// ============================================
// PROJECTS API
// ============================================

export async function getProjects(): Promise<ProjectData[]> {
  const response = await fetchAPI<{ data: ProjectData[] } | ProjectData[]>(GET_PROJECTS)

  // Handle different response formats
  if ('data' in response) {
    return response.data
  }

  return response
}

export async function getProjectById(id: string): Promise<ProjectData> {
  const response = await fetchAPI<{ data: ProjectData }>(`${GET_PROJECTS}/${id}`)
  return response.data
}

export async function createProject(data: CreateProjectData): Promise<ProjectData> {
  const response = await fetchAPI<{ data: ProjectData }>(GET_PROJECTS, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response.data
}

export async function updateProject(params: { id: string; project: UpdateProjectData }): Promise<ProjectData> {
  const response = await fetchAPI<{ data: ProjectData }>(`${GET_PROJECTS}/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.project),
  })

  return response.data
}

export async function deleteProject(id: string): Promise<void> {
  await fetchAPI(`${GET_PROJECTS}/${id}`, { method: 'DELETE' })
}

// ============================================
// USERS API
// ============================================

export async function getUsers(): Promise<UserData[]> {
  const response = await fetchAPI<{ data: UserData[] } | UserData[]>(GET_USERS)

  if ('data' in response) {
    return response.data
  }

  return response
}

export async function getUserById(id: string): Promise<UserData> {
  const response = await fetchAPI<{ data: UserData }>(`${GET_USERS}/${id}`)
  return response.data
}

export async function getProfile(): Promise<UserData> {
  const response = await fetchAPI<{ data: UserData }>(GET_PROFILE)
  return response.data
}

export async function createUser(data: CreateUserData): Promise<UserData> {
  const response = await fetchAPI<{ data: UserData }>(GET_USERS, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response.data
}

export async function updateUser(params: { id: string; user: UpdateUserData }): Promise<UserData> {
  const response = await fetchAPI<{ data: UserData }>(`${GET_USERS}/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.user),
  })

  return response.data
}

export async function deleteUser(id: string): Promise<void> {
  await fetchAPI(`${GET_USERS}/${id}`, { method: 'DELETE' })
}

// ============================================
// TASKS API
// ============================================

export async function getTasks(): Promise<TaskData[]> {
  const response = await fetchAPI<{ data: TaskData[] } | TaskData[]>(GET_TASKS)

  if ('data' in response) {
    return response.data
  }

  return response
}

export async function getTaskById(id: string): Promise<TaskData> {
  const response = await fetchAPI<{ data: TaskData }>(`${GET_TASKS}/${id}`)
  return response.data
}

export async function createTask(data: CreateTaskData): Promise<TaskData> {
  const response = await fetchAPI<{ data: TaskData }>(GET_TASKS, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response.data
}

export async function updateTask(params: { id: string; task: UpdateTaskData }): Promise<TaskData> {
  const response = await fetchAPI<{ data: TaskData }>(`${GET_TASKS}/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.task),
  })

  return response.data
}

export async function deleteTask(id: string): Promise<void> {
  await fetchAPI(`${GET_TASKS}/${id}`, { method: 'DELETE' })
}

// ============================================
// TEAMS API
// ============================================

export async function getTeams(): Promise<TeamData[]> {
  const response = await fetchAPI<{ data: TeamData[] } | TeamData[]>(GET_TEAMS)

  if ('data' in response) {
    return response.data
  }

  return response
}

export async function getTeamById(id: string): Promise<TeamData> {
  const response = await fetchAPI<{ data: TeamData }>(`${GET_TEAMS}/${id}`)
  return response.data
}

export async function createTeam(data: CreateTeamData): Promise<TeamData> {
  const response = await fetchAPI<{ data: TeamData }>(GET_TEAMS, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response.data
}

export async function updateTeam(params: { id: string; team: UpdateTeamData }): Promise<TeamData> {
  const response = await fetchAPI<{ data: TeamData }>(`${GET_TEAMS}/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.team),
  })

  return response.data
}

export async function deleteTeam(id: string): Promise<void> {
  await fetchAPI(`${GET_TEAMS}/${id}`, { method: 'DELETE' })
}

// ============================================
// DEPARTMENTS API
// ============================================

export async function getDepartments(): Promise<DepartmentData[]> {
  const response = await fetchAPI<{ data: DepartmentData[] } | DepartmentData[]>(GET_DEPARTMENTS)

  if ('data' in response) {
    return response.data
  }

  return response
}

export async function getDepartmentById(id: string): Promise<DepartmentData> {
  const response = await fetchAPI<{ data: DepartmentData }>(`${GET_DEPARTMENTS}/${id}`)
  return response.data
}

export async function createDepartment(data: CreateDepartmentData): Promise<DepartmentData> {
  const response = await fetchAPI<{ data: DepartmentData }>(GET_DEPARTMENTS, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response.data
}

export async function updateDepartment(params: { id: string; department: UpdateDepartmentData }): Promise<DepartmentData> {
  const response = await fetchAPI<{ data: DepartmentData }>(`${GET_DEPARTMENTS}/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.department),
  })

  return response.data
}

export async function deleteDepartment(id: string): Promise<void> {
  await fetchAPI(`${GET_DEPARTMENTS}/${id}`, { method: 'DELETE' })
}

// ============================================
// REACT QUERY HOOKS
// ============================================

// Auth Hook
export function useLoginMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  })
}

// Project Hooks
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  })
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProject,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] })
    },
  })
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  })
}

// User Hooks
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  })
}

export function useProfile() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getProfile,
  })
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}

// Task Hooks
export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => getTaskById(id),
    enabled: !!id,
  })
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] })
    },
  })
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

// Team Hooks
export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
  })
}

export function useTeam(id: string) {
  return useQuery({
    queryKey: ['teams', id],
    queryFn: () => getTeamById(id),
    enabled: !!id,
  })
}

export function useCreateTeamMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teams'] }),
  })
}

export function useUpdateTeamMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTeam,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      queryClient.invalidateQueries({ queryKey: ['teams', variables.id] })
    },
  })
}

export function useDeleteTeamMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teams'] }),
  })
}

// Department Hooks
export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  })
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: ['departments', id],
    queryFn: () => getDepartmentById(id),
    enabled: !!id,
  })
}

export function useCreateDepartmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  })
}

export function useUpdateDepartmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      queryClient.invalidateQueries({ queryKey: ['departments', variables.id] })
    },
  })
}

export function useDeleteDepartmentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  })
}
