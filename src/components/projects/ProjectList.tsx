import { ProjectCard } from './ProjectCard'
import type { Project } from '@/types'

interface ProjectListProps {
  projects: Project[]
  view: 'grid' | 'list'
  onEdit?: (project: Project) => void
  onRemove?: (project: Project) => void
}

export function ProjectList({ projects, view, onEdit, onRemove }: ProjectListProps) {
  const containerClass =
    view === 'grid'
      ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'
      : 'space-y-3'

  return (
    <div className={containerClass}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}
