import { cn } from '@/lib/utils'

interface ProjectStatProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  hint?: string
  hintClassName?: string
}

/** A small bordered box that shows one metric (icon + label + value + optional hint). */
export function ProjectStat({ icon: Icon, label, value, hint, hintClassName }: ProjectStatProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border/60 p-3">
      <Icon className="mt-0.5 size-4 text-muted-foreground" />
      <div className="leading-tight">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium">{value}</p>
        {hint && <p className={cn('text-[10px]', hintClassName)}>{hint}</p>}
      </div>
    </div>
  )
}