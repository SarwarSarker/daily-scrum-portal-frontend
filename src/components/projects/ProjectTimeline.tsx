import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { EmptyState } from '@/components/common/EmptyState'
import { getInitials, cn } from '@/lib/utils'
import { useUsers } from '@/utils/apiHelper'
import type { UserData } from '@/types/api'

interface ScrumReport {
  id: string
  projectId: string
  updatedBy: string
  currentProgress: number
  weeklyMovement: number
  todayUpdate: string
  blockers?: string
  remarks?: string
  timestamp: string
}

interface ProjectTimelineProps {
  /** Project ID to fetch timeline for */
  projectId: string
}

function getMockScrumReports(projectId: string): ScrumReport[] {
  // TODO: Use projectId to fetch real scrum reports from API
  // For now, return empty array - scrum reports feature coming later
  console.log('Fetching scrum reports for project:', projectId)
  return []
}

/**
 * Find user by ID from users array
 */
function findUserById(userId: string, users: UserData[]): UserData | undefined {
  return users.find(user => user.id === userId)
}

/**
 * Get trend color class based on movement value
 */
function getTrendColor(movement: number): string {
  if (movement > 0) return 'text-success'
  if (movement < 0) return 'text-destructive'
  return 'text-muted-foreground'
}

/**
 * Format movement text with sign
 */
function formatMovementText(movement: number): string {
  const sign = movement > 0 ? '+' : ''
  return `${sign}${movement}% this week`
}

/**
 * Single timeline item component
 */
function TimelineItem({
  report,
  user,
}: {
  report: ScrumReport
  user: UserData | undefined
}) {
  const trendColor = getTrendColor(report.weeklyMovement)
  const movementText = formatMovementText(report.weeklyMovement)

  return (
    <li className="relative">
      {/* Timeline dot */}
      <span
        aria-hidden
        className="absolute left-[-1.4rem] top-2 size-3 rounded-full border-2 border-background bg-primary"
      />

      {/* Timeline Card */}
      <Card className="p-4 transition-shadow hover:shadow-md">
        {/* Header: User and Progress */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          {/* User Info */}
          <div className="flex items-center gap-3">
            {user && (
              <Avatar className="size-8">
                {user.avatar && (
                  <AvatarImage src={user.avatar} alt={user.name} />
                )}
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            )}
            <div className="leading-tight">
              <p className="text-sm font-medium">
                {user?.name ?? 'Someone'}
              </p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs font-semibold',
                trendColor
              )}
            >
              {report.weeklyMovement > 0 ? (
                <ArrowUp className="size-3" />
              ) : report.weeklyMovement < 0 ? (
                <ArrowDown className="size-3" />
              ) : (
                <Minus className="size-3" />
              )}
              {movementText}
            </span>
            <Badge variant="info">{report.currentProgress}%</Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={report.currentProgress} className="mt-3" />

        {/* Update Text */}
        <p className="mt-3 text-sm">{report.todayUpdate}</p>

        {/* Blocker Alert */}
        {report.blockers && (
          <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-destructive">
              Blocker
            </p>
            <p>{report.blockers}</p>
          </div>
        )}

        {/* Remarks */}
        {report.remarks && (
          <p className="mt-3 border-l-2 border-border pl-3 text-xs text-muted-foreground">
            {report.remarks}
          </p>
        )}
      </Card>
    </li>
  )
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const { data: users = [] } = useUsers()

  // TODO: Replace with real API call when scrum reports endpoint is available
  const reports = getMockScrumReports(projectId)

  if (reports.length === 0) {
    return (
      <EmptyState
        title="No scrum updates yet"
        description="Scrum history will appear here once updates are logged."
      />
    )
  }

  return (
    <ol className="relative space-y-4 pl-6">
      {/* Timeline Line */}
      <span
        aria-hidden
        className="absolute left-2 top-2 h-[calc(100%-1rem)] w-px bg-border"
      />

      {/* Timeline Items */}
      {reports.map((report) => {
        const user = findUserById(report.updatedBy, users)
        return <TimelineItem key={report.id} report={report} user={user} />
      })}
    </ol>
  )
}
