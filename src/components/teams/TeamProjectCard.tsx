import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/common/StatusBadge'
import { RiskBadge } from '@/components/common/RiskBadge'
import { fmtDate } from '@/lib/date'
import type { Project } from '@/types'

export function TeamProjectCard({ project }: { project: Project }) {
  return (
    <Card className="p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium">{project.projectName}</p>
        <div className="flex gap-1.5">
          <StatusBadge status={project.status} kind="project" />
          <RiskBadge level={project.riskLevel} />
        </div>
      </div>
      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{project.description}</p>
      <div className="mt-3 flex items-center gap-3">
        <Progress value={project.currentProgress} className="h-1.5" />
        <span className="shrink-0 text-xs font-medium tabular-nums">
          {project.currentProgress}%
        </span>
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        Due {fmtDate(project.dueDate, 'MMM d, yyyy')}
      </p>
    </Card>
  )
}
