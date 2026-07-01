import { useMemo, useState } from 'react'
import { LayoutGrid, List as ListIcon, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { ProjectFilters, type ProjectFiltersValue } from '@/components/projects/ProjectFilters'
import { ProjectFormModal } from '@/components/projects/ProjectFormModal'
import { ProjectList } from '@/components/projects/ProjectList'
import { ProjectsSkeleton } from '@/components/projects/ProjectsSkeleton'
import { ProjectsError } from '@/components/projects/ProjectsError'
import { projectToDefaults } from '@/components/projects/projectToDefaults'
import { filterProjects } from '@/components/projects/filterProjects'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjects } from '@/utils/apiHelper'
import type { Project } from '@/types'

type ViewMode = 'grid' | 'list'

const PAGE_DESCRIPTION = 'Track every initiative across Tech, Marketing, and Business.'

export function ProjectsPage() {
  const [filters, setFilters] = useState<ProjectFiltersValue>({
    query: '',
    category: 'all',
    status: 'all',
    priority: 'all',
  })

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const { data: projects = [], isLoading, error } = useProjects()

  const filteredProjects = useMemo(
    () => filterProjects(projects, filters),
    [projects, filters]
  )

  const handleCreateProject = () => setIsCreateModalOpen(true)
  const handleEditProject = (project: Project) => setEditingProject(project)

  const handleModalClose = () => {
    setIsCreateModalOpen(false)
    setEditingProject(null)
  }

  const isModalOpen = isCreateModalOpen || Boolean(editingProject)

  const modal = (
    <ProjectFormModal
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) handleModalClose()
      }}
      defaultValues={editingProject ? projectToDefaults(editingProject) : undefined}
    />
  )

  const header = (disabled = false) => (
    <PageHeader
      title="Projects"
      description={PAGE_DESCRIPTION}
      actions={
        <Button variant="gradient" onClick={handleCreateProject} disabled={disabled}>
          <Plus /> New project
        </Button>
      }
    />
  )

  if (isLoading) {
    return (
      <>
        {header(true)}
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
        <ProjectsSkeleton view={viewMode} />
      </>
    )
  }

  if (error) {
    return <ProjectsError />
  }

  if (projects.length === 0) {
    return (
      <>
        {header()}
        <EmptyState
          title="No projects yet"
          description="Get started by creating your first project."
        />
        {modal}
      </>
    )
  }

  const hasFilteredResults = filteredProjects.length > 0

  return (
    <>
      {header()}

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <ProjectFilters value={filters} onChange={setFilters} />
        </div>
        <Tabs value={viewMode} onValueChange={(mode) => setViewMode(mode as ViewMode)}>
          <TabsList className="h-9">
            <TabsTrigger value="grid" className="px-3">
              <LayoutGrid className="size-4" />
            </TabsTrigger>
            <TabsTrigger value="list" className="px-3">
              <ListIcon className="size-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {!hasFilteredResults ? (
        <EmptyState
          title="No projects match"
          description="Try clearing a filter or adjusting your search."
        />
      ) : (
        <ProjectList
          projects={filteredProjects}
          view={viewMode}
          onEdit={handleEditProject}
        />
      )}

      {modal}
    </>
  )
}
