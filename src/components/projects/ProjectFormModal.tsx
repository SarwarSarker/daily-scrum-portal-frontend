import { Controller, useForm, useWatch, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

const statusOptions = [
  { value: 'planning',             label: 'Planning'             },
  { value: 'in_progress',          label: 'In Progress'          },
  { value: 'continue_development', label: 'Continue Development' },
  { value: 'on_hold',              label: 'On Hold'              },
  { value: 'completed',            label: 'Completed'            },
] as const

const projectSchema = z.object({
  updateDate: z.string().min(1, 'Update date is required'),
  projectName: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().max(280, 'Keep it under 280 characters').optional(),
  owner: z.string().min(1, 'Owner is required'),
  category: z.string().min(1, 'Category is required'),
  currentProgress: z.number().min(0).max(100),
  previousProgress: z.number().min(0).max(100),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum([
    'planning',
    'in_progress',
    'continue_development',
    'on_hold',
    'completed',
  ]),
  blocker: z.string().optional(),
  nextAction: z.string().optional(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

interface ProjectFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<ProjectFormValues>
}

const today = new Date().toISOString().slice(0, 10)
const inAMonth = new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10)

export function ProjectFormModal({ open, onOpenChange, defaultValues }: ProjectFormModalProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      updateDate: today,
      projectName: '',
      description: '',
      owner: '',
      category: '',
      currentProgress: 0,
      previousProgress: 0,
      startDate: today,
      endDate: inAMonth,
      status: 'in_progress',
      blocker: '',
      nextAction: '',
      ...defaultValues,
    },
  })

  const onSubmit = (data: ProjectFormValues) => {
    toast.success(`Project "${data.projectName}" saved`, {
      description: 'Wire this up to your backend in src/services/api.ts.',
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Edit project' : 'Create project'}</DialogTitle>
          <DialogDescription>
            All fields populate the live preview as you type.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Update Date" error={form.formState.errors.updateDate?.message}>
                  <Input type="date" {...form.register('updateDate')} />
                </Field>

                <Field label="Project Name" error={form.formState.errors.projectName?.message}>
                  <Input
                    placeholder="e.g. Customer Insights Platform"
                    {...form.register('projectName')}
                  />
                </Field>

                <Field label="Owner" error={form.formState.errors.owner?.message}>
                  <Input placeholder="e.g. John Doe" {...form.register('owner')} />
                </Field>

                <Field
                  label="Short Description"
                  error={form.formState.errors.description?.message}
                  className="sm:col-span-2"
                >
                  <Textarea
                    rows={2}
                    placeholder="One-line summary of the project goal"
                    {...form.register('description')}
                  />
                </Field>

                <Field label="Category" error={form.formState.errors.category?.message}>
                  <Input placeholder="Example: Portal" {...form.register('category')} />
                </Field>

                <Field label="Current Progress (%)">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    {...form.register('currentProgress', { valueAsNumber: true })}
                  />
                </Field>

                <Field label="Previous Progress (%)">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    {...form.register('previousProgress', { valueAsNumber: true })}
                  />
                </Field>

                <Field label="Start Date" error={form.formState.errors.startDate?.message}>
                  <Input type="date" {...form.register('startDate')} />
                </Field>

                <Field label="End Date" error={form.formState.errors.endDate?.message}>
                  <Input type="date" {...form.register('endDate')} />
                </Field>

                <Field label="Status" className="sm:col-span-2">
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </CardContent>
            </Card>

            <LivePreview control={form.control} />
          </div>

          <div className="grid grid-cols-1 gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Blocker &amp; Next Action</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Blocker / Risk">
                  <Textarea rows={3} placeholder="Write blocker if any" {...form.register('blocker')} />
                </Field>
                <Field label="Next Action">
                  <Textarea
                    rows={3}
                    placeholder="Write next action for tomorrow / this week"
                    {...form.register('nextAction')}
                  />
                </Field>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              {defaultValues ? 'Save changes' : 'Create project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
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

function LivePreview({ control }: { control: Control<ProjectFormValues> }) {
  const values = useWatch({ control })
  const statusLabel = statusOptions.find((s) => s.value === values.status)?.label ?? '—'
  const movement = (Number(values.currentProgress) || 0) - (Number(values.previousProgress) || 0)

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle className="text-base">Live Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Project" value={values.projectName || 'Untitled'} />
        <Row label="Owner" value={values.owner || 'Not assigned'} />
        <Row label="Status" value={statusLabel} />
        <Row
          label="Weekly Movement"
          value={`${movement > 0 ? '+' : ''}${movement}%`}
          valueClass={movement > 0 ? 'text-success font-semibold' : movement < 0 ? 'text-destructive font-semibold' : 'text-muted-foreground'}
        />
        <Row label="Timeline" value={`${values.startDate || '—'} to ${values.endDate || '—'}`} />
      </CardContent>
    </Card>
  )
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div>
      <span className="font-semibold">{label}:</span>{' '}
      <span className={valueClass ?? 'text-muted-foreground'}>{value}</span>
    </div>
  )
}
