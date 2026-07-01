import { z } from "zod"

export const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
] as const

export const STATUS_OPTIONS = [
  { value: "todo", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "In Review" },
  { value: "completed", label: "Completed" },
] as const

export const taskFormSchema = z.object({
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

function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function getNextWeekDate(): string {
  return new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10)
}

export function getDefaultFormValues(overrides?: Partial<TaskFormValues>): TaskFormValues {
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
