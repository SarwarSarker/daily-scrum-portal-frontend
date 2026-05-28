import {
  Area,
  AreaChart as ReAreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

export interface AreaSeries {
  dataKey: string
  label?: string
  color: string
}

interface AreaChartProps {
  data: Record<string, string | number>[]
  series: AreaSeries[]
  xKey: string
  height?: number
  showLegend?: boolean
  stacked?: boolean
}

const axisTick = { fill: 'var(--muted-foreground)', fontSize: 11 }

export function AreaChart({
  data,
  series,
  xKey,
  height = 280,
  showLegend = true,
  stacked = false,
}: AreaChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ReAreaChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.dataKey} id={`grad-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey={xKey} stroke="var(--border)" tickLine={false} axisLine={false} tick={axisTick} />
          <YAxis stroke="var(--border)" tickLine={false} axisLine={false} tick={axisTick} />
          <Tooltip cursor={{ stroke: 'var(--muted)', strokeWidth: 1 }} content={<ChartTooltip />} />
          {showLegend && (
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--muted-foreground)' }} iconType="circle" iconSize={8} />
          )}
          {series.map((s) => (
            <Area
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.label ?? s.dataKey}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#grad-${s.dataKey})`}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
