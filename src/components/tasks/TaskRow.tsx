import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/common/StatusBadge"
import { PriorityBadge } from "@/components/common/PriorityBadge"
import { fmtDate } from "@/lib/date"
import { getInitials } from "@/lib/utils"
import { TaskRowActions } from "./TaskRowActions"
import {
  findAssignedUser,
  findTaskProject,
  isTaskOverdue,
  getDueDateClasses,
} from "./taskTableHelpers"
import type { Task } from "@/types"
import type { UserData, ProjectData } from "@/types/api"

interface TaskRowProps {
  task: Task
  users: UserData[]
  projects: ProjectData[]
  onRowClick: (task: Task) => void
  onEdit: (task: Task) => void
  onRemove: (task: Task) => void
}

export function TaskRow({
  task,
  users,
  projects,
  onRowClick,
  onEdit,
  onRemove,
}: TaskRowProps) {
  const assignedUser = findAssignedUser(task, users)
  const project = findTaskProject(task, projects)
  const overdue = isTaskOverdue(task)

  return (
    <tr
      onClick={() => onRowClick(task)}
      className="group cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/30"
    >
      <td className="px-5 py-3">
        <p className="font-medium">{task.title}</p>
      </td>

      <td className="px-5 py-3 text-xs text-muted-foreground">
        {project?.name || "—"}
      </td>

      <td className="px-5 py-3">
        {assignedUser ? (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              {assignedUser.avatar && (
                <AvatarImage src={assignedUser.avatar} alt={assignedUser.name} />
              )}
              <AvatarFallback>{getInitials(assignedUser.name)}</AvatarFallback>
            </Avatar>
            <span className="text-xs">{assignedUser.name}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Unassigned</span>
        )}
      </td>

      <td className="px-5 py-3">
        <StatusBadge status={task.status} />
      </td>

      <td className="px-5 py-3">
        <PriorityBadge priority={task.priority} />
      </td>

      <td className="px-5 py-3 min-w-[140px]">
        <div className="flex items-center gap-2">
          <Progress value={task.progress} className="h-1.5 w-20" />
          <span className="text-xs tabular-nums text-muted-foreground">
            {task.progress}%
          </span>
        </div>
      </td>

      <td className={getDueDateClasses(overdue)}>
        {fmtDate(task.end_date, "MMM d, yyyy")}
      </td>

      <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
        <TaskRowActions
          onEdit={() => onEdit(task)}
          onOpen={() => onRowClick(task)}
          onRemove={() => onRemove(task)}
        />
      </td>
    </tr>
  )
}
