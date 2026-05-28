import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

export interface BarSeries {
  dataKey: string
  label?: string
  color: string
}

interface BarChartProps {
  data: Record<string, string | number>[]
  series: BarSeries[]
  xKey: string
  height?: number
  showLegend?: boolean
}

const axisTick = { fill: 'var(--muted-foreground)', fontSize: 11 }

export function BarChart({ data, series, xKey, height = 280, showLegend = true }: BarChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ReBarChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 0 }} barGap={6}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey={xKey} stroke="var(--border)" tickLine={false} axisLine={false} tick={axisTick} />
          <YAxis stroke="var(--border)" tickLine={false} axisLine={false} tick={axisTick} />
          <Tooltip cursor={{ fill: 'var(--muted)', opacity: 0.4 }} content={<ChartTooltip />} />
          {showLegend && (
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--muted-foreground)' }} iconType="circle" iconSize={8} />
          )}
          {series.map((s) => (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              name={s.label ?? s.dataKey}
              fill={s.color}
              radius={[8, 8, 0, 0]}
              maxBarSize={36}
            />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  )
}
