import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ChartTooltip } from './ChartTooltip'

interface DonutSlice {
  name: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutSlice[]
  height?: number
  centerLabel?: string
  centerSublabel?: string
}

export function DonutChart({ data, height = 240, centerLabel, centerSublabel }: DonutChartProps) {
  return (
    <div className="relative" style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RePieChart>
          <Tooltip content={<ChartTooltip />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((slice) => (
              <Cell key={slice.name} fill={slice.color} />
            ))}
          </Pie>
        </RePieChart>
      </ResponsiveContainer>
      {(centerLabel || centerSublabel) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerLabel && <span className="text-2xl font-bold tracking-tight">{centerLabel}</span>}
          {centerSublabel && (
            <span className="text-xs text-muted-foreground">{centerSublabel}</span>
          )}
        </div>
      )}
    </div>
  )
}
