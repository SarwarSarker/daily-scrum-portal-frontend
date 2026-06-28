import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useProjects, useUsers } from "@/utils/apiHelper"
import type { UserData, ProjectData } from "@/types/api"

// ============================================================================
// CONSTANTS
// ============================================================================

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
] as const

const STATUS_OPTIONS = [
  { value: "todo", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "In Review" },
  { value: "completed", label: "Completed" },
] as const

// ============================================================================
// FORM SCHEMA & TYPES
// ============================================================================

const taskFormSchema = z.object({
  projectId: z.string().min(1, "Pick a project"),
  assignedTo: z.string().min(1, "Assignee is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().max(280, "Keep it under 280 characters").optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["todo", "in_progress", "review", "completed"]),
  progress: z.number().min(0).max(100),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  expectedOutput: z.string().optional(),
  blocker: z.string().optional(),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>

interface TaskFormModalProps {
  /** Whether the modal is open */
  open: boolean
  /** Callback to control modal open state */
  onOpenChange: (open: boolean) => void
  /** Default values for edit mode */
  defaultValues?: Partial<TaskFormValues>
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Get date one week from now in YYYY-MM-DD format
 */
function getNextWeekDate(): string {
  return new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10)
}

/**
 * Get default form values
 */
function getDefaultFormValues(overrides?: Partial<TaskFormValues>): TaskFormValues {
  return {
    projectId: "",
    assignedTo: "",
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    progress: 0,
    startDate: getTodayDate(),
    endDate: getNextWeekDate(),
    expectedOutput: "",
    blocker: "",
    ...overrides,
  }
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

/**
 * Reusable form field component with label and error display
 */
function FormField({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-primary">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

/**
 * Display row for task preview
 */
function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold">{label}:</span>{" "}
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}

/**
 * Real-time task preview component
 */
function TaskPreview({ values, projects, users }: {
  values: TaskFormValues
  projects: ProjectData[]
  users: UserData[]
}) {
  // Find related data
  const project = projects.find(p => p.id === values.projectId)
  const assignedUser = users.find(u => u.name === values.assignedTo)

  // Get display labels
  const statusLabel = STATUS_OPTIONS.find(s => s.value === values.status)?.label ?? "—"
  const priorityLabel = PRIORITY_OPTIONS.find(p => p.value === values.priority)?.label ?? "—"

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle className="text-base">Task Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <PreviewRow label="Project" value={project?.name ?? "—"} />
        <PreviewRow label="Task" value={values.title || "Not added yet"} />
        <PreviewRow label="Assignee" value={assignedUser?.name || values.assignedTo || "Not assigned"} />
        <PreviewRow label="Priority" value={priorityLabel} />
        <PreviewRow label="Status" value={statusLabel} />
        <div>
          <p className="text-xs font-semibold text-muted-foreground">
            Progress: {values.progress || 0}%
          </p>
          <Progress value={Number(values.progress) || 0} className="mt-1.5 h-1.5" />
        </div>
        <PreviewRow
          label="Timeline"
          value={`${values.startDate || "—"} to ${values.endDate || "—"}`}
        />
      </CardContent>
    </Card>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TaskFormModal({
  open,
  onOpenChange,
  defaultValues,
}: TaskFormModalProps) {
  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects()
  const { data: users = [], isLoading: isLoadingUsers } = useUsers()

  // ============================================================================
  // FORM SETUP
  // ============================================================================
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: getDefaultFormValues(defaultValues),
  })

  // Watch all form values for preview
  const formValues = form.watch()

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  const handleSubmit = (data: TaskFormValues) => {
    // TODO: Wire this up to your backend API
    // Example: await createTask(data)
    toast.success(`Task "${data.title}" created`, {
      description: "This will be wired up to the backend API.",
    })
    form.reset()
    onOpenChange(false)
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  const updateProjectId = (projectId: string) => {
    form.setValue("projectId", projectId)
  }

  const updateAssignedTo = (userName: string) => {
    form.setValue("assignedTo", userName)
  }

  const updatePriority = (priority: TaskFormValues["priority"]) => {
    form.setValue("priority", priority)
  }

  const updateStatus = (status: TaskFormValues["status"]) => {
    form.setValue("status", status)
  }

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  if (isLoadingProjects || isLoadingUsers) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading form data...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  const isEditMode = Boolean(defaultValues)
  const submitButtonText = isEditMode ? "Save changes" : "Create task"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit task" : "Create task"}
          </DialogTitle>
          <DialogDescription>
            All fields populate the preview on the right in real time.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Main Form Area */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Form Fields */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">
                  {isEditMode ? "Task Details" : "New Task Form"}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Project Selection */}
                <FormField
                  label="Project"
                  error={form.formState.errors.projectId?.message}
                >
                  <Select
                    value={formValues.projectId}
                    onValueChange={updateProjectId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                      <div className="mt-1 border-t border-border pt-1">
                        <button
                          type="button"
                          disabled
                          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium text-muted-foreground opacity-50 outline-none cursor-not-allowed"
                        >
                          <Plus className="size-4" /> Add project (Coming soon)
                        </button>
                      </div>
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Assignee Selection */}
                <FormField
                  label="Assignee"
                  error={form.formState.errors.assignedTo?.message}
                >
                  <Select
                    value={formValues.assignedTo}
                    onValueChange={updateAssignedTo}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.name}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Task Title */}
                <FormField
                  label="Task Title"
                  error={form.formState.errors.title?.message}
                  className="sm:col-span-2"
                >
                  <Input
                    placeholder="Example: Build Revenue Dashboard API"
                    {...form.register("title")}
                  />
                </FormField>

                {/* Description */}
                <FormField
                  label="Short Description"
                  error={form.formState.errors.description?.message}
                  className="sm:col-span-2"
                >
                  <Textarea
                    rows={2}
                    placeholder="One-line summary of what this task delivers"
                    {...form.register("description")}
                  />
                </FormField>

                {/* Priority */}
                <FormField label="Priority">
                  <Select
                    value={formValues.priority}
                    onValueChange={updatePriority}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="e.g. High" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Progress */}
                <FormField label="Progress (%)">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    {...form.register("progress", { valueAsNumber: true })}
                  />
                </FormField>

                {/* Start Date */}
                <FormField
                  label="Start Date"
                  error={form.formState.errors.startDate?.message}
                >
                  <Input type="date" {...form.register("startDate")} />
                </FormField>

                {/* End Date */}
                <FormField
                  label="End Date"
                  error={form.formState.errors.endDate?.message}
                >
                  <Input type="date" {...form.register("endDate")} />
                </FormField>

                {/* Status */}
                <FormField label="Status">
                  <Select
                    value={formValues.status}
                    onValueChange={updateStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="e.g. In Progress" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <TaskPreview values={formValues} projects={projects} users={users} />
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Blocker */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Blocker</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={5}
                  placeholder="Blocker or risk"
                  {...form.register("blocker")}
                />
              </CardContent>
            </Card>

            {/* Expected Output */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expected Output</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={5}
                  placeholder="Write what should be delivered after this task"
                  {...form.register("expectedOutput")}
                />
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              {submitButtonText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Project Creation Modal */}
      {/* TODO: Implement ProjectFormModal component */}
      {/* <ProjectFormModal
        open={isProjectModalOpen}
        onOpenChange={setIsProjectModalOpen}
      /> */}
    </Dialog>
  )
}
