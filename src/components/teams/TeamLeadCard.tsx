import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import type { User } from '@/types'

export function TeamLeadCard({ lead }: { lead: User }) {
  return (
    <Card className="mb-4 p-3">
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          {lead.avatar && <AvatarImage src={lead.avatar} alt={lead.name} />}
          <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-medium">{lead.name}</p>
          <p className="truncate text-xs text-muted-foreground">{lead.designation}</p>
        </div>
        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          Team Lead
        </span>
      </div>
    </Card>
  )
}
