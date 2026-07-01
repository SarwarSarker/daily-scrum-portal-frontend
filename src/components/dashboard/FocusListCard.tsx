import { Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockProjects } from '@/mock/projects'

export function FocusListCard() {
  // Pick the lowest-progress active project for the headline focus
  const active = mockProjects.filter((p) => p.status !== 'completed')
  const laggard = [...active].sort((a, b) => a.currentProgress - b.currentProgress)[0]

  const items = [
    laggard
      ? `Push ${laggard.projectName} from ${laggard.currentProgress}% to minimum ${Math.min(100, laggard.currentProgress + 15)}%.`
      : 'Identify the lowest-progress project and set a 2-week push goal.',
    'Freeze Notification System architecture.',
    'Lock Meeting Module workflow and UI.',
    'Start QA for completed projects.',
    'Prepare deployment-readiness checklist.',
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="size-4 text-warning" /> Next 7-Day Focus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-md bg-muted/40 px-3 py-2 text-sm">
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
