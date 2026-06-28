import { useState } from "react"
import { toast } from "sonner"
import { MoreHorizontal, Pencil, ExternalLink, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/common/StatusBadge"
import { PriorityBadge } from "@/components/common/PriorityBadge"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { fmtDate, daysUntil } from "@/lib/date"
import { getInitials, cn } from "@/lib/utils"
import type { Task } from "@/types"
import type { UserData, ProjectData } from "@/types/api"

// ============================================================================
// TYPES
// ============================================================================

interface TaskTableProps {
  /** Array of tasks to display */
  tasks: Task[]
  /** Array of users for assignee lookup */
  users: UserData[]
  /** Array of projects for project lookup */
  projects: ProjectData[]
  /** Callback when a task row is clicked */
  onRowClick?: (task: Task) => void
  /** Callback when edit action is triggered */
  onEdit?: (task: Task) => void
  /** Callback when remove action is triggered */
  onRemove?: (task: Task) => void
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Finds the assigned user for a task
 */
function findAssignedUser(task: Task, users: UserData[]): UserData | undefined {
  return users.find(user => user.id === task.assignedTo)
}

/**
 * Finds the project for a task
 */
function findTaskProject(task: Task, projects: ProjectData[]): ProjectData | undefined {
  return projects.find(project => project.id === task.projectId)
}

/**
 * Determines if a task is overdue
 */
function isTaskOverdue(task: Task): boolean {
  const daysUntilDue = daysUntil(task.end_date)
  return daysUntilDue < 0 && task.status !== "completed"
}

/**
 * Gets the CSS classes for due date cell based on overdue status
 */
function getDueDateClasses(isOverdue: boolean): string {
  return cn(
    "px-5 py-3 text-xs whitespace-nowrap",
    isOverdue
      ? "text-destructive font-medium"
      : "text-muted-foreground"
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TaskTable({
  tasks,
  users,
  projects,
  onRowClick,
  onEdit,
  onRemove,
}: TaskTableProps) {
  // ============================================================================
  // STATE
  // ============================================================================
  const [taskToRemove, setTaskToRemove] = useState<Task | null>(null)

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  const handleRowClick = (task: Task) => {
    onRowClick?.(task)
  }

  const handleEditClick = (task: Task) => {
    onEdit?.(task)
  }

  const handleRemoveClick = (task: Task) => {
    setTaskToRemove(task)
  }

  const handleConfirmRemove = () => {
    if (taskToRemove) {
      if (onRemove) {
        onRemove(taskToRemove)
      } else {
        toast.success(`Task "${taskToRemove.title}" removed`)
      }
    }
    setTaskToRemove(null)
  }

  const handleCloseDialog = () => {
    setTaskToRemove(null)
  }

  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <>
      {/* Tasks Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-medium">Task</th>
                <th className="px-5 py-3 text-left font-medium">Project</th>
                <th className="px-5 py-3 text-left font-medium">Assignee</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Priority</th>
                <th className="px-5 py-3 text-left font-medium">Progress</th>
                <th className="px-5 py-3 text-left font-medium">Due</th>
                <th className="px-3 py-3 text-right font-medium" />
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {tasks.map((task) => {
                // Look up related data
                const assignedUser = findAssignedUser(task, users)
                const project = findTaskProject(task, projects)
                const overdue = isTaskOverdue(task)

                return (
                  <tr
                    key={task.id}
                    onClick={() => handleRowClick(task)}
                    className="group cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/30"
                  >
                    {/* Task Title */}
                    <td className="px-5 py-3">
                      <p className="font-medium">{task.title}</p>
                    </td>

                    {/* Project Name */}
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {project?.name || "—"}
                    </td>

                    {/* Assignee */}
                    <td className="px-5 py-3">
                      {assignedUser ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="size-7">
                            {assignedUser.avatar && (
                              <AvatarImage
                                src={assignedUser.avatar}
                                alt={assignedUser.name}
                              />
                            )}
                            <AvatarFallback>
                              {getInitials(assignedUser.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{assignedUser.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Unassigned</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-3">
                      <StatusBadge status={task.status} />
                    </td>

                    {/* Priority Badge */}
                    <td className="px-5 py-3">
                      <PriorityBadge priority={task.priority} />
                    </td>

                    {/* Progress Bar */}
                    <td className="px-5 py-3 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <Progress value={task.progress} className="h-1.5 w-20" />
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {task.progress}%
                        </span>
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className={getDueDateClasses(overdue)}>
                      {fmtDate(task.end_date, "MMM d, yyyy")}
                    </td>

                    {/* Action Menu */}
                    <td
                      className="px-3 py-3 text-right"
                      onClick={stopPropagation}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            aria-label="Task actions"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => handleEditClick(task)}>
                            <Pencil /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRowClick(task)}>
                            <ExternalLink /> Open details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleRemoveClick(task)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(taskToRemove)}
        onOpenChange={(open) => !open && handleCloseDialog()}
        title={taskToRemove ? `Remove "${taskToRemove.title}"?` : "Remove task?"}
        description="This action cannot be undone."
        confirmText="Remove"
        destructive
        onConfirm={handleConfirmRemove}
      />
    </>
  )
}
