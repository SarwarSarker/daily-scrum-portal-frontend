import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'success' | 'warning' | 'info' | 'danger'

interface StatCardProps {
  label: string
  value: string | number
  delta?: number
  helper?: string
  icon?: LucideIcon
  variant?: Variant
  className?: string
}

const accentMap: Record<Variant, string> = {
  primary: 'gradient-primary',
  success: 'gradient-success',
  warning: 'gradient-warning',
  info: 'gradient-info',
  danger: 'gradient-danger',
}

export function StatCard({ label, value, delta, helper, icon: Icon, variant = 'primary', className }: StatCardProps) {
  const isPositive = (delta ?? 0) >= 0

  return (
    <Card className={cn('group relative overflow-hidden p-5 transition-shadow hover:shadow-md', className)}>
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className={cn('grid size-10 place-items-center rounded-lg text-white', accentMap[variant])}>
            <Icon className="size-5" />
          </div>
        )}
      </div>

      {(delta !== undefined || helper) && (
        <div className="relative mt-4 flex items-center gap-2 text-xs">
          {delta !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold',
                isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive',
              )}
            >
              {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(delta).toFixed(1)}%
            </span>
          )}
          {helper && <span className="text-muted-foreground">{helper}</span>}
        </div>
      )}
    </Card>
  )
}
