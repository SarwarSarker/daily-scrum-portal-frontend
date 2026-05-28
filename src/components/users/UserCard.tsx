import { useState } from 'react'
import { toast } from 'sonner'
import { ExternalLink, Mail, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { perfByUser } from '@/mocks/performance'
import { teamById } from '@/mocks/teams'
import { getInitials } from '@/lib/utils'
import type { User } from '@/types'

interface UserCardProps {
  user: User
  onClick?: () => void
  onEdit?: (user: User) => void
  onRemove?: (user: User) => void
}

export function UserCard({ user, onClick, onEdit, onRemove }: UserCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
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
            <Badge variant="outline" className="capitalize">{user.role.replace('_', ' ')}</Badge>
            {team && <Badge variant="secondary">{team.name}</Badge>}
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                aria-label="User actions"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onEdit?.(user)}>
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onClick}>
                <ExternalLink /> Open profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setConfirmOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 /> Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Mail className="size-3.5" />
        <span className="truncate">{user.email}</span>
      </div>

      {perf && (
        <div className="mt-4 space-y-2 border-t border-border/60 pt-4 text-xs">
          <Bar label="Contribution" value={perf.contribution * 5} hint={`${perf.contribution}%`} />
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Remove ${user.name}?`}
        description="They'll lose access to the workspace immediately. This action cannot be undone."
        confirmText="Remove"
        destructive
        onConfirm={() => {
          if (onRemove) onRemove(user)
          else toast.success(`${user.name} removed`)
        }}
      />
    </Card>
  )
}

function Bar({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{hint ?? `${value}%`}</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  )
}
