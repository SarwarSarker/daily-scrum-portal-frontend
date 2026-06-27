import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { APP_NAME } from '@/constants'
import { useLoginMutation } from '@/utils/apiHelper'
import type { LoginCredentials } from '@/types/api'

export function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  })

  const loginMutation = useLoginMutation()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Basic validation
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields')
      return
    }

    if (!credentials.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setError(null)

    try {
      await loginMutation.mutateAsync(credentials)
      // Navigate to dashboard on successful login
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err && typeof err === 'object' && 'response' in err
        ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Login failed. Please try again.')
        : 'Login failed. Please check your credentials.'
      setError(errorMessage)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 lg:hidden">
        <div className="grid size-8 place-items-center rounded-lg gradient-primary">
          <Sparkles className="size-4 text-white" />
        </div>
        <span className="text-sm font-bold">{APP_NAME}</span>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to access your dashboard.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            value={credentials.email}
            onChange={handleInputChange}
            disabled={loginMutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            {/* <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link> */}
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleInputChange}
            disabled={loginMutation.isPending}
          />
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground">
        Don't have an account?{' '}
        <Link to="#" className="font-medium text-primary hover:underline">
          Contact admin
        </Link>
      </p>
    </div>
  )
}
