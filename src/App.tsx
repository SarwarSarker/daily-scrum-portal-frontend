import { AppProviders } from '@/components/providers/AppProviders'
import { AppRoutes } from '@/routes/AppRoutes'

function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}

export default App
