import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { STORAGE_KEYS } from '@/constants'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const loadInitial = (): AuthState => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.authToken)
    const rawUser = localStorage.getItem(STORAGE_KEYS.authUser)
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
      localStorage.setItem(STORAGE_KEYS.authToken, action.payload.token)
      localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(action.payload.user))
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(state.user))
      }
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem(STORAGE_KEYS.authToken)
      localStorage.removeItem(STORAGE_KEYS.authUser)
    },
  },
})

export const { setCredentials, updateUser, logout } = authSlice.actions
export default authSlice.reducer
