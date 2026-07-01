import { Mail } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { perfByUser } from '@/mock/performance'
import { teamById } from '@/mock/teams'
import { getInitials } from '@/lib/utils'
import { UserCardActions } from './UserCardActions'
import { PerfBar } from './PerfBar'
import type { User } from '@/types'

interface UserCardProps {
  user: User
  onClick?: () => void
  onEdit?: (user: User) => void
  onRemove?: (user: User) => void
}

export function UserCard({ user, onClick, onEdit, onRemove }: UserCardProps) {
  const team = user.teamId ? teamById(user.teamId) : undefined
  const perf = perfByUser(user.id)

  return (
    <Card
      onClick={onClick}
      className="group relative cursor-pointer p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <Avatar className="size-14 ring-2 ring-background">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
          <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{user.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{user.designation}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant="outline" className="capitalize">
              {user.role.replace('_', ' ')}
            </Badge>
            {team && <Badge variant="secondary">{team.name}</Badge>}
          </div>
        </div>

        <UserCardActions
          user={user}
          onOpen={onClick}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Mail className="size-3.5" />
        <span className="truncate">{user.email}</span>
      </div>

      {perf && (
        <div className="mt-4 space-y-2 border-t border-border/60 pt-4 text-xs">
          <PerfBar
            label="Contribution"
            value={perf.contribution * 5}
            hint={`${perf.contribution}%`}
          />
        </div>
      )}
    </Card>
  )
}
