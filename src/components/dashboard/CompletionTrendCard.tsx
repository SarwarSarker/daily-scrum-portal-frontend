import { Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockProjects } from '@/mocks/projects'
import { mockTasks } from '@/mocks/tasks'

export function CompletionTrendCard() {
  const active = mockProjects.filter(
    (p) => p.status !== 'completed' && p.status !== 'cancelled',
  )

  const avgProgress =
    active.length === 0
      ? 0
      : Math.round(active.reduce((s, p) => s + p.currentProgress, 0) / active.length)

  const taskCompletion =
    mockTasks.length === 0
      ? 0
      : Math.round(
          (mockTasks.filter((t) => t.status === 'completed').length / mockTasks.length) * 100,
        )

  const highPriority = mockProjects.filter(
    (p) =>
      (p.priority === 'high' || p.priority === 'urgent') &&
      p.status !== 'completed' &&
      p.status !== 'cancelled',
  ).length

  const today = new Date()
  const delayed = mockProjects.filter(
    (p) =>
      p.status !== 'completed' &&
      p.status !== 'cancelled' &&
      new Date(p.dueDate) < today,
  ).length

  const rows = [
    { label: 'Average project completion', value: `${avgProgress}%` },
    { label: 'Task completion rate',       value: `${taskCompletion}%` },
    { label: 'High-priority projects',     value: `${highPriority}` },
    { label: 'Delayed-risk projects',      value: `${delayed}` },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-4 text-primary" /> Completion Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm"
          >
            <span className="text-muted-foreground">{r.label}:</span>
            <span className="font-bold tabular-nums">{r.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
