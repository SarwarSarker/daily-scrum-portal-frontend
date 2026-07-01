import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/common/EmptyState'
import { perfByUser } from '@/mock/performance'
import { teamById, departmentById } from '@/mock/teams'
import { mockTasks } from '@/mock/tasks'
import { mockProjects } from '@/mock/projects'
import { UserProfileHeader } from './UserProfileHeader'
import { UserPerformanceCard } from './UserPerformanceCard'
import { UserTaskCard } from './UserTaskCard'
import { UserProjectCard } from './UserProjectCard'
import type { User } from '@/types'

interface UserProfileDrawerProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserProfileDrawer({ user, open, onOpenChange }: UserProfileDrawerProps) {
  if (!user) return null

  const perf = perfByUser(user.id)
  const team = user.teamId ? teamById(user.teamId) : undefined
  const dept = team ? departmentById(team.departmentId) : undefined
  const myTasks = mockTasks.filter((t) => t.assignedTo === user.id)
  const myProjects = mockProjects.filter((p) => p.ownerId === user.id)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-2xl">
        <SheetHeader>
          <SheetDescription className="text-[10px] uppercase tracking-wider">Profile</SheetDescription>
          <SheetTitle className="text-xl">{user.name}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 pb-6">
          <UserProfileHeader user={user} team={team} dept={dept} />

          {perf && (
            <UserPerformanceCard
              tasksDelivered={perf.tasksDelivered}
              tasksPlanned={perf.tasksPlanned}
            />
          )}

          <Tabs defaultValue="tasks">
            <TabsList>
              <TabsTrigger value="tasks">Tasks ({myTasks.length})</TabsTrigger>
              <TabsTrigger value="projects">Owned projects ({myProjects.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              {myTasks.length === 0 ? (
                <EmptyState title="No assigned tasks" />
              ) : (
                <div className="space-y-2">
                  {myTasks.slice(0, 8).map((t) => (
                    <UserTaskCard key={t.id} task={t} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects">
              {myProjects.length === 0 ? (
                <EmptyState title="No owned projects" />
              ) : (
                <div className="space-y-2">
                  {myProjects.map((p) => (
                    <UserProjectCard key={p.id} project={p} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
