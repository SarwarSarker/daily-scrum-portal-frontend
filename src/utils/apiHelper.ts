/**
 * apiHelper.ts
 * ------------
 * One place for all talking to the backend API.
 *
 * It has three layers, from low-level to high-level:
 *   1. `request()`      – the single function that actually calls `fetch`.
 *   2. API functions    – one small function per endpoint (getProjects, createTask, ...).
 *   3. React Query hooks – what components use (useProjects, useCreateTaskMutation, ...).
 *
 * If you only need data in a component, use a hook from the bottom of this file.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  API_BASE_URL,
  SIGNIN_USER,
  GET_PROJECTS,
  GET_USERS,
  GET_PROFILE,
  GET_TASKS,
  GET_TEAMS,
  GET_DEPARTMENTS,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
} from '@/constants'
import type {
  ProjectData,
  CreateProjectData,
  UpdateProjectData,
  UserData,
  CreateUserData,
  UpdateUserData,
  TaskData,
  CreateTaskData,
  UpdateTaskData,
  TeamData,
  CreateTeamData,
  UpdateTeamData,
  DepartmentData,
  CreateDepartmentData,
  UpdateDepartmentData,
  LoginCredentials,
  LoginResponse,
} from '@/types/api'

// ============================================================================
// 1. CORE HELPERS
// ============================================================================

/** Read the saved login token from the browser. Returns null if not logged in. */
function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

/**
 * Send one request to the API.
 *
 * It automatically:
 *   - adds the base URL in front of the endpoint,
 *   - sends and expects JSON,
 *   - attaches the login token so the server knows who you are,
 *   - throws an Error if the server responds with a failure status.
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Only add the Authorization header when we actually have a token.
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    // 401 = the token is missing or expired, so the session is over.
    //       Clear it and send the user to the login page.
    // Anything else (e.g. 403 Forbidden = logged in but not allowed) is left
    // for the calling code to handle.
    if (response.status === 401) {
      logout()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

/**
 * List endpoints are inconsistent: some return the array directly (`[...]`),
 * others wrap it in an object (`{ data: [...] }`). This always returns the array.
 */
function unwrapList<T>(response: { data: T[] } | T[]): T[] {
  return Array.isArray(response) ? response : response.data
}

// ============================================================================
// 2. API FUNCTIONS
// ============================================================================

// ---- Auth ----

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await request<LoginResponse>(SIGNIN_USER, {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

  // Remember the token so every request after this is authenticated.
  if (response.data?.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.token)
  }

  return response
}

export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

// ---- Projects ----

export async function getProjects(): Promise<ProjectData[]> {
  const response = await request<{ data: ProjectData[] } | ProjectData[]>(GET_PROJECTS)
  return unwrapList(response)
}

export async function getProjectById(id: string): Promise<ProjectData> {
  const response = await request<{ data: ProjectData }>(`${GET_PROJECTS}/${id}`)
  return response.data
}

export async function createProject(data: CreateProjectData): Promise<ProjectData> {
  const response = await request<{ data: ProjectData }>(GET_PROJECTS, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.data
}

export async function updateProject(params: {
  id: string
  project: UpdateProjectData
}): Promise<ProjectData> {
  const response = await request<{ data: ProjectData }>(`${GET_PROJECTS}/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.project),
  })
  return response.data
}

export async function deleteProject(id: string): Promise<void> {
  await request(`${GET_PROJECTS}/${id}`, { method: 'DELETE' })
}

// ---- Users ----

export async function getUsers(): Promise<UserData[]> {
  const response = await request<{ data: UserData[] } | UserData[]>(GET_USERS)
  return unwrapList(response)
}

export async function getUserById(id: string): Promise<UserData> {
  const response = await request<{ data: UserData }>(`${GET_USERS}/${id}`)
  return response.data
}

export async function getProfile(): Promise<UserData> {
  const response = await request<{ data: UserData }>(GET_PROFILE)
  return response.data
}

export async function createUser(data: CreateUserData): Promise<UserData> {
  const response = await request<{ data: UserData }>(GET_USERS, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.data
}

export async function updateUser(params: {
  id: string
  user: UpdateUserData
}): Promise<UserData> {
  const response = await request<{ data: UserData }>(`${GET_USERS}/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.user),
  })
  return response.data
}

