import type { ProjectFiltersValue } from './ProjectFilters'
import type { Project } from '@/types'

export function filterProjects(
  projects: Project[],
  filters: ProjectFiltersValue
): Project[] {
  return projects.filter((project) => {
    if (filters.category !== 'all' && project.category !== filters.category) {
      return false
    }

    if (filters.status !== 'all' && project.status !== filters.status) {
      return false
    }

    if (filters.priority !== 'all' && project.priority !== filters.priority) {
      return false
    }

    if (filters.query) {
      const query = filters.query.toLowerCase()
      const matchesName = project.name.toLowerCase().includes(query)
      const matchesDescription = project.description.toLowerCase().includes(query)

      if (!matchesName && !matchesDescription) {
        return false
      }
    }

    return true
  })
}
