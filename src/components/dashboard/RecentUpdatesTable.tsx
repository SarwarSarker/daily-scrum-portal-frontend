import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { PriorityBadge } from '@/components/common/PriorityBadge'
import { mockProjects } from '@/mock/projects'
import { userById } from '@/mock/users'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { fmtDate } from '@/lib/date'

export function RecentUpdatesTable() {
  const projects = [...mockProjects].slice(0, 6)

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Recent project updates</CardTitle>
          <CardDescription>Latest progress reported across teams</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/projects" className="gap-1">
            View all <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3 text-left font-medium">Project</th>
                <th className="px-6 py-3 text-left font-medium">Owner</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Priority</th>
                <th className="px-6 py-3 text-left font-medium">Progress</th>
                <th className="px-6 py-3 text-left font-medium">Due</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const owner = userById(p.ownerId)
                return (
                  <tr key={p.id} className="border-b border-border/60 transition-colors hover:bg-muted/30">
                    <td className="px-6 py-3">
                      <Link to={`/projects/${p.id}`} className="font-medium hover:text-primary">
                        {p.projectName}
                      </Link>
                      <p className="line-clamp-1 text-xs text-muted-foreground">{p.description}</p>
                    </td>
                    <td className="px-6 py-3">
                      {owner && (
                        <div className="flex items-center gap-2">
                          <Avatar className="size-7">
                            {owner.avatar && <AvatarImage src={owner.avatar} alt={owner.name} />}
                            <AvatarFallback>{getInitials(owner.name)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{owner.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3"><StatusBadge status={p.status} kind="project" /></td>
                    <td className="px-6 py-3"><PriorityBadge priority={p.priority} /></td>
                    <td className="px-6 py-3 min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <Progress value={p.currentProgress} className="h-1.5 w-24" />
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {p.currentProgress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {fmtDate(p.dueDate, 'MMM d, yyyy')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
