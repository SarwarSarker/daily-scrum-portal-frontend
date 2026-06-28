import { useState } from 'react'
import { Pencil, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { userById } from '@/mock/users'
import { projectById } from '@/mock/projects'
import { fmtDate, daysUntil, timeAgo } from '@/lib/date'
import { getInitials } from '@/lib/utils'
import { useAppSelector } from '@/redux/hooks'
import type { Task } from '@/types'

interface TaskDrawerProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (task: Task) => void
}

interface Comment {
  id: string
  userId: string
  body: string
  timestamp: string
}

const seedComments = (taskId: string): Comment[] => [
  {
    id: `${taskId}-c1`,
    userId: 'u_2',
    body: 'Just synced with the PM team — they need this wrapped by EOW. Can we tighten the scope?',
    timestamp: '2026-05-27T08:14:00Z',
  },
  {
    id: `${taskId}-c2`,
    userId: 'u_1',
    body: 'Let\'s drop the optional analytics step and ship the core flow first.',
    timestamp: '2026-05-27T09:02:00Z',
  },
]

export function TaskDrawer({ task, open, onOpenChange, onEdit }: TaskDrawerProps) {
  const [comments, setComments] = useState<Comment[]>(() => (task ? seedComments(task.id) : []))
  const [draft, setDraft] = useState('')
  const me = useAppSelector((s) => s.auth.user)

  if (!task) return null

  const assignee = userById(task.assignedTo)
  const creator = userById(task.createdBy)
  const project = projectById(task.projectId)
  const days = daysUntil(task.dueDate)

  const submitComment = () => {
    if (!draft.trim()) return
    setComments((c) => [
      ...c,
      {
        id: `${task.id}-c${c.length + 1}`,
        userId: me?.id ?? 'u_1',
        body: draft,
        timestamp: new Date().toISOString(),
      },
    ])
    setDraft('')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-xl">
        <SheetHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <SheetDescription className="text-[10px] uppercase tracking-wider">
                {project?.projectName ?? 'Task'}
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
              <Badge variant={days < 0 ? 'destructive' : days <= 3 ? 'warning' : 'secondary'}>
                {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`}
              </Badge>
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
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-destructive">Blocker</p>
              <p>{task.blocker}</p>
            </div>
          )}

          {task.expectedOutput && (
            <div className="rounded-md border border-info/30 bg-info/5 p-3 text-sm">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-info">Expected output</p>
              <p>{task.expectedOutput}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Meta label="Assignee" value={assignee?.name ?? '—'} avatar={assignee?.avatar} />
            <Meta label="Created by" value={creator?.name ?? '—'} avatar={creator?.avatar} />
            <Meta label="Start" value={fmtDate(task.startDate, 'MMM d, yyyy')} />
            <Meta label="Due" value={fmtDate(task.dueDate, 'MMM d, yyyy')} />
          </div>

          <Separator />

          <div>
            <p className="mb-3 text-sm font-semibold">Comments</p>
            <div className="space-y-3">
              {comments.map((c) => {
                const u = userById(c.userId)
                return (
                  <div key={c.id} className="flex gap-3">
                    {u && (
                      <Avatar className="size-8">
                        {u.avatar && <AvatarImage src={u.avatar} alt={u.name} />}
                        <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="min-w-0 flex-1 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
                      <p className="flex items-baseline justify-between gap-2 text-xs">
                        <span className="font-medium">{u?.name}</span>
                        <span className="text-muted-foreground">{timeAgo(c.timestamp)}</span>
                      </p>
                      <p className="mt-1 text-sm">{c.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 flex gap-2">
              <Textarea
                placeholder="Add a comment..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
              />
              <Button onClick={submitComment} variant="gradient" size="icon" className="shrink-0 self-end">
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Meta({ label, value, avatar }: { label: string; value: string; avatar?: string }) {
  return (
    <div className="rounded-md border border-border/60 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        {avatar && (
          <Avatar className="size-6">
            <AvatarImage src={avatar} alt={value} />
            <AvatarFallback>{getInitials(value)}</AvatarFallback>
          </Avatar>
        )}
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  )
}
