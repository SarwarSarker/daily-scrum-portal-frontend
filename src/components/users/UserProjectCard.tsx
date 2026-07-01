import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/common/StatusBadge'
import { fmtDate } from '@/lib/date'
import type { Project } from '@/types'

export function UserProjectCard({ project }: { project: Project }) {
  return (
    <Card className="p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium">{project.projectName}</p>
        <StatusBadge status={project.status} kind="project" />
      </div>
      <Progress value={project.currentProgress} className="mt-2 h-1.5" />
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        {project.currentProgress}% · Due {fmtDate(project.dueDate, 'MMM d, yyyy')}
      </p>
    </Card>
  )
}
