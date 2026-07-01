import { ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserAvatarGroup } from "@/components/common/UserAvatarGroup"
import { mockUsers, userById } from "@/mock/users"
import { mockProjects } from "@/mock/projects"
import { departmentById } from "@/mock/teams"
import { cn } from "@/lib/utils"
import { TeamCardActions } from "./TeamCardActions"
import { TeamCardLead } from "./TeamCardLead"
import { TeamCardStats } from "./TeamCardStats"
import { getDeptTheme } from "./teamCardThemes"
import type { Team } from "@/types"

interface TeamCardProps {
  team: Team
  onClick?: () => void
  onEdit?: (team: Team) => void
  onRemove?: (team: Team) => void
}

export function TeamCard({ team, onClick, onEdit, onRemove }: TeamCardProps) {
  const lead = team.leadId ? userById(team.leadId) : undefined
  const members = mockUsers.filter((u) => u.teamId === team.id)
  const projects = mockProjects.filter((p) => p.teamId === team.id)
  const activeProjects = projects.filter((p) => p.status !== "completed")
  const department = departmentById(team.departmentId)
  const theme = getDeptTheme(team.departmentId)

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
              theme.badge,
            )}
          >
            <span className={cn("size-1.5 rounded-full", theme.bar)} />
            {department?.name}
          </span>
          <TeamCardActions
            team={team}
            onOpen={onClick}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        </div>

        <h3 className="mt-3 truncate text-lg font-semibold tracking-tight">
          {team.name}
        </h3>

        <TeamCardLead lead={lead} />

        <TeamCardStats
          memberCount={members.length}
          activeProjects={activeProjects.length}
          totalProjects={projects.length}
          theme={theme}
        />

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/50 pt-4">
          {members.length > 0 ? (
            <UserAvatarGroup users={members} max={5} />
          ) : (
            <span className="text-xs text-muted-foreground">No members yet</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className="gap-1 hover:text-foreground"
          >
            View
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
