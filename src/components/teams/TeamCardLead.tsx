import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import type { User } from "@/types"

export function TeamCardLead({ lead }: { lead?: User }) {
  return (
    <div className="mt-3 flex items-center gap-2.5">
      {lead ? (
        <>
          <Avatar className="size-8 ring-2 ring-background">
            {lead.avatar && <AvatarImage src={lead.avatar} alt={lead.name} />}
            <AvatarFallback className="text-[11px]">
              {getInitials(lead.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium">{lead.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {lead.designation}
            </p>
          </div>
        </>
      ) : (
        <p className="text-sm italic text-muted-foreground">
          No team lead assigned
        </p>
      )}
    </div>
  )
}
