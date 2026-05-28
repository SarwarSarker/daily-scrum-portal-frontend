import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { ProjectFormModal } from '@/components/projects/ProjectFormModal'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockProjects, projectById } from '@/mocks/projects'

const taskTypeOptions = [
  { value: 'feature',  label: 'Development' },
  { value: 'bug',      label: 'Bug fix'     },
  { value: 'research', label: 'Research'    },
  { value: 'chore',    label: 'Chore'       },
  { value: 'meeting',  label: 'Meeting'     },
] as const

const priorityOptions = [
  { value: 'low',    label: 'Low'    },
  { value: 'medium', label: 'Medium' },
  { value: 'high',   label: 'High'   },
  { value: 'urgent', label: 'Urgent' },
] as const

const statusOptions = [
  { value: 'todo',        label: 'Pending'     },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review',      label: 'In Review'   },
  { value: 'completed',   label: 'Completed'   },
] as const

const schema = z.object({
  projectId: z.string().min(1, 'Pick a project'),
  taskOwner: z.string().min(1, 'Owner is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().max(280, 'Keep it under 280 characters').optional(),
  taskType: z.enum(['feature', 'bug', 'research', 'chore', 'meeting']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['todo', 'in_progress', 'review', 'completed']),
  progress: z.number().min(0).max(100),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  dependency: z.string().optional(),
  expectedOutput: z.string().optional(),
  blocker: z.string().optional(),
  remarks: z.string().optional(),
})

export type TaskFormValues = z.infer<typeof schema>

interface TaskFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<TaskFormValues>
}

const today = new Date().toISOString().slice(0, 10)
const nextWeek = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10)

export function TaskFormModal({ open, onOpenChange, defaultValues }: TaskFormModalProps) {
  const [addProjectOpen, setAddProjectOpen] = useState(false)
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectId: mockProjects[0]?.id ?? '',
      taskOwner: '',
      title: '',
      description: '',
      taskType: 'feature',
      priority: 'medium',
      status: 'todo',
      progress: 0,
      startDate: today,
      endDate: nextWeek,
      dependency: '',
      expectedOutput: '',
      blocker: '',
      remarks: '',
      ...defaultValues,
    },
  })

  const onSubmit = (data: TaskFormValues) => {
    toast.success(`Task "${data.title}" created`, {
      description: 'Wire this up to your backend in src/services/api.ts.',
    })
    form.reset()
    onOpenChange(false)
  }

  const values = form.watch()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Edit task' : 'Create task'}</DialogTitle>
          <DialogDescription>
            All fields populate the preview on the right in real time.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">New Task Form</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Project" error={form.formState.errors.projectId?.message}>
                  <Select
                    value={form.watch('projectId')}
                    onValueChange={(v) => form.setValue('projectId', v)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {mockProjects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.projectName}</SelectItem>
                      ))}
                      <div className="mt-1 border-t border-border pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            setAddProjectOpen(true)
                          }}
                          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium text-primary outline-none transition-colors hover:bg-accent focus:bg-accent"
                        >
                          <Plus className="size-4" /> Add project
                        </button>
                      </div>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Task Owner" error={form.formState.errors.taskOwner?.message}>
                  <Input placeholder="e.g. John Doe" {...form.register('taskOwner')} />
                </Field>

                <Field label="Task Title" error={form.formState.errors.title?.message} className="sm:col-span-2">
                  <Input placeholder="Example: Build Revenue Dashboard API" {...form.register('title')} />
                </Field>

                <Field
                  label="Short Description"
                  error={form.formState.errors.description?.message}
                  className="sm:col-span-2"
                >
                  <Textarea
                    rows={2}
                    placeholder="One-line summary of what this task delivers"
                    {...form.register('description')}
                  />
                </Field>

                <Field label="Task Type">
                  <Select
                    value={form.watch('taskType')}
                    onValueChange={(v) => form.setValue('taskType', v as TaskFormValues['taskType'])}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {taskTypeOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Priority">
                  <Select
                    value={form.watch('priority')}
                    onValueChange={(v) => form.setValue('priority', v as TaskFormValues['priority'])}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Status">
                  <Select
                    value={form.watch('status')}
                    onValueChange={(v) => form.setValue('status', v as TaskFormValues['status'])}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Progress (%)">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    {...form.register('progress', { valueAsNumber: true })}
                  />
                </Field>

                <Field label="Start Date" error={form.formState.errors.startDate?.message}>
                  <Input type="date" {...form.register('startDate')} />
                </Field>

                <Field label="End Date" error={form.formState.errors.endDate?.message}>
                  <Input type="date" {...form.register('endDate')} />
                </Field>

                <Field label="Dependency" className="sm:col-span-2">
                  <Input
                    placeholder="Example: API credential from operator"
                    {...form.register('dependency')}
                  />
                </Field>
              </CardContent>
            </Card>

            <TaskPreview values={values} />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Expected Output</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  rows={5}
                  placeholder="Write what should be delivered after this task"
                  {...form.register('expectedOutput')}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Blocker / Remarks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea rows={2} placeholder="Blocker or risk" {...form.register('blocker')} />
                <Textarea rows={2} placeholder="Internal remarks" {...form.register('remarks')} />
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              {defaultValues ? 'Save changes' : 'Create task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <ProjectFormModal open={addProjectOpen} onOpenChange={setAddProjectOpen} />
    </Dialog>
  )
}

function Field({
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
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-primary">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function TaskPreview({ values }: { values: TaskFormValues }) {
  const project = projectById(values.projectId)
  const statusLabel = statusOptions.find((s) => s.value === values.status)?.label ?? '—'
  const priorityLabel = priorityOptions.find((p) => p.value === values.priority)?.label ?? '—'

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle className="text-base">Task Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Project" value={project?.projectName ?? '—'} />
        <Row label="Task" value={values.title || 'Not added yet'} />
        <Row label="Owner" value={values.taskOwner || 'Not assigned'} />
        <Row label="Priority" value={priorityLabel} />
        <Row label="Status" value={statusLabel} />
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Progress: {values.progress || 0}%</p>
          <Progress value={Number(values.progress) || 0} className="mt-1.5 h-1.5" />
        </div>
        <Row label="Timeline" value={`${values.startDate || '—'} to ${values.endDate || '—'}`} />
      </CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold">{label}:</span>{' '}
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}
