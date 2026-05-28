import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface Pref {
  id: string
  label: string
  description: string
  email: boolean
  inApp: boolean
}

const initialPrefs: Pref[] = [
  { id: 'scrum-submitted', label: 'Scrum update submitted', description: 'When a teammate logs a daily scrum.', email: true, inApp: true },
  { id: 'blocker-flagged', label: 'New blocker flagged', description: 'Anywhere across your subscribed projects.', email: true, inApp: true },
  { id: 'project-delayed', label: 'Project marked delayed', description: 'Status changes that put a project at risk.', email: false, inApp: true },
  { id: 'task-assigned', label: 'Task assigned to you', description: 'When someone hands you a task.', email: true, inApp: true },
  { id: 'mention', label: 'You\'re mentioned in a comment', description: '@-mentions in tasks or scrum reports.', email: true, inApp: true },
  { id: 'weekly-digest', label: 'Weekly digest', description: 'Friday summary of team activity and risks.', email: true, inApp: false },
]

export function NotificationSettings() {
  const [prefs, setPrefs] = useState(initialPrefs)

  const toggle = (id: string, channel: 'email' | 'inApp') => {
    setPrefs((all) => all.map((p) => (p.id === id ? { ...p, [channel]: !p[channel] } : p)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Pick how you want to hear about scrum activity.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-[1fr_5rem_5rem] items-center gap-3 border-b border-border bg-muted/30 px-6 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Event</span>
          <span className="text-center">Email</span>
          <span className="text-center">In-app</span>
        </div>
        <ul className="divide-y divide-border">
          {prefs.map((p) => (
            <li key={p.id} className="grid grid-cols-[1fr_5rem_5rem] items-center gap-3 px-6 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{p.label}</p>
                <p className="text-xs text-muted-foreground">{p.description}</p>
              </div>
              <div className="flex justify-center">
                <Switch checked={p.email} onCheckedChange={() => toggle(p.id, 'email')} />
              </div>
              <div className="flex justify-center">
                <Switch checked={p.inApp} onCheckedChange={() => toggle(p.id, 'inApp')} />
              </div>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="flex justify-end gap-2 px-6 py-4">
          <Button variant="outline" onClick={() => setPrefs(initialPrefs)}>Reset defaults</Button>
          <Button variant="gradient" onClick={() => toast.success('Notification preferences saved')}>
            Save preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
