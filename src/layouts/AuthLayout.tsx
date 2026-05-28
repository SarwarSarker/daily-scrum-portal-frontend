import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { APP_NAME, APP_TAGLINE } from '@/constants'

function AuthFallback() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export function AuthLayout() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden p-10 text-white gradient-primary lg:flex">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="size-5" />
          {APP_NAME}
        </div>
        <div className="relative space-y-4">
          <h2 className="text-4xl font-bold leading-tight">
            Ship faster.
            <br />
            Align deeper.
          </h2>
          <p className="max-w-md text-white/80">
            {APP_TAGLINE} brings every team — Tech, Marketing, and Business — into one shared
            heartbeat of progress, blockers, and outcomes.
          </p>
        </div>
        <p className="text-xs text-white/60">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 size-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="flex items-center justify-center bg-background p-6 lg:p-10">
        <div className="w-full max-w-md">
          <Suspense fallback={<AuthFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