export async function deleteUser(id: string): Promise<void> {
  await request(`${GET_USERS}/${id}`, { method: 'DELETE' })
}

// ---- Tasks ----

export async function getTasks(): Promise<TaskData[]> {
  const response = await request<{ data: TaskData[] } | TaskData[]>(GET_TASKS)
  return unwrapList(response)
}

export async function getTaskById(id: string): Promise<TaskData> {
  const response = await request<{ data: TaskData }>(`${GET_TASKS}/${id}`)
  return response.data
}

/** Get all tasks that belong to one project. */
export async function getProjectTasks(projectId: string): Promise<TaskData[]> {
  const response = await request<{ data: TaskData[] } | TaskData[]>(
    `${GET_PROJECTS}/${projectId}/tasks`,
  )
  return unwrapList(response)
}

export async function createTask(data: CreateTaskData): Promise<TaskData> {
  const response = await request<{ data: TaskData }>(GET_TASKS, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.data
}

export async function updateTask(params: {
  id: string
  task: UpdateTaskData
}): Promise<TaskData> {
  const response = await request<{ data: TaskData }>(`${GET_TASKS}/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.task),
  })
  return response.data
}

export async function deleteTask(id: string): Promise<void> {
  await request(`${GET_TASKS}/${id}`, { method: 'DELETE' })
}

// ---- Teams ----

export async function getTeams(): Promise<TeamData[]> {
  const response = await request<{ data: TeamData[] } | TeamData[]>(GET_TEAMS)
  return unwrapList(response)
}

export async function getTeamById(id: string): Promise<TeamData> {
  const response = await request<{ data: TeamData }>(`${GET_TEAMS}/${id}`)
  return response.data
}

export async function createTeam(data: CreateTeamData): Promise<TeamData> {
  const response = await request<{ data: TeamData }>(GET_TEAMS, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.data
}

export async function updateTeam(params: {
  id: string
  team: UpdateTeamData
}): Promise<TeamData> {
  const response = await request<{ data: TeamData }>(`${GET_TEAMS}/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.team),
  })
  return response.data
}

export async function deleteTeam(id: string): Promise<void> {
  await request(`${GET_TEAMS}/${id}`, { method: 'DELETE' })
}

// ---- Departments ----

export async function getDepartments(): Promise<DepartmentData[]> {
  const response = await request<{ data: DepartmentData[] } | DepartmentData[]>(GET_DEPARTMENTS)
  return unwrapList(response)
}

export async function getDepartmentById(id: string): Promise<DepartmentData> {
  const response = await request<{ data: DepartmentData }>(`${GET_DEPARTMENTS}/${id}`)
  return response.data
}

export async function createDepartment(data: CreateDepartmentData): Promise<DepartmentData> {
  const response = await request<{ data: DepartmentData }>(GET_DEPARTMENTS, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.data
}

export async function updateDepartment(params: {
  id: string
  department: UpdateDepartmentData
}): Promise<DepartmentData> {
  const response = await request<{ data: DepartmentData }>(`${GET_DEPARTMENTS}/${params.id}`, {
    method: 'PUT',
    body: JSON.stringify(params.department),
  })
  return response.data
}

export async function deleteDepartment(id: string): Promise<void> {
  await request(`${GET_DEPARTMENTS}/${id}`, { method: 'DELETE' })
}

// ============================================================================
// 3. REACT QUERY HOOKS
// ============================================================================
//
// Components use these instead of the functions above.
//   - useX / useXs (queries)   -> fetch data and keep it cached.
//   - useXMutation (mutations) -> change data, then refresh the cache so the
//                                 screen shows the new state automatically.
//
// A "queryKey" like ['projects'] is just a label React Query uses to cache and
// later re-fetch that data. Mutations call `invalidateQueries` to say
// "this label is now out of date, please fetch it again".

// ---- Auth ----

export function useLoginMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  })
}

// ---- Projects ----

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

// ---- Users ----

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

// ---- Tasks ----

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

export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId, 'tasks'],
    queryFn: () => getProjectTasks(projectId),
    enabled: !!projectId,
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

// ---- Teams ----

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

// ---- Departments ----

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
