import { useMemo, useState } from 'react'
import { LayoutGrid, List as ListIcon, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/common/EmptyState'
import { UserFilters, type UserFiltersValue } from '@/components/users/UserFilters'
import { UserCard } from '@/components/users/UserCard'
import { UserTable } from '@/components/users/UserTable'
import { UserProfileDrawer } from '@/components/users/UserProfileDrawer'
import { UserFormModal, type UserFormValues } from '@/components/users/UserFormModal'
import { mockUsers } from '@/mocks/users'
import { mockTeams } from '@/mocks/teams'
import type { User } from '@/types'

function userToDefaults(u: User): Partial<UserFormValues> {
  return {
    name: u.name,
    email: u.email,
    role: u.role,
    designation: u.designation,
    teamId: u.teamId ?? mockTeams[0]?.id ?? '',
    status: u.status,
  }
}

export function UsersPage() {
  const [filters, setFilters] = useState<UserFiltersValue>({
    query: '',
    role: 'all',
    teamId: 'all',
    status: 'all',
  })
  const [view, setView] = useState<'grid' | 'list'>('list')
  const [activeUser, setActiveUser] = useState<User | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)

  const filtered = useMemo(() => {
    return mockUsers.filter((u) => {
      if (filters.role !== 'all' && u.role !== filters.role) return false
      if (filters.teamId !== 'all' && u.teamId !== filters.teamId) return false
      if (filters.status !== 'all' && u.status !== filters.status) return false
      if (filters.query) {
        const q = filters.query.toLowerCase()
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) {
          return false
        }
      }
      return true
    })
  }, [filters])

  return (
    <>
      <PageHeader
        title="Users"
        description="Roles, designations, and performance — across the organization."
        actions={
          <Button variant="gradient" onClick={() => setCreateOpen(true)}>
            <Plus /> Add user
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <UserFilters value={filters} onChange={setFilters} />
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'list')}>
          <TabsList className="h-9">
            <TabsTrigger value="grid" className="px-3"><LayoutGrid className="size-4" /></TabsTrigger>
            <TabsTrigger value="list" className="px-3"><ListIcon className="size-4" /></TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No users match" description="Try clearing a filter or adjusting your search." />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              onClick={() => setActiveUser(u)}
              onEdit={setEditing}
            />
          ))}
        </div>
      ) : (
        <UserTable users={filtered} onRowClick={setActiveUser} onEdit={setEditing} />
      )}

      <UserProfileDrawer
        user={activeUser}
        open={Boolean(activeUser)}
        onOpenChange={(o) => !o && setActiveUser(null)}
      />

      <UserFormModal open={createOpen} onOpenChange={setCreateOpen} />

      {editing && (
        <UserFormModal
          key={editing.id}
          open={Boolean(editing)}
          onOpenChange={(o) => !o && setEditing(null)}
          defaultValues={userToDefaults(editing)}
        />
      )}
    </>
  )
}
