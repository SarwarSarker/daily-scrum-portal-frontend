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
import { useProject, useUsers, useTasks } from '@/utils/apiHelper'
import type { UserData, TaskData } from '@/types/api'
import { fmtDate, daysUntil } from '@/lib/date'
import { getInitials, cn } from '@/lib/utils'

// ============================================================================
// TYPES
// ============================================================================

interface TaskCardProps {
  task: TaskData
  users: UserData[]
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Find user by ID
 */
function findUserById(userId: string, users: UserData[]): UserData | undefined {
  return users.find(user => user.id === userId)
}

/**
 * Get users filtered by team ID
 */
function getUsersByTeamId(teamId: string, users: UserData[]): UserData[] {
  return users.filter(user => user.teamId === teamId)
}

/**
 * Filter tasks by project ID
 */
function filterTasksByProject(projectId: string, tasks: TaskData[]): TaskData[] {
  return tasks.filter(task => task.projectId === projectId)
}

/**
 * Count tasks by status
 */
function countTasksByStatus(tasks: TaskData[], status: string): number {
  return tasks.filter(task => task.status === status).length
}

/**
 * Get due date hint text and className
 */
function getDueDateInfo(dueDate: string): { text: string; className: string } {
  const days = daysUntil(dueDate)

  if (days < 0) {
    return {
      text: `${Math.abs(days)}d overdue`,
      className: 'text-destructive',
    }
  }

  if (days <= 7) {
    return {
      text: `${days}d remaining`,
      className: 'text-warning',
    }
  }

  return {
    text: `${days}d remaining`,
    className: 'text-muted-foreground',
  }
}

/**
 * Get progress color based on current vs target progress
 */
function getProgressColor(currentProgress: number, targetProgress: number): string {
  return currentProgress >= targetProgress ? 'var(--success)' : 'var(--primary)'
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

/**
 * Stat card component for metrics display
 */
function ProjectStat({
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
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium">{value}</p>
        {hint && <p className={cn('text-[10px]', hintClassName)}>{hint}</p>}
      </div>
    </div>
  )
}

/**
 * Task card component for task list display
 */
function TaskCard({ task, users }: TaskCardProps) {
  const assignedUser = findUserById(task.assignedTo, users)

  return (
    <Card className="flex items-center gap-3 p-3">
      <Avatar className="size-8">
        {assignedUser?.avatar && (
          <AvatarImage src={assignedUser.avatar} alt={assignedUser.name} />
        )}
        <AvatarFallback>
          {assignedUser ? getInitials(assignedUser.name) : '?'}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{task.title}</p>
        <p className="truncate text-xs text-muted-foreground">{task.description}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <StatusBadge status={task.status} />
        <span className="text-[10px] text-muted-foreground">
          {fmtDate(task.dueDate, 'MMM d')}
        </span>
      </div>
    </Card>
  )
}

/**
 * Metadata row component
 */
function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ProjectDetailsPage() {
  // ============================================================================
  // ROUTE PARAMS
  // ============================================================================
  const { id } = useParams<{ id: string }>()

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  const { data: project, isLoading: isLoadingProject, error: projectError } = useProject(id ?? '')
  const { data: users = [], isLoading: isLoadingUsers } = useUsers()
  const { data: allTasks = [], isLoading: isLoadingTasks } = useTasks()

  // ============================================================================
  // DATA TRANSFORMATION
  // ============================================================================
  const projectTasks = project ? filterTasksByProject(project.id, allTasks) : []
  const completedTasksCount = countTasksByStatus(projectTasks, 'completed')
  const projectOwner = project ? findUserById(project.ownerId, users) : undefined
  const projectTeammates = project ? getUsersByTeamId(project.teamId, users) : []
  const dueDateInfo = project ? getDueDateInfo(project.dueDate ?? '') : { text: '', className: '' }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  const handleEditClick = () => {
    setIsEditModalOpen(true)
  }

  const handleModalClose = () => {
    setIsEditModalOpen(false)
  }

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  if (isLoadingProject || isLoadingUsers || isLoadingTasks) {
    return (
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2" disabled>
          <Link to="/projects">
            <ArrowLeft className="size-4" /> Back to projects
          </Link>
        </Button>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading project details...</div>
        </div>
      </div>
    )
  }

  // ============================================================================
  // ERROR STATE - PROJECT NOT FOUND
  // ============================================================================
  if (projectError || !project) {
    return (
      <Card className="p-10">
        <EmptyState
          title="Project not found"
          description="It may have been deleted or you may not have access."
          action={
            <Button asChild variant="outline">
              <Link to="/projects">
                <ArrowLeft /> Back to projects
              </Link>
            </Button>
          }
        />
      </Card>
    )
  }

  // ============================================================================
  // RENDER DATA
  // ============================================================================
  const progressColor = getProgressColor(project.currentProgress ?? 0, project.targetProgress ?? 100)

  return (
    <>
      {/* Back Navigation */}
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
        <Link to="/projects">
          <ArrowLeft className="size-4" /> Back to projects
        </Link>
      </Button>

      {/* Page Header */}
      <PageHeader
        title={project.name}
        description={project.description}
        actions={
          <>
            <Button variant="outline" onClick={handleEditClick}>
              <Edit3 /> Edit
            </Button>
            <Button variant="gradient">Log scrum update</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-4 xl:col-span-2">
          {/* Status & Risk Card */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>Status & risk</CardTitle>
                <CardDescription>Current state of the project</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={project.status} kind="project" />
                {project.priority && <PriorityBadge priority={project.priority} />}
                {project.riskLevel && <RiskBadge level={project.riskLevel} />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Progress Section */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium tabular-nums">
                      {project.currentProgress ?? 0}% of {project.targetProgress ?? 100}% target
                    </span>
                  </div>
                  <Progress value={project.currentProgress ?? 0} />

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <ProjectStat
                      icon={Target}
                      label="Tasks"
                      value={`${completedTasksCount}/${projectTasks.length}`}
                    />
                    <ProjectStat
                      icon={CalendarDays}
                      label="Due date"
                      value={fmtDate(project.dueDate ?? '', 'MMM d, yyyy')}
                      hint={dueDateInfo.text}
                      hintClassName={dueDateInfo.className}
                    />
                  </div>
                </div>

                {/* Radial Chart */}
                <div className="flex items-center justify-center">
                  <RadialChart
                    value={project.currentProgress ?? 0}
                    label={`${project.currentProgress ?? 0}%`}
                    sublabel="Complete"
                    color={progressColor}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Content */}
          <Tabs defaultValue="scrum">
            <TabsList>
              <TabsTrigger value="scrum">Scrum history</TabsTrigger>
              <TabsTrigger value="tasks">Tasks ({projectTasks.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="scrum">
              <ProjectTimeline projectId={project.id} />
            </TabsContent>

            <TabsContent value="tasks">
              <div className="space-y-2">
                {projectTasks.length === 0 ? (
                  <EmptyState
                    title="No tasks yet"
                    description="Tasks added to this project will appear here."
                  />
                ) : (
                  projectTasks.map((task) => (
                    <TaskCard key={task.id} task={task} users={users} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <EmptyState
                title="Activity feed"
                description="Per-project activity coming in Phase 4."
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Owner & Team Card */}
          <Card>
            <CardHeader>
              <CardTitle>Owner & team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Owner */}
              {projectOwner && (
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    {projectOwner.avatar && (
                      <AvatarImage src={projectOwner.avatar} alt={projectOwner.name} />
                    )}
                    <AvatarFallback>{getInitials(projectOwner.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{projectOwner.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {projectOwner.designation}
                    </p>
                  </div>
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Owner
                  </span>
                </div>
              )}

              {/* Team Members */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Team ({projectTeammates.length})
                </p>
                <UserAvatarGroup users={projectTeammates} max={6} size="md" />
              </div>
            </CardContent>
          </Card>

          {/* Meta Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Meta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <MetaRow
                label="Category"
                value={<span className="capitalize">{project.category || '—'}</span>}
              />
              <MetaRow
                label="Project ID"
                value={<code className="text-xs">{project.id}</code>}
              />
              <MetaRow
                label="Created"
                value={fmtDate(project.createdAt ?? '', 'MMM d, yyyy')}
              />
              <MetaRow
                label="Due"
                value={fmtDate(project.dueDate ?? '', 'MMM d, yyyy')}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modal */}
      <ProjectFormModal
        open={isEditModalOpen}
        onOpenChange={handleModalClose}
        defaultValues={projectToDefaults(project)}
      />
    </>
  )
}
