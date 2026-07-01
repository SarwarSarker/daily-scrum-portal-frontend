import { z } from 'zod'

export const UNASSIGNED = '__none__'

export const teamFormSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
  department: z.string().min(2, 'Department is required'),
  leadId: z.string().optional(),
})

export type TeamFormValues = z.infer<typeof teamFormSchema>
