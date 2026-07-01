import { Progress } from '@/components/ui/progress'

interface PerfBarProps {
  label: string
  value: number
  hint?: string
}

export function PerfBar({ label, value, hint }: PerfBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{hint ?? `${value}%`}</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  )
}
