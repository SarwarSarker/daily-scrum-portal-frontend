import { useState } from 'react'
import { toast } from 'sonner'
import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { perfByUser } from '@/mock/performance'
import { teamById } from '@/mock/teams'
import { getInitials } from '@/lib/utils'
import type { User } from '@/types'

const roleVariant: Record<User['role'], Parameters<typeof Badge>[0]['variant']> = {
  admin: 'destructive',
  manager: 'warning',
  team_lead: 'info',
  member: 'secondary',
}

const statusVariant: Record<User['status'], Parameters<typeof Badge>[0]['variant']> = {
  active: 'success',
  inactive: 'secondary',
}

interface UserTableProps {
  users: User[]
  onRowClick?: (user: User) => void
  onEdit?: (user: User) => void
  onRemove?: (user: User) => void
}

export function UserTable({ users, onRowClick, onEdit, onRemove }: UserTableProps) {
  const [removing, setRemoving] = useState<User | null>(null)

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-medium">User</th>
                <th className="px-5 py-3 text-left font-medium">Role</th>
                <th className="px-5 py-3 text-left font-medium">Team</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Delivered</th>
                <th className="px-3 py-3 text-right font-medium" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const perf = perfByUser(u.id)
                const team = u.teamId ? teamById(u.teamId) : undefined
                return (
                  <tr
                    key={u.id}
                    onClick={() => onRowClick?.(u)}
                    className="cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          {u.avatar && <AvatarImage src={u.avatar} alt={u.name} />}
                          <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={roleVariant[u.role]} className="capitalize">
                        {u.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{team?.name ?? '—'}</td>
                    <td className="px-5 py-3">
                      <Badge variant={statusVariant[u.status]} className="capitalize">{u.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-sm tabular-nums">
                      {perf ? `${perf.tasksDelivered}/${perf.tasksPlanned}` : '—'}
                    </td>
                    <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            aria-label="User actions"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => onEdit?.(u)}>
                            <Pencil /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onRowClick?.(u)}>
                            <ExternalLink /> Open profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setRemoving(u)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(o) => !o && setRemoving(null)}
        title={removing ? `Remove ${removing.name}?` : 'Remove user?'}
        description="They'll lose access to the workspace immediately. This action cannot be undone."
        confirmText="Remove"
        destructive
        onConfirm={() => {
          if (removing) {
            if (onRemove) onRemove(removing)
            else toast.success(`${removing.name} removed`)
          }
          setRemoving(null)
        }}
      />
    </>
  )
}
