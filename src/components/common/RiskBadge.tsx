import { Badge } from '@/components/ui/badge'
import type { RiskLevel } from '@/types'

const riskMap: Record<RiskLevel, { label: string; variant: Parameters<typeof Badge>[0]['variant'] }> = {
  low: { label: 'Low risk', variant: 'success' },
  medium: { label: 'Medium risk', variant: 'info' },
  high: { label: 'High risk', variant: 'warning' },
  critical: { label: 'Critical', variant: 'destructive' },
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const conf = riskMap[level]
  return <Badge variant={conf.variant}>{conf.label}</Badge>
}
