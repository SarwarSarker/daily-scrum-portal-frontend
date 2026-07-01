import { CheckCircle2, Circle, Clock, Eye, PauseCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { timeAgo } from '@/lib/date'
import { getInitials, cn } from '@/lib/utils'
import { avatarColor } from '@/lib/avatarColor'
import { findUserById, normalizeTaskStatus } from './projectDetailsHelpers'
import type { UserData, TaskData } from '@/types/api'

/** How each task status reads in the activity line, plus its little status icon. */
const STATUS_META: Record<
  TaskData['status'],
  { verb: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  pending: { verb: 'was assigned', icon: Circle, color: 'text-muted-foreground' },
  on_hold: { verb: 'put on hold', icon: PauseCircle, color: 'text-amber-500' },
  in_progress: { verb: 'is working on', icon: Clock, color: 'text-blue-500' },
  in_review: { verb: 'submitted for review', icon: Eye, color: 'text-violet-500' },
  completed: { verb: 'completed', icon: CheckCircle2, color: 'text-emerald-500' },
}

interface Person {
  id?: string
  name: string
  avatar?: string | null
}

interface ProjectTaskCardProps {
  task: TaskData
  users: UserData[]
}

/** One activity-style row: assignee avatar, "Name action Title", and a relative time. */
export function ProjectTaskCard({ task, users }: ProjectTaskCardProps) {
  // The API may send the assignee as a nested { name, avatar } object or as a plain id,
  // and its date/time under a few possible keys — read them flexibly so the row always shows.
  const raw = task as unknown as Record<string, unknown>

  const rawAssignee = raw.assignedTo ?? raw.assignee ?? raw.assigned_to
  const assignee: Person | undefined =
    rawAssignee && typeof rawAssignee === 'object'
      ? (rawAssignee as Person)
      : findUserById(String(rawAssignee ?? ''), users)

  const when = (raw.updatedAt ??
    raw.updated_at ??
    raw.dueDate ??
    raw.end_date ??
    raw.createdAt ??
    raw.created_at) as string | undefined

  // The API returns a display status like "In Progress" — normalize it to the enum key.
  const statusKey = normalizeTaskStatus(String(task.status)) as TaskData['status']
  const meta = STATUS_META[statusKey] ?? STATUS_META.pending
  const StatusIcon = meta.icon

  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="relative shrink-0">
        <Avatar className="size-9">
          {assignee?.avatar && <AvatarImage src={assignee.avatar} alt={assignee.name} />}
          <AvatarFallback className={assignee ? avatarColor(assignee.id ?? assignee.name) : undefined}>
            {assignee ? getInitials(assignee.name) : '?'}
          </AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full bg-background ring-2 ring-background">
          <StatusIcon className={cn('size-3.5', meta.color)} />
        </span>
      </div>

      <div className="min-w-0 flex-1 leading-snug">
        <p className="text-sm">
          <span className="font-semibold">{assignee?.name ?? 'Unassigned'}</span>{' '}
          <span className="text-muted-foreground">{meta.verb}</span>{' '}
          <span className="font-semibold">{task.title}</span>
        </p>
        {when && <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(when)}</p>}
      </div>
    </div>
  )
}
