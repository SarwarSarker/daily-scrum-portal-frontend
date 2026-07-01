import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PRIORITY_OPTIONS, STATUS_OPTIONS, type TaskFormValues } from "./taskFormSchema"
import type { UserData, ProjectData } from "@/types/api"

interface TaskPreviewProps {
  values: TaskFormValues
  projects: ProjectData[]
  users: UserData[]
}

export function TaskPreview({ values, projects, users }: TaskPreviewProps) {
  const project = projects.find(p => p.id === values.projectId)
  const assignedUser = users.find(u => u.name === values.assignedTo)

  const statusLabel = STATUS_OPTIONS.find(s => s.value === values.status)?.label ?? "—"
  const priorityLabel = PRIORITY_OPTIONS.find(p => p.value === values.priority)?.label ?? "—"

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle className="text-base">Task Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <PreviewRow label="Project" value={project?.name ?? "—"} />
        <PreviewRow label="Task" value={values.title || "Not added yet"} />
        <PreviewRow label="Assignee" value={assignedUser?.name || values.assignedTo || "Not assigned"} />
        <PreviewRow label="Priority" value={priorityLabel} />
        <PreviewRow label="Status" value={statusLabel} />
        <div>
          <p className="text-xs font-semibold text-muted-foreground">
            Progress: {values.progress || 0}%
          </p>
          <Progress value={Number(values.progress) || 0} className="mt-1.5 h-1.5" />
        </div>
        <PreviewRow
          label="Timeline"
          value={`${values.startDate || "—"} to ${values.endDate || "—"}`}
        />
      </CardContent>
    </Card>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold">{label}:</span>{" "}
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}
