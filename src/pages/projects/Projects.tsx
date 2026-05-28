import { useMemo, useState } from 'react'
import { LayoutGrid, List as ListIcon, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { ProjectCard } from '@/components/projects/ProjectCard'
import {
  ProjectFilters,
  type ProjectFiltersValue,
} from '@/components/projects/ProjectFilters'
import { ProjectFormModal } from '@/components/projects/ProjectFormModal'
import { projectToDefaults } from '@/components/projects/projectToDefaults'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockProjects } from '@/mocks/projects'
import type { Project } from '@/types'

export function ProjectsPage() {
  const [filters, setFilters] = useState<ProjectFiltersValue>({
    query: '',
    category: 'all',
    status: 'all',
    priority: 'all',
  })
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)

  const filtered = useMemo(() => {
    return mockProjects.filter((p) => {
      if (filters.category !== 'all' && p.category !== filters.category) return false
      if (filters.status !== 'all' && p.status !== filters.status) return false
      if (filters.priority !== 'all' && p.priority !== filters.priority) return false
      if (filters.query) {
        const q = filters.query.toLowerCase()
        if (
          !p.projectName.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q)
        ) {
          return false
        }
      }
      return true
    })
  }, [filters])

  return (
    <>
      <PageHeader
        title="Projects"
        description="Track every initiative across Tech, Marketing, and Business."
        actions={
          <Button variant="gradient" onClick={() => setCreateOpen(true)}>
            <Plus /> New project
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <ProjectFilters value={filters} onChange={setFilters} />
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'list')}>
          <TabsList className="h-9">
            <TabsTrigger value="grid" className="px-3"><LayoutGrid className="size-4" /></TabsTrigger>
            <TabsTrigger value="list" className="px-3"><ListIcon className="size-4" /></TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No projects match"
          description="Try clearing a filter or adjusting your search."
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onEdit={setEditing} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onEdit={setEditing} />
          ))}
        </div>
      )}

      <ProjectFormModal open={createOpen} onOpenChange={setCreateOpen} />

      {editing && (
        <ProjectFormModal
          key={editing.id}
          open={Boolean(editing)}
          onOpenChange={(o) => !o && setEditing(null)}
          defaultValues={projectToDefaults(editing)}
        />
      )}
    </>
  )
}
