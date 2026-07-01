import { z } from 'zod'

export const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'team_lead', label: 'Team Lead' },
  { value: 'member', label: 'Member' },
] as const

export const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const

export const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  role: z.enum(['admin', 'manager', 'team_lead', 'member']),
  designation: z.string().min(2, 'Designation is required'),
  teamId: z.string().min(1, 'Pick a team'),
  status: z.enum(['active', 'inactive']),
})

export type UserFormValues = z.infer<typeof userFormSchema>
