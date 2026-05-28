import { Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface ComingSoonProps {
  title: string
  description?: string
  phase: string
}

export function ComingSoon({ title, description, phase }: ComingSoonProps) {
  return (
    <Card className="flex min-h-[60vh] flex-col items-center justify-center gap-4 border-dashed bg-card/50 p-10 text-center">
      <div className="grid size-16 place-items-center rounded-2xl gradient-primary shadow-lg">
        <Sparkles className="size-7 text-white" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
      </div>
      <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
        Arriving in {phase}
      </span>
    </Card>
  )
}
