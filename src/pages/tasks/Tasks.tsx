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

// Map TaskData from API to local Task type
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
    start_date: data.startDate, // Map camelCase to snake_case
    end_date: data.dueDate     // Map camelCase to snake_case
  }
}

function taskToDefaults(t: Task, users: UserData[]): Partial<TaskFormValues> {
  const owner = users.find(u => u.id === t.assignedTo)
  return {
    projectId: t.projectId,
    assignedTo: owner?.name ?? '',
    title: t.title,
    description: t.description,
    priority: t.priority,
    status: t.status,
    progress: t.progress,
    startDate: t.start_date,
    endDate: t.end_date,
    expectedOutput: t.expectedOutput ?? '',
    blocker: t.blocker ?? '',
  }
}

export function TasksPage() {
  const { data: taskData = [], isLoading: isLoadingTasks } = useTasks()
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects()
  const { data: users = [] } = useUsers()

  // Convert TaskData[] to Task[]
  const tasks = useMemo(() => taskData.map(taskDataToTask), [taskData])

  const [query, setQuery] = useState('')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (projectFilter !== 'all' && t.projectId !== projectFilter) return false
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false
      if (query) {
        const q = query.toLowerCase()
        if (!t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) {
          return false
        }
      }
      return true
    })
  }, [tasks, query, projectFilter, priorityFilter])

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

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Triage and track every task across teams."
        actions={
          <Button variant="gradient" onClick={() => setCreateOpen(true)}>
            <Plus /> New task
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="sm:w-48"><SelectValue placeholder="Project" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="sm:w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No tasks match" description="Adjust filters or search to see results." />
      ) : (
        <TaskTable tasks={filtered} users={users} projects={projects} onRowClick={setActiveTask} onEdit={setEditing} />
      )}

      <TaskDrawer
        task={activeTask}
        users={users}
        projects={projects}
        open={Boolean(activeTask)}
        onOpenChange={(o) => !o && setActiveTask(null)}
        onEdit={(task) => {
          setActiveTask(null)
          setEditing(task)
        }}
      />

      <TaskFormModal open={createOpen} onOpenChange={setCreateOpen} />

      {editing && (
        <TaskFormModal
          key={editing.id}
          open={Boolean(editing)}
          onOpenChange={(o) => !o && setEditing(null)}
          defaultValues={taskToDefaults(editing, users)}
        />
      )}
    </>
  )
}
