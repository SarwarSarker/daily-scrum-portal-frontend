import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'

export interface LineSeries {
  dataKey: string
  label?: string
  color: string
}

interface LineChartProps {
  data: Record<string, string | number>[]
  series: LineSeries[]
  xKey: string
  height?: number
  showLegend?: boolean
}

const axisTick = { fill: 'var(--muted-foreground)', fontSize: 11 }

export function LineChart({ data, series, xKey, height = 280, showLegend = true }: LineChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ReLineChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey={xKey} stroke="var(--border)" tickLine={false} axisLine={false} tick={axisTick} />
          <YAxis stroke="var(--border)" tickLine={false} axisLine={false} tick={axisTick} />
          <Tooltip cursor={{ stroke: 'var(--muted)', strokeWidth: 1 }} content={<ChartTooltip />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: 12, color: 'var(--muted-foreground)' }}
              iconType="circle"
              iconSize={8}
            />
          )}
          {series.map((s) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.label ?? s.dataKey}
              stroke={s.color}
              strokeWidth={2.5}
              dot={{ r: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  )
}
