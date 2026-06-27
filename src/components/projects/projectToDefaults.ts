import type { Project } from '@/types'
import type { ProjectFormValues } from './ProjectFormModal'

export function projectToDefaults(p: Project): Partial<ProjectFormValues> {
  return {
    projectName: p.projectName,
    description: p.description,
    owner: p.ownerId, // Use ownerId directly since we don't have user lookup
    teamId: p.teamId,
    status:
      p.status === 'cancelled' || p.status === 'completed'
        ? 'completed'
        : p.status === 'on_hold'
          ? 'on_hold'
          : p.status === 'continue_development'
            ? 'continue_development'
            : p.status === 'planning'
              ? 'planning'
              : 'in_progress',
  }
}
