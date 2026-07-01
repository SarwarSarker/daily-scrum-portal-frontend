import type { Project } from '@/types'
import type { ProjectFormValues } from './ProjectFormModal'
import { STATUS_OPTIONS } from './projectFormSchema'

type FormStatus = ProjectFormValues['status']

const VALID_STATUSES = STATUS_OPTIONS.map((option) => option.value) as FormStatus[]

/**
 * The API can return status as a display label ("In Progress") that doesn't
 * match the Select's option values ("in_progress"). Normalise it back to the
 * enum so the field pre-selects correctly when editing.
 */
function normalizeStatus(status: unknown): FormStatus | undefined {
  if (typeof status !== 'string') return undefined
  const normalized = status.trim().toLowerCase().replace(/[\s-]+/g, '_')
  return VALID_STATUSES.includes(normalized as FormStatus)
    ? (normalized as FormStatus)
    : undefined
}

export function projectToDefaults(p: Project): Partial<ProjectFormValues> {
  return {
    name: p.name,
    description: p.description,
    owner: p.owner?.id ? String(p.owner.id) : '',
    teamId: p.team?.id ? String(p.team.id) : p.teamId ? String(p.teamId) : '',
    status: normalizeStatus(p.status),
  }
}
