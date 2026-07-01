import { daysUntil } from '@/lib/date'
import type { UserData, TaskData } from '@/types/api'

/** Find one user in a list by their id. */
export function findUserById(userId: string, users: UserData[]): UserData | undefined {
  return users.find((user) => user.id === userId)
}

/** Get every user that belongs to a given team. */
export function getUsersByTeamId(teamId: string, users: UserData[]): UserData[] {
  return users.filter((user) => user.teamId === teamId)
}

/** Keep only the tasks that belong to a given project. */
export function filterTasksByProject(projectId: string, tasks: TaskData[]): TaskData[] {
  return tasks.filter((task) => task.projectId === projectId)
}

/** Turn an API status like "In Progress" into the enum key "in_progress". */
export function normalizeTaskStatus(status: string): string {
  return status.toLowerCase().replace(/\s+/g, '_')
}

/** Count how many tasks are in a given status (e.g. "completed"). */
export function countTasksByStatus(tasks: TaskData[], status: string): number {
  const target = normalizeTaskStatus(status)
  return tasks.filter((task) => normalizeTaskStatus(String(task.status)) === target).length
}

/**
 * Turn a due date into a short label + a color.
 * Overdue = red, within a week = amber, otherwise = muted grey.
 */
export function getDueDateInfo(dueDate: string): { text: string; className: string } {
  const days = daysUntil(dueDate)

  if (days < 0) {
    return { text: `${Math.abs(days)}d overdue`, className: 'text-destructive' }
  }
  if (days <= 7) {
    return { text: `${days}d remaining`, className: 'text-warning' }
  }
  return { text: `${days}d remaining`, className: 'text-muted-foreground' }
}

/** Green once the target is reached, otherwise the normal primary color. */
export function getProgressColor(currentProgress: number, targetProgress: number): string {
  return currentProgress >= targetProgress ? 'var(--success)' : 'var(--primary)'
}
