import type { Project } from '@/types'
import { userById } from '@/mocks/users'
import type { ProjectFormValues } from './ProjectFormModal'

export function projectToDefaults(p: Project): Partial<ProjectFormValues> {
  const owner = userById(p.ownerId)
  return {
    projectName: p.projectName,
    description: p.description,
    owner: owner?.name ?? '',
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
