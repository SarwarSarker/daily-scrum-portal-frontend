import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { APP_NAME } from '@/constants'

interface LogoProps {
  collapsed?: boolean
  className?: string
}

export function Logo({ collapsed, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="grid size-9 place-items-center rounded-lg gradient-primary shadow-md">
        <Sparkles className="size-5 text-white" />
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold tracking-tight">{APP_NAME}</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Scrum Suite
          </span>
        </div>
      )}
    </div>
  )
}
