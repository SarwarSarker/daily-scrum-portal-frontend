import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { APP_NAME } from '@/constants'

export function LoginPage() {
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

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" autoComplete="email" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" />
        </div>
        <Button type="submit" variant="gradient" size="lg" className="w-full">
          Sign in
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
