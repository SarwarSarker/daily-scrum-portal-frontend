import { Mail, Building2, Briefcase } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { RadialChart } from '@/components/charts/RadialChart'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { perfByUser } from '@/mock/performance'
import { teamById, departmentById } from '@/mock/teams'
import { mockTasks } from '@/mock/tasks'
import { mockProjects } from '@/mock/projects'
import { getInitials } from '@/lib/utils'
import { fmtDate } from '@/lib/date'
import type { User } from '@/types'

interface UserProfileDrawerProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserProfileDrawer({ user, open, onOpenChange }: UserProfileDrawerProps) {
  if (!user) return null
  const perf = perfByUser(user.id)
  const team = user.teamId ? teamById(user.teamId) : undefined
  const dept = team ? departmentById(team.departmentId) : undefined
  const myTasks = mockTasks.filter((t) => t.assignedTo === user.id)
  const myProjects = mockProjects.filter((p) => p.ownerId === user.id)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-2xl">
        <SheetHeader>
          <SheetDescription className="text-[10px] uppercase tracking-wider">Profile</SheetDescription>
          <SheetTitle className="text-xl">{user.name}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-6">
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
                <Badge variant="outline" className="capitalize">{user.role.replace('_', ' ')}</Badge>
                <Badge variant={user.status === 'active' ? 'success' : 'secondary'} className="capitalize">
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

          {perf && (
            <Card className="p-5">
              <p className="mb-4 text-sm font-semibold">Performance</p>
              <div className="flex justify-center">
                <RadialChart
                  value={perf.tasksDelivered}
                  max={perf.tasksPlanned}
                  label={`${perf.tasksDelivered}`}
                  sublabel={`of ${perf.tasksPlanned} delivered`}
                  color="var(--chart-3)"
                />
              </div>
            </Card>
          )}

          <Tabs defaultValue="tasks">
            <TabsList>
              <TabsTrigger value="tasks">Tasks ({myTasks.length})</TabsTrigger>
              <TabsTrigger value="projects">Owned projects ({myProjects.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              {myTasks.length === 0 ? (
                <EmptyState title="No assigned tasks" />
              ) : (
                <div className="space-y-2">
                  {myTasks.slice(0, 8).map((t) => (
                    <Card key={t.id} className="flex items-center gap-3 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{t.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{t.description}</p>
                        <Progress value={t.progress} className="mt-2 h-1.5" />
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <PriorityBadge priority={t.priority} />
                        <StatusBadge status={t.status} />
                        <span className="text-[10px] text-muted-foreground">{fmtDate(t.dueDate)}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects">
              {myProjects.length === 0 ? (
                <EmptyState title="No owned projects" />
              ) : (
                <div className="space-y-2">
                  {myProjects.map((p) => (
                    <Card key={p.id} className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium">{p.projectName}</p>
                        <StatusBadge status={p.status} kind="project" />
                      </div>
                      <Progress value={p.currentProgress} className="mt-2 h-1.5" />
                      <p className="mt-1.5 text-[11px] text-muted-foreground">
                        {p.currentProgress}% · Due {fmtDate(p.dueDate, 'MMM d, yyyy')}
                      </p>
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
