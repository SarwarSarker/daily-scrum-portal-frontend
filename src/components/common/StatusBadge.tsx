import { Badge } from '@/components/ui/badge'
import type { ProjectStatus, TaskStatus } from '@/types'
import { cn } from '@/lib/utils'

const projectStatusMap: Record<ProjectStatus, { label: string; variant: Parameters<typeof Badge>[0]['variant'] }> = {
  planning: { label: 'Planning', variant: 'secondary' },
  in_progress: { label: 'In Progress', variant: 'info' },
  continue_development: { label: 'Continue Development', variant: 'info' },
  on_hold: { label: 'On Hold', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
}

const taskStatusMap: Record<TaskStatus, { label: string; variant: Parameters<typeof Badge>[0]['variant'] }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  on_hold: { label: 'On Hold', variant: 'warning' },
  in_progress: { label: 'In Progress', variant: 'info' },
  in_review: { label: 'In Review', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
}

interface StatusBadgeProps {
  status: ProjectStatus | TaskStatus
  kind?: 'project' | 'task'
  className?: string
}

export function StatusBadge({ status, kind = 'task', className }: StatusBadgeProps) {
  const map = kind === 'project' ? projectStatusMap : taskStatusMap
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conf = (map as any)[status] ?? { label: String(status).replace(/_/g, ' '), variant: 'secondary' as const }
  return <Badge variant={conf.variant} className={cn('capitalize', className)}>{conf.label}</Badge>
}
