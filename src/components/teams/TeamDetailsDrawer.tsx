import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { StatusBadge } from '@/components/common/StatusBadge'
import { RiskBadge } from '@/components/common/RiskBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { mockUsers, userById } from '@/mocks/users'
import { mockProjects } from '@/mocks/projects'
import { departmentById } from '@/mocks/teams'
import { perfByUser } from '@/mocks/performance'
import { getInitials } from '@/lib/utils'
import { fmtDate } from '@/lib/date'
import type { Team } from '@/types'

interface TeamDetailsDrawerProps {
  team: Team | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeamDetailsDrawer({ team, open, onOpenChange }: TeamDetailsDrawerProps) {
  if (!team) return null

  const lead = team.leadId ? userById(team.leadId) : undefined
  const members = mockUsers.filter((u) => u.teamId === team.id)
  const projects = mockProjects.filter((p) => p.teamId === team.id)
  const dept = departmentById(team.departmentId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-2xl">
        <SheetHeader>
          <SheetDescription className="text-[10px] uppercase tracking-wider">
            {dept?.name}
          </SheetDescription>
          <SheetTitle className="text-xl">{team.name}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {lead && (
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
          )}

          <Tabs defaultValue="members">
            <TabsList>
              <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
              <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="members">
              {members.length === 0 ? (
                <EmptyState title="No members yet" />
              ) : (
                <div className="space-y-2">
                  {members.map((u) => {
                    const perf = perfByUser(u.id)
                    return (
                      <Card key={u.id} className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            {u.avatar && <AvatarImage src={u.avatar} alt={u.name} />}
                            <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{u.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{u.designation}</p>
                          </div>
                          <Badge variant="outline" className="capitalize">{u.role.replace('_', ' ')}</Badge>
                        </div>
                        {perf && (
                          <div className="mt-3">
                            <Stat label="Delivered" value={`${perf.tasksDelivered}/${perf.tasksPlanned}`} />
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects">
              {projects.length === 0 ? (
                <EmptyState title="No projects assigned" />
              ) : (
                <div className="space-y-2">
                  {projects.map((p) => (
                    <Card key={p.id} className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium">{p.projectName}</p>
                        <div className="flex gap-1.5">
                          <StatusBadge status={p.status} kind="project" />
                          <RiskBadge level={p.riskLevel} />
                        </div>
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{p.description}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={p.currentProgress} className="h-1.5" />
                        <span className="shrink-0 text-xs font-medium tabular-nums">{p.currentProgress}%</span>
                      </div>
                      <p className="mt-1.5 text-[11px] text-muted-foreground">Due {fmtDate(p.dueDate, 'MMM d, yyyy')}</p>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-2.5 py-1.5">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  )
}
