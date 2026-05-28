import type { Project } from '@/types'
import { userById } from '@/mocks/users'
import type { ProjectFormValues } from './ProjectFormModal'

export function projectToDefaults(p: Project): Partial<ProjectFormValues> {
  const owner = userById(p.ownerId)
  return {
    projectName: p.projectName,
    description: p.description,
    owner: owner?.name ?? '',
    category: p.category,
    currentProgress: p.currentProgress,
    previousProgress: Math.max(0, p.currentProgress - 8),
    endDate: p.dueDate,
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
