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
import { fmtDate, daysUntil, timeAgo } from '@/lib/date'
import { getInitials } from '@/lib/utils'
import { useAppSelector } from '@/redux/hooks'
import type { Task } from '@/types'
import type { UserData, ProjectData } from '@/types/api'

// ============================================================================
// TYPES
// ============================================================================

interface TaskDrawerProps {
  /** Task to display */
  task: Task | null
  /** Available users for lookup */
  users: UserData[]
  /** Available projects for lookup */
  projects: ProjectData[]
  /** Whether the drawer is open */
  open: boolean
  /** Callback to control drawer state */
  onOpenChange: (open: boolean) => void
  /** Callback when edit is clicked */
  onEdit?: (task: Task) => void
}

interface Comment {
  id: string
  userId: string
  body: string
  timestamp: string
}

// ============================================================================
// CONSTANTS
// ============================================================================

const MOCK_COMMENTS: Omit<Comment, 'id'>[] = [
  {
    userId: 'u_2',
    body: 'Just synced with the PM team — they need this wrapped by EOW. Can we tighten the scope?',
    timestamp: '2026-05-27T08:14:00Z',
  },
  {
    userId: 'u_1',
    body: 'Let\'s drop the optional analytics step and ship the core flow first.',
    timestamp: '2026-05-27T09:02:00Z',
  },
]

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate seed comments for a task
 */
function generateSeedComments(taskId: string): Comment[] {
  return MOCK_COMMENTS.map((comment, index) => ({
    ...comment,
    id: `${taskId}-c${index + 1}`,
  }))
}

/**
 * Find user by ID
 */
function findUserById(userId: string, users: UserData[]): UserData | undefined {
  return users.find(user => user.id === userId)
}

/**
 * Get due date badge variant based on days until due
 */
function getDueDateBadgeVariant(daysUntilDue: number): 'destructive' | 'warning' | 'secondary' {
  if (daysUntilDue < 0) return 'destructive'
  if (daysUntilDue <= 3) return 'warning'
  return 'secondary'
}

/**
 * Format due date text
 */
function formatDueDateText(days: number): string {
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return 'Due today'
  return `${days}d left`
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

/**
 * Metadata display card with optional avatar
 */
function TaskMetadata({
  label,
  value,
  avatar,
}: {
  label: string
  value: string
  avatar?: string
}) {
  return (
    <div className="rounded-md border border-border/60 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
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

/**
 * Single comment display component
 */
function CommentItem({
  comment,
  user,
}: {
  comment: Comment
  user: UserData | undefined
}) {
  if (!user) return null

  return (
    <div className="flex gap-3">
      <Avatar className="size-8">
        {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
        <p className="flex items-baseline justify-between gap-2 text-xs">
          <span className="font-medium">{user.name}</span>
          <span className="text-muted-foreground">{timeAgo(comment.timestamp)}</span>
        </p>
        <p className="mt-1 text-sm">{comment.body}</p>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TaskDrawer({
  task,
  users,
  projects,
  open,
  onOpenChange,
  onEdit,
}: TaskDrawerProps) {
  // ============================================================================
  // STATE
  // ============================================================================
  const [comments, setComments] = useState<Comment[]>(() =>
    task ? generateSeedComments(task.id) : []
  )
  const [commentDraft, setCommentDraft] = useState('')
  const currentUser = useAppSelector((state) => state.auth.user)

  // ============================================================================
  // EARLY RETURN
  // ============================================================================
  if (!task) return null

  // ============================================================================
  // DATA LOOKUP
  // ============================================================================
  const assignedUser = findUserById(task.assignedTo, users)
  const createdByUser = findUserById(task.createdBy, users)
  const project = projects.find(p => p.id === task.projectId)
  const daysUntilDue = daysUntil(task.end_date)

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  const handleEditClick = () => {
    onEdit?.(task)
  }

  const handleSubmitComment = () => {
    if (!commentDraft.trim()) return

    const newComment: Comment = {
      id: `${task.id}-c${comments.length + 1}`,
      userId: currentUser?.id ?? 'u_1',
      body: commentDraft,
      timestamp: new Date().toISOString(),
    }

    setComments(prev => [...prev, newComment])
    setCommentDraft('')
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  const dueDateBadgeVariant = getDueDateBadgeVariant(daysUntilDue)
  const dueDateText = formatDueDateText(daysUntilDue)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-xl">
        {/* Header */}
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
                onClick={handleEditClick}
              >
                <Pencil className="size-3.5" /> Edit
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-6">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <Badge variant="outline">{task.taskType}</Badge>
            {task.status !== 'completed' && (
              <Badge variant={dueDateBadgeVariant}>
                {dueDateText}
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground">{task.description}</p>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium tabular-nums">{task.progress}%</span>
            </div>
            <Progress value={task.progress} />
          </div>

          {/* Blocker Alert */}
          {task.blocker && (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-destructive">
                Blocker
              </p>
              <p>{task.blocker}</p>
            </div>
          )}

          {/* Expected Output */}
          {task.expectedOutput && (
            <div className="rounded-md border border-info/30 bg-info/5 p-3 text-sm">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-info">
                Expected output
              </p>
              <p>{task.expectedOutput}</p>
            </div>
          )}

          {/* Task Metadata Grid */}
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
            <TaskMetadata
              label="Start"
              value={fmtDate(task.start_date, 'MMM d, yyyy')}
            />
            <TaskMetadata
              label="Due"
              value={fmtDate(task.end_date, 'MMM d, yyyy')}
            />
          </div>

          <Separator />

          {/* Comments Section */}
          <div>
            <p className="mb-3 text-sm font-semibold">Comments</p>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => {
                const commentUser = findUserById(comment.userId, users)
                return (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    user={commentUser}
                  />
                )
              })}
            </div>

            {/* Comment Input */}
            <div className="mt-4 flex gap-2">
              <Textarea
                placeholder="Add a comment..."
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                rows={2}
              />
              <Button
                onClick={handleSubmitComment}
                variant="gradient"
                size="icon"
                className="shrink-0 self-end"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
