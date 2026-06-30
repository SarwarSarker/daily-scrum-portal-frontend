import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/constants'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const loadInitial = (): AuthState => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const rawUser = localStorage.getItem(AUTH_USER_KEY)
    const user = rawUser ? (JSON.parse(rawUser) as User) : null
    return { user, token, isAuthenticated: Boolean(token && user) }
  } catch {
    return { user: null, token: null, isAuthenticated: false }
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitial(),
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(action.payload.user))
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(state.user))
      }
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
    },
  },
})

export const { setCredentials, updateUser, logout } = authSlice.actions
export default authSlice.reducer
