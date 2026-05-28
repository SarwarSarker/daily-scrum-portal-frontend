import { Badge } from '@/components/ui/badge'
import type { Priority } from '@/types'

const priorityMap: Record<Priority, { label: string; variant: Parameters<typeof Badge>[0]['variant'] }> = {
  low: { label: 'Low', variant: 'secondary' },
  medium: { label: 'Medium', variant: 'info' },
  high: { label: 'High', variant: 'warning' },
  urgent: { label: 'Urgent', variant: 'destructive' },
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const conf = priorityMap[priority]
  return <Badge variant={conf.variant}>{conf.label}</Badge>
}
