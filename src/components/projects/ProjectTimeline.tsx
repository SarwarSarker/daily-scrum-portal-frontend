import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { scrumReportsByProject } from '@/mock/scrumReports'
import { userById } from '@/mock/users'
import { getInitials, cn } from '@/lib/utils'

export function ProjectTimeline({ projectId }: { projectId: string }) {
  const reports = scrumReportsByProject(projectId)

  if (reports.length === 0) {
    return <p className="text-sm text-muted-foreground">No scrum updates yet.</p>
  }

  return (
    <ol className="relative space-y-4 pl-6">
      <span aria-hidden className="absolute left-2 top-2 h-[calc(100%-1rem)] w-px bg-border" />
      {reports.map((r) => {
        const u = userById(r.updatedBy)
        const movement = r.weeklyMovement
        const TrendIcon = movement > 0 ? ArrowUp : movement < 0 ? ArrowDown : Minus
        const trendColor = movement > 0 ? 'text-success' : movement < 0 ? 'text-destructive' : 'text-muted-foreground'
        return (
          <li key={r.id} className="relative">
            <span
              aria-hidden
              className="absolute -left-[1.4rem] top-2 size-3 rounded-full border-2 border-background bg-primary"
            />
            <Card className="p-4 transition-shadow hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {u && (
                    <Avatar className="size-8">
                      {u.avatar && <AvatarImage src={u.avatar} alt={u.name} />}
                      <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="leading-tight">
                    <p className="text-sm font-medium">{u?.name ?? 'Someone'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('inline-flex items-center gap-1 text-xs font-semibold', trendColor)}>
                    <TrendIcon className="size-3" /> {movement > 0 ? '+' : ''}{movement}% this week
                  </span>
                  <Badge variant="info">{r.currentProgress}%</Badge>
                </div>
              </div>

              <Progress value={r.currentProgress} className="mt-3" />

              <p className="mt-3 text-sm">{r.todayUpdate}</p>

              {r.blockers && (
                <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-destructive">Blocker</p>
                  <p>{r.blockers}</p>
                </div>
              )}

              {r.remarks && (
                <p className="mt-3 border-l-2 border-border pl-3 text-xs text-muted-foreground">
                  {r.remarks}
                </p>
              )}
            </Card>
          </li>
        )
      })}
    </ol>
  )
}
