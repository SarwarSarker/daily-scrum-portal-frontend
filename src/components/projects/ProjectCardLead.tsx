import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import type { ProjectOwner } from '@/types'

export function ProjectCardLead({ owner }: { owner: ProjectOwner }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-8 ring-2 ring-border">
        <AvatarImage
          src={owner.avatar || `https://i.pravatar.cc/150?u=${owner.id}`}
          alt={owner.name}
        />
        <AvatarFallback className="bg-indigo-500 text-sm font-semibold text-white">
          {getInitials(owner.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="truncate text-sm font-medium">{owner.name}</span>
        <span className="truncate text-xs text-muted-foreground">Project Lead</span>
      </div>
    </div>
  )
}
