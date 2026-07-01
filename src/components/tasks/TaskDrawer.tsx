import { Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { fmtDate, daysUntil } from '@/lib/date'
import { TaskMetadata } from './TaskMetadata'
import { TaskComments } from './TaskComments'
import {
  findUserById,
  getDueDateBadgeVariant,
  formatDueDateText,
} from './taskDrawerHelpers'
import type { Task } from '@/types'
import type { UserData, ProjectData } from '@/types/api'

interface TaskDrawerProps {
  task: Task | null
  users: UserData[]
  projects: ProjectData[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (task: Task) => void
}

export function TaskDrawer({
  task,
  users,
  projects,
  open,
  onOpenChange,
  onEdit,
}: TaskDrawerProps) {
  if (!task) return null

  const assignedUser = findUserById(task.assignedTo, users)
  const createdByUser = findUserById(task.createdBy, users)
  const project = projects.find(p => p.id === task.projectId)
  const daysUntilDue = daysUntil(task.end_date)
  const dueDateBadgeVariant = getDueDateBadgeVariant(daysUntilDue)
  const dueDateText = formatDueDateText(daysUntilDue)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-xl">
        <SheetHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <SheetDescription className="text-[10px] uppercase tracking-wider">
                {project?.name ?? 'Task'}
              </SheetDescription>
              <SheetTitle className="text-xl">{task.title}</SheetTitle>
            </div>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="mr-8 shrink-0"
                onClick={() => onEdit(task)}
              >
                <Pencil className="size-3.5" /> Edit
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <Badge variant="outline">{task.taskType}</Badge>
            {task.status !== 'completed' && (
              <Badge variant={dueDateBadgeVariant}>{dueDateText}</Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground">{task.description}</p>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium tabular-nums">{task.progress}%</span>
            </div>
            <Progress value={task.progress} />
          </div>

          {task.blocker && (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-destructive">
                Blocker
              </p>
              <p>{task.blocker}</p>
            </div>
          )}

          {task.expectedOutput && (
            <div className="rounded-md border border-info/30 bg-info/5 p-3 text-sm">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-info">
                Expected output
              </p>
              <p>{task.expectedOutput}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <TaskMetadata
              label="Assignee"
              value={assignedUser?.name ?? '—'}
              avatar={assignedUser?.avatar}
            />
            <TaskMetadata
              label="Created by"
              value={createdByUser?.name ?? '—'}
              avatar={createdByUser?.avatar}
            />
            <TaskMetadata label="Start" value={fmtDate(task.start_date, 'MMM d, yyyy')} />
            <TaskMetadata label="Due" value={fmtDate(task.end_date, 'MMM d, yyyy')} />
          </div>

          <Separator />

          <TaskComments key={task.id} taskId={task.id} users={users} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
