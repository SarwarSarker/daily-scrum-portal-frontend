import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { EmptyState } from '@/components/common/EmptyState'
import { mockUsers, userById } from '@/mock/users'
import { mockProjects } from '@/mock/projects'
import { departmentById } from '@/mock/teams'
import { TeamLeadCard } from './TeamLeadCard'
import { TeamMemberCard } from './TeamMemberCard'
import { TeamProjectCard } from './TeamProjectCard'
import type { Team } from '@/types'

interface TeamDetailsDrawerProps {
  team: Team | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeamDetailsDrawer({ team, open, onOpenChange }: TeamDetailsDrawerProps) {
  if (!team) return null

  const lead = team.leadId ? userById(team.leadId) : undefined
  const members = mockUsers.filter((u) => u.teamId === team.id)
  const projects = mockProjects.filter((p) => p.teamId === team.id)
  const dept = departmentById(team.departmentId)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-2xl">
        <SheetHeader>
          <SheetDescription className="text-[10px] uppercase tracking-wider">
            {dept?.name}
          </SheetDescription>
          <SheetTitle className="text-xl">{team.name}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {lead && <TeamLeadCard lead={lead} />}

          <Tabs defaultValue="members">
            <TabsList>
              <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
              <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="members">
              {members.length === 0 ? (
                <EmptyState title="No members yet" />
              ) : (
                <div className="space-y-2">
                  {members.map((u) => (
                    <TeamMemberCard key={u.id} user={u} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects">
              {projects.length === 0 ? (
                <EmptyState title="No projects assigned" />
              ) : (
                <div className="space-y-2">
                  {projects.map((p) => (
                    <TeamProjectCard key={p.id} project={p} />
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
