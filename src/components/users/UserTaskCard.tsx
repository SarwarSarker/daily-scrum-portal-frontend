import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { fmtDate } from '@/lib/date'
import type { Task } from '@/types'

export function UserTaskCard({ task }: { task: Task }) {
  return (
    <Card className="flex items-center gap-3 p-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{task.title}</p>
        <p className="truncate text-xs text-muted-foreground">{task.description}</p>
        <Progress value={task.progress} className="mt-2 h-1.5" />
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
        <span className="text-[10px] text-muted-foreground">{fmtDate(task.end_date)}</span>
      </div>
    </Card>
  )
}
