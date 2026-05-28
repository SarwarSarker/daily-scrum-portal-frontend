import { CheckCircle2, AlertOctagon, MessageCircle, Flag, Activity } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { activityFeed, type ActivityType } from '@/mocks/activity'
import { userById } from '@/mocks/users'
import { getInitials } from '@/lib/utils'
import { timeAgo } from '@/lib/date'

const iconByType: Record<ActivityType, { Icon: LucideIcon; className: string }> = {
  completion: { Icon: CheckCircle2, className: 'text-success bg-success/10' },
  blocker: { Icon: AlertOctagon, className: 'text-destructive bg-destructive/10' },
  update: { Icon: Activity, className: 'text-info bg-info/10' },
  comment: { Icon: MessageCircle, className: 'text-primary bg-primary/10' },
  risk: { Icon: Flag, className: 'text-warning bg-warning/15' },
}

export function ActivityFeed() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>What's happening across teams</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <ol className="relative space-y-4 p-6">
            <span aria-hidden className="absolute left-[26px] top-2 h-[calc(100%-1rem)] w-px bg-border" />
            {activityFeed.map((a) => {
              const u = userById(a.userId)
              const { Icon, className } = iconByType[a.type]
              return (
                <li key={a.id} className="relative flex gap-3">
                  <div className="relative shrink-0">
                    {u && (
                      <Avatar className="size-9 ring-2 ring-background">
                        {u.avatar && <AvatarImage src={u.avatar} alt={u.name} />}
                        <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                      </Avatar>
                    )}
                    <span
                      className={`absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full ring-2 ring-background ${className}`}
                    >
                      <Icon className="size-3" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{u?.name ?? 'Someone'}</span>{' '}
                      <span className="text-muted-foreground">{a.message}</span>{' '}
                      {a.context && <span className="font-medium">{a.context}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{timeAgo(a.timestamp)}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
