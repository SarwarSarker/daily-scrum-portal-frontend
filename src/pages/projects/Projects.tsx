import { useMemo, useState } from 'react'
import { LayoutGrid, List as ListIcon, Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectFilters, type ProjectFiltersValue } from '@/components/projects/ProjectFilters'
import { ProjectFormModal } from '@/components/projects/ProjectFormModal'
import { projectToDefaults } from '@/components/projects/projectToDefaults'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjects } from '@/utils/apiHelper'
import type { Project } from '@/types'

// ============================================================================
// TYPES
// ============================================================================

type ViewMode = 'grid' | 'list'

// ============================================================================
// CONSTANTS
// ============================================================================

const SKELETON_COUNT = 6

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Filter projects based on search query and filter criteria
 */
function filterProjects(
  projects: Project[],
  filters: ProjectFiltersValue
): Project[] {
  return projects.filter((project) => {
    // Category filter
    if (filters.category !== 'all' && project.category !== filters.category) {
      return false
    }

    // Status filter
    if (filters.status !== 'all' && project.status !== filters.status) {
      return false
    }

    // Priority filter
    if (filters.priority !== 'all' && project.priority !== filters.priority) {
      return false
    }

    // Search query filter
    if (filters.query) {
      const query = filters.query.toLowerCase()
      const matchesName = project.name.toLowerCase().includes(query)
      const matchesDescription = project.description.toLowerCase().includes(query)

      if (!matchesName && !matchesDescription) {
        return false
      }
    }

    return true
  })
}

/**
 * Generate grid view skeleton loaders
 */
function renderGridViewSkeletons() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <div key={index} className="rounded-lg border bg-card p-5 space-y-4">
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
  )
}

/**
 * Generate list view skeleton loaders
 */
function renderListViewSkeletons() {
  return (
    <div className="space-y-3">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 rounded-lg border bg-card p-4">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ProjectsPage() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [filters, setFilters] = useState<ProjectFiltersValue>({
    query: '',
    category: 'all',
    status: 'all',
    priority: 'all',
  })

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  const { data: projects = [], isLoading, error } = useProjects()

  // ============================================================================
  // FILTERED PROJECTS
  // ============================================================================
  const filteredProjects = useMemo(() => {
    return filterProjects(projects, filters)
  }, [projects, filters])

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  const handleCreateProject = () => {
    setIsCreateModalOpen(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
  }

  const handleModalClose = () => {
    setIsCreateModalOpen(false)
    setEditingProject(null)
  }

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode as ViewMode)
  }

  // ============================================================================
  // LOADING STATE
  // ============================================================================
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

        {viewMode === 'grid' ? renderGridViewSkeletons() : renderListViewSkeletons()}
      </>
    )
  }

  // ============================================================================
  // ERROR STATE
  // ============================================================================
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <div className="text-destructive mb-2">Failed to load projects</div>
          <div className="text-sm text-muted-foreground mb-4">
            Please check your connection and try again.
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // ============================================================================
  // EMPTY STATE
  // ============================================================================
  if (projects.length === 0) {
    return (
      <>
        <PageHeader
          title="Projects"
          description="Track every initiative across Tech, Marketing, and Business."
          actions={
            <Button variant="gradient" onClick={handleCreateProject}>
              <Plus /> New project
            </Button>
          }
        />
        <EmptyState
          title="No projects yet"
          description="Get started by creating your first project."
        />
        <ProjectFormModal
          open={isCreateModalOpen || Boolean(editingProject)}
          onOpenChange={(open) => {
            if (!open) {
              handleModalClose()
            }
          }}
          defaultValues={editingProject ? projectToDefaults(editingProject) : undefined}
        />
      </>
    )
  }

  // ============================================================================
  // MAIN CONTENT
  // ============================================================================
  const isModalOpen = isCreateModalOpen || Boolean(editingProject)
  const hasFilteredResults = filteredProjects.length > 0

  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="Projects"
        description="Track every initiative across Tech, Marketing, and Business."
        actions={
          <Button variant="gradient" onClick={handleCreateProject}>
            <Plus /> New project
          </Button>
        }
      />

      {/* Filters and View Toggle */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <ProjectFilters value={filters} onChange={setFilters} />
        </div>
        <Tabs value={viewMode} onValueChange={handleViewModeChange}>
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

      {/* Projects Grid/List or Empty State */}
      {!hasFilteredResults ? (
        <EmptyState
          title="No projects match"
          description="Try clearing a filter or adjusting your search."
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
            />
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      <ProjectFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleModalClose()
          }
        }}
        defaultValues={editingProject ? projectToDefaults(editingProject) : undefined}
      />
    </>
  )
}
