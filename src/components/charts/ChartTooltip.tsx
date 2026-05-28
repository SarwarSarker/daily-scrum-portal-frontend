interface PayloadItem {
  dataKey?: string | number
  name?: string | number
  value?: number | string
  color?: string
  fill?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: PayloadItem[]
  label?: string | number
}

export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
      {label !== undefined && (
        <p className="mb-1.5 font-medium text-foreground">{label}</p>
      )}
      <div className="space-y-1">
        {payload.map((p, i) => (
          <div key={`${String(p.dataKey)}-${i}`} className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ background: p.color ?? p.fill ?? 'var(--primary)' }}
            />
            <span className="capitalize text-muted-foreground">{p.name ?? p.dataKey}</span>
            <span className="ml-auto font-semibold text-foreground">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
