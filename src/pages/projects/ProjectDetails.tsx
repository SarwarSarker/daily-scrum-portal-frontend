import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Edit3, Target } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { RiskBadge } from '@/components/common/RiskBadge'
import { UserAvatarGroup } from '@/components/common/UserAvatarGroup'
import { EmptyState } from '@/components/common/EmptyState'
import { ProjectTimeline } from '@/components/projects/ProjectTimeline'
import { ProjectFormModal } from '@/components/projects/ProjectFormModal'
import { projectToDefaults } from '@/components/projects/projectToDefaults'
import { RadialChart } from '@/components/charts/RadialChart'
import { projectById } from '@/mock/projects'
import { tasksByProject } from '@/mock/tasks'
import { mockUsers, userById } from '@/mock/users'
import { fmtDate, daysUntil } from '@/lib/date'
import { getInitials, cn } from '@/lib/utils'

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const project = id ? projectById(id) : undefined
  const [editOpen, setEditOpen] = useState(false)

  if (!project) {
    return (
      <Card className="p-10">
        <EmptyState
          title="Project not found"
          description="It may have been deleted or you may not have access."
          action={
            <Button asChild variant="outline">
              <Link to="/projects"><ArrowLeft /> Back to projects</Link>
            </Button>
          }
        />
      </Card>
    )
  }

  const owner = userById(project.ownerId)
  const teammates = mockUsers.filter((u) => u.teamId === project.teamId)
  const tasks = tasksByProject(project.id)
  const completedTasks = tasks.filter((t) => t.status === 'completed').length
  const days = daysUntil(project.dueDate)

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link to="/projects"><ArrowLeft className="size-4" /> Back to projects</Link>
      </Button>

      <PageHeader
        title={project.projectName}
        description={project.description}
        actions={
          <>
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Edit3 /> Edit
            </Button>
            <Button variant="gradient">Log scrum update</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>Status & risk</CardTitle>
                <CardDescription>Current state of the project</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={project.status} kind="project" />
                <PriorityBadge priority={project.priority} />
                <RiskBadge level={project.riskLevel} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium tabular-nums">
                      {project.currentProgress}% of {project.targetProgress}% target
                    </span>
                  </div>
                  <Progress value={project.currentProgress} />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Stat icon={Target} label="Tasks" value={`${completedTasks}/${tasks.length}`} />
                    <Stat
                      icon={CalendarDays}
                      label="Due date"
                      value={fmtDate(project.dueDate, 'MMM d, yyyy')}
                      hint={days < 0 ? `${Math.abs(days)}d overdue` : `${days}d remaining`}
                      hintClassName={days < 0 ? 'text-destructive' : days < 7 ? 'text-warning' : 'text-muted-foreground'}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <RadialChart
                    value={project.currentProgress}
                    label={`${project.currentProgress}%`}
                    sublabel="Complete"
                    color={
                      project.currentProgress >= project.targetProgress
                        ? 'var(--success)'
                        : 'var(--primary)'
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="scrum">
            <TabsList>
              <TabsTrigger value="scrum">Scrum history</TabsTrigger>
              <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="scrum">
              <ProjectTimeline projectId={project.id} />
            </TabsContent>

            <TabsContent value="tasks">
              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <EmptyState title="No tasks yet" description="Tasks added to this project will appear here." />
                ) : (
                  tasks.map((t) => {
                    const u = userById(t.assignedTo)
                    return (
                      <Card key={t.id} className="flex items-center gap-3 p-3">
                        <Avatar className="size-8">
                          {u?.avatar && <AvatarImage src={u.avatar} alt={u.name} />}
                          <AvatarFallback>{u ? getInitials(u.name) : '?'}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{t.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{t.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <StatusBadge status={t.status} />
                          <span className="text-[10px] text-muted-foreground">{fmtDate(t.dueDate)}</span>
                        </div>
                      </Card>
                    )
                  })
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <EmptyState title="Activity feed" description="Per-project activity coming in Phase 4." />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Owner & team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {owner && (
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    {owner.avatar && <AvatarImage src={owner.avatar} alt={owner.name} />}
                    <AvatarFallback>{getInitials(owner.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{owner.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{owner.designation}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Owner
                  </span>
                </div>
              )}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Team ({teammates.length})
                </p>
                <UserAvatarGroup users={teammates} max={6} size="md" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <MetaRow label="Category" value={<span className="capitalize">{project.category}</span>} />
              <MetaRow label="Project ID" value={<code className="text-xs">{project.id}</code>} />
              <MetaRow label="Created" value={fmtDate('2026-05-01', 'MMM d, yyyy')} />
              <MetaRow label="Due" value={fmtDate(project.dueDate, 'MMM d, yyyy')} />
            </CardContent>
          </Card>
        </div>
      </div>

      <ProjectFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        defaultValues={projectToDefaults(project)}
      />
    </>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  hintClassName,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  hint?: string
  hintClassName?: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border/60 p-3">
      <Icon className="mt-0.5 size-4 text-muted-foreground" />
      <div className="leading-tight">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
        {hint && <p className={cn('text-[10px]', hintClassName)}>{hint}</p>}
      </div>
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
