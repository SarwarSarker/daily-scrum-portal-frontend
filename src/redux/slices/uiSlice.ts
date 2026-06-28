import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  sidebarCollapsed: boolean
  mobileSidebarOpen: boolean
}

const initialState: UiState = {
  sidebarCollapsed: localStorage.getItem('scrumly:sidebar-collapsed') === '1',
  mobileSidebarOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed
      localStorage.setItem('scrumly:sidebar-collapsed', state.sidebarCollapsed ? '1' : '0')
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload
      localStorage.setItem('scrumly:sidebar-collapsed', action.payload ? '1' : '0')
    },
    setMobileSidebarOpen(state, action: PayloadAction<boolean>) {
      state.mobileSidebarOpen = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarCollapsed, setMobileSidebarOpen } = uiSlice.actions
export default uiSlice.reducer
