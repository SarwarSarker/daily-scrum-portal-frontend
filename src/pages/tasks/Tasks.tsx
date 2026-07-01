import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EmptyState } from '@/components/common/EmptyState'
import { TaskTable } from '@/components/tasks/TaskTable'
import { TaskDrawer } from '@/components/tasks/TaskDrawer'
import { TaskFormModal, type TaskFormValues } from '@/components/tasks/TaskFormModal'
import { useTasks, useProjects, useUsers } from '@/utils/apiHelper'
import type { Task } from '@/types'
import type { TaskData, UserData } from '@/types/api'

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Maps API task data format to local Task type
 * Handles field name conversions (camelCase ↔ snake_case)
 */
function taskDataToTask(data: TaskData): Task {
  return {
    id: data.id,
    projectId: data.projectId,
    assignedTo: data.assignedTo,
    createdBy: data.createdBy,
    title: data.title,
    description: data.description,
    taskType: data.taskType,
    status: data.status,
    priority: data.priority,
    progress: data.progress,
    dependencyTaskId: data.dependencyTaskId,
    blocker: data.blocker,
    expectedOutput: data.expectedOutput,
    start_date: data.startDate,  // API: camelCase → Local: snake_case
    end_date: data.dueDate,      // API: camelCase → Local: snake_case
  }
}

/**
 * Converts Task entity to form default values
 * Handles user ID → name conversion for the form
 */
function taskToFormDefaults(task: Task, users: UserData[]): Partial<TaskFormValues> {
  const assignedUser = users.find(user => user.id === task.assignedTo)

  return {
    projectId: task.projectId,
    assignedTo: assignedUser?.name ?? '',
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    progress: task.progress,
    startDate: task.start_date,   // Local: snake_case → Form: camelCase
    endDate: task.end_date,       // Local: snake_case → Form: camelCase
    expectedOutput: task.expectedOutput ?? '',
    blocker: task.blocker ?? '',
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TasksPage() {
  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  const { data: taskData = [], isLoading: isLoadingTasks } = useTasks()
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects()
  const { data: users = [] } = useUsers()

  // Transform API data to local format
  const tasks = useMemo(() => taskData.map(taskDataToTask), [taskData])

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [searchQuery, setSearchQuery] = useState('')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // ============================================================================
  // FILTERED TASKS
  // ============================================================================
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Project filter
      if (projectFilter !== 'all' && task.projectId !== projectFilter) {
        return false
      }

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = task.title.toLowerCase().includes(query)
        const matchesDescription = task.description.toLowerCase().includes(query)

        if (!matchesTitle && !matchesDescription) {
          return false
        }
      }

      return true
    })
  }, [tasks, searchQuery, projectFilter, priorityFilter])

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  const handleTaskClick = (task: Task) => {
    setActiveTask(task)
  }

  const handleEditTask = (task: Task) => {
    setActiveTask(null)  // Close drawer first
    setEditingTask(task)
  }

  const handleCreateTask = () => {
    setIsCreateModalOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateModalOpen(false)
  }

  const closeEditModal = () => {
    setEditingTask(null)
  }

  const closeDrawer = () => {
    setActiveTask(null)
  }

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  if (isLoadingTasks || isLoadingProjects) {
    return (
      <>
        <PageHeader
          title="Tasks"
          description="Triage and track every task across teams."
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading tasks...</div>
        </div>
      </>
    )
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="Tasks"
        description="Triage and track every task across teams."
        actions={
          <Button variant="gradient" onClick={handleCreateTask}>
            <Plus /> New task
          </Button>
        }
      />

      {/* Filters Bar */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Project Filter */}
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="sm:w-36">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks Table or Empty State */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks match"
          description="Adjust filters or search to see results."
        />
      ) : (
        <TaskTable
          tasks={filteredTasks}
          users={users}
          projects={projects}
          onRowClick={handleTaskClick}
          onEdit={handleEditTask}
        />
      )}

      {/* Task Detail Drawer */}
      <TaskDrawer
        task={activeTask}
        users={users}
        projects={projects}
        open={Boolean(activeTask)}
        onOpenChange={closeDrawer}
        onEdit={handleEditTask}
      />

      {/* Create Task Modal */}
      <TaskFormModal
        open={isCreateModalOpen}
        onOpenChange={closeCreateModal}
      />

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskFormModal
          key={editingTask.id}
          open={Boolean(editingTask)}
          onOpenChange={closeEditModal}
          defaultValues={taskToFormDefaults(editingTask, users)}
        />
      )}
    </>
  )
}
