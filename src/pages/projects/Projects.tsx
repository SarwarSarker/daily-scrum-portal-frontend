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
import { Skeleton } from '@/components/ui/skeleton'
import { useProjects } from '@/utils/apiHelper'
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

  // Fetch projects from API
  const { data: projects = [], isLoading, error } = useProjects()
  console.log("🚀 ~ ProjectsPage ~ projects:", projects)

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      // Filter by category (only if project has category and filter is not 'all')
      if (filters.category !== 'all' && p.category !== filters.category) return false
      // Filter by status (status is required)
      if (filters.status !== 'all' && p.status !== filters.status) return false
      // Filter by priority (only if project has priority and filter is not 'all')
      if (filters.priority !== 'all' && p.priority !== filters.priority) return false
      // Filter by query
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
  }, [projects, filters])

  // Handle loading and error states
  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Projects"
          description="Track every initiative across Tech, Marketing, and Business."
          actions={
            <Button variant="gradient" disabled>
              <Plus /> New project
            </Button>
          }
        />

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-5 space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border bg-card p-4">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        )}
      </>
    )
  }

  if (error) {
    console.error('Projects page error:', error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <div className="text-destructive mb-2">Failed to load projects</div>
          <div className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Please check your connection and try again.'}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Show empty state if no projects returned
  if (projects.length === 0) {
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
        <EmptyState
          title="No projects yet"
          description="Get started by creating your first project."
        />
        <ProjectFormModal open={createOpen} onOpenChange={setCreateOpen} />
      </>
    )
  }

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
