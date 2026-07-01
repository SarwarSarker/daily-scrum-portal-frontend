import { Label } from '@/components/ui/label'

interface FieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-primary">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
