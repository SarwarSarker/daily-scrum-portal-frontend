// import { Download } from 'lucide-react'
// import { PageHeader } from '@/components/common/PageHeader'
// import { Button } from '@/components/ui/button'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { CompletionTrendCard } from '@/components/dashboard/CompletionTrendCard'
import { FocusListCard } from '@/components/dashboard/FocusListCard'
import { TeamSignalCard } from '@/components/dashboard/TeamSignalCard'
import { RecentUpdatesTable } from '@/components/dashboard/RecentUpdatesTable'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'

export function DashboardPage() {
  return (
    <>
      {/* <PageHeader
        title="Dashboard"
        description="Real-time snapshot of every team's progress, blockers, and risk."
        actions={
          <Button variant="outline">
            <Download /> Export
          </Button>
        }
      /> */}

      <div className="space-y-6">
        <DashboardStats />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <CompletionTrendCard />
          <FocusListCard />
          <TeamSignalCard />
        </div>

        <RecentUpdatesTable />

        <ActivityFeed />
      </div>
    </>
  )
}
