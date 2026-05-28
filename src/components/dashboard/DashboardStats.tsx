import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Layers,
} from 'lucide-react'
import { SimpleStatCard } from '@/components/cards/SimpleStatCard'
import { mockProjects } from '@/mocks/projects'
import { mockTasks } from '@/mocks/tasks'

export function DashboardStats() {
  const active = mockProjects.filter(
    (p) => p.status !== 'completed' && p.status !== 'cancelled',
  )
  const completed = mockProjects.filter((p) => p.status === 'completed')

  const avgProgress =
    active.length === 0
      ? 0
      : Math.round(active.reduce((s, p) => s + p.currentProgress, 0) / active.length)

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

  const taskCompletion =
    mockTasks.length === 0
      ? 0
      : Math.round(
          (mockTasks.filter((t) => t.status === 'completed').length / mockTasks.length) * 100,
        )

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <SimpleStatCard icon={BarChart3}     label="Active Projects"    value={active.length}      tone="info"    />
      <SimpleStatCard icon={CheckCircle2}  label="Completed Projects" value={completed.length}   tone="success" />
      <SimpleStatCard icon={TrendingUp}    label="Average Progress"   value={`~${avgProgress}%`} tone="primary" />
      <SimpleStatCard icon={AlertTriangle} label="High Priority"      value={highPriority}       tone="warning" />
      <SimpleStatCard icon={ShieldCheck}   label="Delayed Risk"       value={delayed}            tone="danger"  />
      <SimpleStatCard icon={Layers}        label="Task Completion"    value={`${taskCompletion}%`} tone="info"  />
    </div>
  )
}
