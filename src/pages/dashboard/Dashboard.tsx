import { AlertTriangle, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { AreaChart } from '@/components/charts/AreaChart'
import { BarChart } from '@/components/charts/BarChart'
import { LineChart } from '@/components/charts/LineChart'
import { DonutChart } from '@/components/charts/DonutChart'
import {
  projectCompletion,
  riskDistribution,
  taskTrends,
  teamPerformance,
  weeklyProductivity,
} from '@/mocks/analytics'

export function DashboardPage() {
  const completionTotal = projectCompletion.reduce((sum, slice) => sum + slice.value, 0)

  return (
    <div className="space-y-6">
      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-4 text-primary" /> Weekly Productivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={weeklyProductivity}
              xKey="day"
              series={[
                { dataKey: 'tech', label: 'Tech', color: 'var(--info)' },
                { dataKey: 'marketing', label: 'Marketing', color: 'var(--success)' },
                { dataKey: 'business', label: 'Business', color: 'var(--primary)' },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={projectCompletion}
              centerLabel={`${completionTotal}`}
              centerSublabel="Projects"
            />
            <div className="mt-4 space-y-2">
              {projectCompletion.map((slice) => (
                <div key={slice.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    {slice.name}
                  </span>
                  <span className="font-bold tabular-nums">{slice.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={teamPerformance}
              xKey="team"
              series={[
                { dataKey: 'planned', label: 'Planned', color: 'var(--muted-foreground)' },
                { dataKey: 'delivered', label: 'Delivered', color: 'var(--primary)' },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={taskTrends}
              xKey="week"
              series={[
                { dataKey: 'created', label: 'Created', color: 'var(--info)' },
                { dataKey: 'completed', label: 'Completed', color: 'var(--success)' },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-warning-foreground" /> Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={riskDistribution}
            xKey="level"
            showLegend={false}
            series={[{ dataKey: 'count', label: 'Items', color: 'var(--warning)' }]}
          />
        </CardContent>
      </Card>

      <ActivityFeed />
    </div>
  )
}
