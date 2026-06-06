import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { TeamCard } from '@/components/teams/TeamCard'
import { TeamDetailsDrawer } from '@/components/teams/TeamDetailsDrawer'
import { TeamFormModal, type TeamFormValues } from '@/components/teams/TeamFormModal'
import { mockTeams, mockDepartments, departmentById } from '@/mocks/teams'
import { mockUsers } from '@/mocks/users'
import { mockProjects } from '@/mocks/projects'
import type { Team } from '@/types'
import { StatCard } from '@/components/cards/StatCard'
import { Users, Briefcase, Building2, UsersRound } from 'lucide-react'

function teamToDefaults(t: Team): Partial<TeamFormValues> {
  const dept = departmentById(t.departmentId)
  return {
    name: t.name,
    department: dept?.name ?? '',
    leadId: t.leadId,
  }
}

export function TeamsPage() {
  const [activeTeam, setActiveTeam] = useState<Team | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Team | null>(null)

  return (
    <>
      <PageHeader
        title="Teams"
        description="People, leads, and structure across the organization."
        actions={
          <Button variant="gradient" onClick={() => setCreateOpen(true)}>
            <Plus /> New team
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Departments" value={`${mockDepartments.length}`} icon={Building2} variant="primary" />
        <StatCard label="Teams" value={`${mockTeams.length}`} icon={Users} variant="info" />
        <StatCard label="People" value={`${mockUsers.length}`} icon={UsersRound} variant="success" />
        <StatCard label="Active projects" value={`${mockProjects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled').length}`} icon={Briefcase} variant="warning" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mockTeams.map((t) => (
          <TeamCard
            key={t.id}
            team={t}
            onClick={() => setActiveTeam(t)}
            onEdit={setEditing}
          />
        ))}
      </div>

      <TeamDetailsDrawer
        team={activeTeam}
        open={Boolean(activeTeam)}
        onOpenChange={(o) => !o && setActiveTeam(null)}
      />

      <TeamFormModal open={createOpen} onOpenChange={setCreateOpen} />

      {editing && (
        <TeamFormModal
          key={editing.id}
          open={Boolean(editing)}
          onOpenChange={(o) => !o && setEditing(null)}
          defaultValues={teamToDefaults(editing)}
        />
      )}
    </>
  )
}
