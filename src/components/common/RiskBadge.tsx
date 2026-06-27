import { Badge } from '@/components/ui/badge'
import type { RiskLevel } from '@/types'

const riskMap: Record<RiskLevel, { label: string; variant: Parameters<typeof Badge>[0]['variant'] }> = {
  low: { label: 'Low risk', variant: 'success' },
  medium: { label: 'Medium risk', variant: 'info' },
  high: { label: 'High risk', variant: 'warning' },
  critical: { label: 'Critical', variant: 'destructive' },
}

export function RiskBadge({ level }: { level?: RiskLevel | string | null }) {
  // Handle undefined, null, or invalid risk level values
  if (!level || !(level in riskMap)) {
    console.warn('Invalid or missing risk level:', level)
    return <Badge variant="secondary">Unknown</Badge>
  }

  const conf = riskMap[level as RiskLevel]
  return <Badge variant={conf.variant}>{conf.label}</Badge>
}
