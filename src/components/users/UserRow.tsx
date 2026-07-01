import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { perfByUser } from '@/mock/performance'
import { teamById } from '@/mock/teams'
import { getInitials } from '@/lib/utils'
import { UserRowActions } from './UserRowActions'
import { roleVariant, statusVariant } from './userTableMeta'
import type { User } from '@/types'

interface UserRowProps {
  user: User
  onRowClick: (user: User) => void
  onEdit: (user: User) => void
  onRemove: (user: User) => void
}

export function UserRow({ user, onRowClick, onEdit, onRemove }: UserRowProps) {
  const perf = perfByUser(user.id)
  const team = user.teamId ? teamById(user.teamId) : undefined

  return (
    <tr
      onClick={() => onRowClick(user)}
      className="cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/30"
    >
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3">
        <Badge variant={roleVariant[user.role]} className="capitalize">
          {user.role.replace('_', ' ')}
        </Badge>
      </td>
      <td className="px-5 py-3 text-xs text-muted-foreground">{team?.name ?? '—'}</td>
      <td className="px-5 py-3">
        <Badge variant={statusVariant[user.status]} className="capitalize">
          {user.status}
        </Badge>
      </td>
      <td className="px-5 py-3 text-sm tabular-nums">
        {perf ? `${perf.tasksDelivered}/${perf.tasksPlanned}` : '—'}
      </td>
      <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
        <UserRowActions
          onEdit={() => onEdit(user)}
          onOpen={() => onRowClick(user)}
          onRemove={() => onRemove(user)}
        />
      </td>
    </tr>
  )
}
