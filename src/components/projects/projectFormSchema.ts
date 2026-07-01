import { z } from 'zod'
import type { CreateProjectData } from '@/types/api'

export const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'continue_development', label: 'Continue Development' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
] as const

export const DEFAULT_STATUS = 'in_progress'

export const projectFormSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().max(280, 'Keep it under 280 characters').optional(),
  owner: z.string().min(1, 'Owner is required'),
  teamId: z.string().min(1, 'Team is required'),
  status: z.enum([
    'planning',
    'in_progress',
    'continue_development',
    'on_hold',
    'completed',
  ]),
  blocker: z.string().optional(),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>

export function transformToApiPayload(
  formValues: ProjectFormValues,
  currentUserId: string
): CreateProjectData {
  return {
    name: formValues.name,
    owner_id: parseInt(formValues.owner),
    team_id: parseInt(formValues.teamId),
    created_by: parseInt(currentUserId),
    status: formValues.status,
    description: formValues.description || '',
    blocker: formValues.blocker || '',
  }
}

export function getDefaultFormValues(
  teams: Array<{ id: string }>
): Partial<ProjectFormValues> {
  return {
    name: '',
    description: '',
    owner: '',
    teamId: teams[0]?.id ?? '',
    status: DEFAULT_STATUS,
    blocker: '',
  }
}
