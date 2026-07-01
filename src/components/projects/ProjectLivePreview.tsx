import { useWatch, type Control } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { STATUS_OPTIONS, type ProjectFormValues } from './projectFormSchema'

interface ProjectLivePreviewProps {
  control: Control<ProjectFormValues>
  teams: Array<{ id: string; name: string }>
  users: Array<{ id: string; name: string }>
}

export function ProjectLivePreview({ control, teams, users }: ProjectLivePreviewProps) {
  const values = useWatch({ control })

  const statusLabel = STATUS_OPTIONS.find(s => s.value === values.status)?.label ?? '—'
  const team = teams.find(t => t.id === values.teamId)
  const owner = users.find(u => u.id === values.owner)

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle className="text-base">Live Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <PreviewRow label="Project" value={values.name || 'Untitled'} />
        <PreviewRow label="Project Lead" value={owner?.name ?? 'Not assigned'} />
        <PreviewRow label="Team" value={team?.name ?? '—'} />
        <PreviewRow label="Status" value={statusLabel} />
      </CardContent>
    </Card>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold">{label}:</span>{' '}
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}
