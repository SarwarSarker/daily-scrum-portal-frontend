import { Card } from '@/components/ui/card'
import { RadialChart } from '@/components/charts/RadialChart'

interface UserPerformanceCardProps {
  tasksDelivered: number
  tasksPlanned: number
}

export function UserPerformanceCard({ tasksDelivered, tasksPlanned }: UserPerformanceCardProps) {
  return (
    <Card className="p-5">
      <p className="mb-4 text-sm font-semibold">Performance</p>
      <div className="flex justify-center">
        <RadialChart
          value={tasksDelivered}
          max={tasksPlanned}
          label={`${tasksDelivered}`}
          sublabel={`of ${tasksPlanned} delivered`}
          color="var(--chart-3)"
        />
      </div>
    </Card>
  )
}
