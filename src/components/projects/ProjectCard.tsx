import { Link } from 'react-router-dom'
import { ArrowUpRight, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ProjectCardActions } from './ProjectCardActions'
import { ProjectCardLead } from './ProjectCardLead'
import { getPillMeta, truncateWords } from './projectCardMeta'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
  onRemove?: (project: Project) => void
}

export function ProjectCard({ project, onEdit, onRemove }: ProjectCardProps) {
  const pill = getPillMeta(project)
  const teamName = project.team?.name || `Team ${project.teamId}`

  return (
    <Card
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-lg',
      )}
    >
      <div className="relative space-y-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${pill.color}1a`, color: pill.color }}
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: pill.color }}
            />
            {pill.label}
          </span>

          <ProjectCardActions project={project} onEdit={onEdit} onRemove={onRemove} />
        </div>

        <div className="mb-6">
          <Link to={`/projects/${project.id}`} className="block">
            <h3 className="truncate text-lg font-semibold tracking-tight">
              {project.name}
            </h3>
          </Link>

          {project.description && (
            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {truncateWords(project.description, 150)}
            </p>
          )}
        </div>

        {project.owner && <ProjectCardLead owner={project.owner} />}

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <span className="grid size-6 place-items-center rounded-full bg-indigo-500">
              <Users className="size-3 text-white" />
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-foreground">
                {teamName}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Team
              </span>
            </div>
          </div>

          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </Card>
  )
}
