import { Mail, Building2, Briefcase } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { getInitials } from '@/lib/utils'
import type { User, Team, Department } from '@/types'

interface UserProfileHeaderProps {
  user: User
  team?: Team
  dept?: Department
}

export function UserProfileHeader({ user, team, dept }: UserProfileHeaderProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="h-24 gradient-primary" />
      <div className="-mt-10 flex flex-col items-center px-5 pb-5">
        <Avatar className="size-20 ring-4 ring-background">
          {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
          <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <p className="mt-2 text-lg font-semibold">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.designation}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <Badge variant="outline" className="capitalize">
            {user.role.replace('_', ' ')}
          </Badge>
          <Badge
            variant={user.status === 'active' ? 'success' : 'secondary'}
            className="capitalize"
          >
            {user.status}
          </Badge>
        </div>
        <div className="mt-4 grid w-full grid-cols-1 gap-2 text-xs sm:grid-cols-3">
          <InfoChip icon={Mail} text={user.email} />
          {team && <InfoChip icon={Briefcase} text={team.name} />}
          {dept && <InfoChip icon={Building2} text={dept.name} />}
        </div>
      </div>
    </Card>
  )
}

function InfoChip({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>
  text: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 truncate rounded-md border border-border/60 bg-muted/30 px-2 py-1">
      <Icon className="size-3 shrink-0" />
      <span className="truncate">{text}</span>
    </span>
  )
}
