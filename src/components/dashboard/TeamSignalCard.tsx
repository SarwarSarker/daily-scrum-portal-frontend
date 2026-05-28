import { Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const signals: { name: string; insight: string }[] = [
  { name: 'Rozin',  insight: 'Strong module delivery.' },
  { name: 'Rifat',  insight: 'Multi-project execution stable.' },
  { name: 'Sarwar', insight: 'Website delivery consistent.' },
  { name: 'Sabbir', insight: 'Quizmuiz needs acceleration.' },
  { name: 'Siam',   insight: 'Moderate but steady progress.' },
]

export function TeamSignalCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="size-4 text-info" /> Team Signal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {signals.map((s) => (
          <p key={s.name} className="text-sm">
            <span className="font-semibold">{s.name}:</span>{' '}
            <span className="text-muted-foreground">{s.insight}</span>
          </p>
        ))}
      </CardContent>
    </Card>
  )
}
