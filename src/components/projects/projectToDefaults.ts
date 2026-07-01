import type { Project } from '@/types'
import type { ProjectFormValues } from './ProjectFormModal'

export function projectToDefaults(p: Project): Partial<ProjectFormValues> {
  return {
    name: p.name,
    description: p.description,
    owner: p.owner?.id ? String(p.owner.id) : '',
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
