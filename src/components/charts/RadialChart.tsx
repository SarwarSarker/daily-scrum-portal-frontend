import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts'

interface RadialChartProps {
  value: number
  max?: number
  color?: string
  height?: number
  label?: string
  sublabel?: string
}

export function RadialChart({
  value,
  max = 100,
  color = 'var(--primary)',
  height = 180,
  label,
  sublabel,
}: RadialChartProps) {
  const data = [{ name: 'progress', value }]
  return (
    <div className="relative" style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <RadialBarChart
          data={data}
          startAngle={90}
          endAngle={-270}
          innerRadius="72%"
          outerRadius="100%"
        >
          <PolarAngleAxis type="number" domain={[0, max]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={20} fill={color} background={{ fill: 'var(--muted)' }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="text-2xl font-bold tracking-tight">{label}</span>}
        {sublabel && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  )
}
