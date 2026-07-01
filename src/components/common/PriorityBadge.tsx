import { Badge } from '@/components/ui/badge'
import type { Priority } from '@/types'

const priorityMap: Record<Priority, { label: string; variant: Parameters<typeof Badge>[0]['variant'] }> = {
  low: { label: 'Low', variant: 'secondary' },
  medium: { label: 'Medium', variant: 'info' },
  high: { label: 'High', variant: 'warning' },
}

export function PriorityBadge({ priority }: { priority?: Priority | string | null }) {
  // Handle undefined, null, or invalid priority values
  if (!priority || !(priority in priorityMap)) {
    console.warn('Invalid or missing priority:', priority)
    return <Badge variant="secondary">Unknown</Badge>
  }

  const conf = priorityMap[priority as Priority]
  return <Badge variant={conf.variant}>{conf.label}</Badge>
}
