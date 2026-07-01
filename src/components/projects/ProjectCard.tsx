import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserAvatarGroup } from '@/components/common/UserAvatarGroup'
import { cn } from '@/lib/utils'
import { ProjectCardActions } from './ProjectCardActions'
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
  const members = project.members ?? []

  return (
    <Card
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300',
        'hover:-translate-y-1 hover:shadow-lg',
      )}
    >
      <div className="relative flex flex-1 flex-col space-y-3 p-6">
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

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            {members.length > 0 ? (
              <UserAvatarGroup users={members} max={4} />
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                {teamName}
              </span>
            )}
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Link to={`/projects/${project.id}`}>
              View <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
