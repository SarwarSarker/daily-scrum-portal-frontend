import { useState } from 'react'
import { toast } from 'sonner'
import { ArrowUpRight, ExternalLink, FolderKanban, MoreHorizontal, Pencil, Trash2, Users as UsersIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserAvatarGroup } from '@/components/common/UserAvatarGroup'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { mockUsers, userById } from '@/mocks/users'
import { mockProjects } from '@/mocks/projects'
import { departmentById } from '@/mocks/teams'
import { getInitials, cn } from '@/lib/utils'
import type { Team } from '@/types'

const deptGlow: Record<string, string> = {
  d_tech: 'gradient-info',
  d_marketing: 'gradient-warning',
  d_business: 'gradient-success',
}

interface TeamCardProps {
  team: Team
  onClick?: () => void
  onEdit?: (team: Team) => void
  onRemove?: (team: Team) => void
}

export function TeamCard({ team, onClick, onEdit, onRemove }: TeamCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const lead = team.leadId ? userById(team.leadId) : undefined
  const members = mockUsers.filter((u) => u.teamId === team.id)
  const projects = mockProjects.filter((p) => p.teamId === team.id)
  const activeProjects = projects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled')
  const department = departmentById(team.departmentId)

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Soft gradient glow accent */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-15 blur-3xl transition-opacity duration-300 group-hover:opacity-30',
          deptGlow[team.departmentId] ?? 'gradient-primary',
        )}
      />

      <div className="relative flex flex-1 flex-col">
        {/* Header — team identity + jump-to-details arrow */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {department?.name}
            </p>
            <h3 className="truncate text-lg font-semibold leading-snug tracking-tight">
              {team.name}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                aria-label="Team actions"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit?.(team)}>
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onClick}>
                <ExternalLink /> Open details
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

        {/* Lead pill */}
        {lead ? (
          <div className="mt-4 flex items-center gap-3">
            <Avatar className="size-10 ring-2 ring-background">
              {lead.avatar && <AvatarImage src={lead.avatar} alt={lead.name} />}
              <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium">{lead.name}</p>
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                  Lead
                </span>
              </div>
              <p className="truncate text-xs text-muted-foreground">{lead.designation}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-xs italic text-muted-foreground">No team lead assigned</p>
        )}

        {/* Big stats row */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Metric icon={UsersIcon} label="Members" value={members.length} tone="primary" />
          <Metric icon={FolderKanban} label="Active" value={activeProjects.length} tone="info" />
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/50 pt-4">
          {members.length > 0 ? (
            <UserAvatarGroup users={members} max={5} />
          ) : (
            <span className="text-xs text-muted-foreground">No members yet</span>
          )}
          <Button variant="ghost" size="sm" onClick={onClick} className="gap-1">
            View
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Remove "${team.name}"?`}
        description="The team and its assignments will be deleted. This action cannot be undone."
        confirmText="Remove"
        destructive
        onConfirm={() => {
          if (onRemove) onRemove(team)
          else toast.success(`Team "${team.name}" removed`)
        }}
      />
    </Card>
  )
}

const toneMap = {
  primary: 'bg-primary/10 text-primary',
  info: 'bg-info/10 text-info',
  success: 'bg-success/10 text-success',
} as const

function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number | string
  tone: keyof typeof toneMap
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-3">
      <div className={cn('grid size-9 shrink-0 place-items-center rounded-lg', toneMap[tone])}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 leading-tight">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-xl font-bold tabular-nums">{value}</p>
      </div>
    </div>
  )
}
