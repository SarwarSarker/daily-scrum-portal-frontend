import { useState } from "react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { TaskRow } from "./TaskRow"
import type { Task } from "@/types"
import type { UserData, ProjectData } from "@/types/api"

interface TaskTableProps {
  tasks: Task[]
  users: UserData[]
  projects: ProjectData[]
  onRowClick?: (task: Task) => void
  onEdit?: (task: Task) => void
  onRemove?: (task: Task) => void
}

export function TaskTable({
  tasks,
  users,
  projects,
  onRowClick,
  onEdit,
  onRemove,
}: TaskTableProps) {
  const [taskToRemove, setTaskToRemove] = useState<Task | null>(null)

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

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
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

            <tbody>
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  users={users}
                  projects={projects}
                  onRowClick={(t) => onRowClick?.(t)}
                  onEdit={(t) => onEdit?.(t)}
                  onRemove={setTaskToRemove}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmDialog
        open={Boolean(taskToRemove)}
        onOpenChange={(open) => !open && setTaskToRemove(null)}
        title={taskToRemove ? `Remove "${taskToRemove.title}"?` : "Remove task?"}
        description="This action cannot be undone."
        confirmText="Remove"
        destructive
        onConfirm={handleConfirmRemove}
      />
    </>
  )
}
