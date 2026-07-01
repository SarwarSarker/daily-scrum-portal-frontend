import { daysUntil } from "@/lib/date"
import { cn } from "@/lib/utils"
import type { Task } from "@/types"
import type { UserData, ProjectData } from "@/types/api"

export function findAssignedUser(task: Task, users: UserData[]): UserData | undefined {
  return users.find(user => user.id === task.assignedTo)
}

export function findTaskProject(task: Task, projects: ProjectData[]): ProjectData | undefined {
  return projects.find(project => project.id === task.projectId)
}

export function isTaskOverdue(task: Task): boolean {
  const daysUntilDue = daysUntil(task.end_date)
  return daysUntilDue < 0 && task.status !== "completed"
}

export function getDueDateClasses(isOverdue: boolean): string {
  return cn(
    "px-5 py-3 text-xs whitespace-nowrap",
    isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
  )
}
