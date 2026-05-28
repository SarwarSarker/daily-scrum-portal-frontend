import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Tone = 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'muted'

const toneMap: Record<Tone, string> = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  info:    'bg-info/10 text-info',
  warning: 'bg-warning/15 text-warning-foreground',
  danger:  'bg-destructive/10 text-destructive',
  muted:   'bg-muted text-muted-foreground',
}

interface SimpleStatCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  tone?: Tone
  className?: string
}

export function SimpleStatCard({
  icon: Icon,
  label,
  value,
  tone = 'muted',
  className,
}: SimpleStatCardProps) {
  return (
    <Card className={cn('flex items-center gap-4 p-5 transition-shadow hover:shadow-md', className)}>
      <div className={cn('grid size-10 shrink-0 place-items-center rounded-lg', toneMap[tone])}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
      </div>
    </Card>
  )
}
