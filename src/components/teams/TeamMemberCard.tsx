import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/lib/utils'
import { perfByUser } from '@/mock/performance'
import type { User } from '@/types'

export function TeamMemberCard({ user }: { user: User }) {
  const perf = perfByUser(user.id)

  return (
    <Card className="p-3">
      <div className="flex items-center gap-3">
        <Avatar className="size-9">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.designation}</p>
        </div>
        <Badge variant="outline" className="capitalize">
          {user.role.replace('_', ' ')}
        </Badge>
      </div>
      {perf && (
        <div className="mt-3">
          <Stat label="Delivered" value={`${perf.tasksDelivered}/${perf.tasksPlanned}`} />
        </div>
      )}
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-2.5 py-1.5">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  )
}
