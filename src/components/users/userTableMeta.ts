import { Badge } from '@/components/ui/badge'
import type { User } from '@/types'

export const roleVariant: Record<User['role'], Parameters<typeof Badge>[0]['variant']> = {
  admin: 'destructive',
  manager: 'warning',
  team_lead: 'info',
  member: 'secondary',
}

export const statusVariant: Record<User['status'], Parameters<typeof Badge>[0]['variant']> = {
  active: 'success',
  inactive: 'secondary',
}
