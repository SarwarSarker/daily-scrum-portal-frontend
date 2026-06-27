import { useEffect } from 'react'
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
import { useCreateProjectMutation, useUpdateProjectMutation } from '@/utils/apiHelper'
import type { User, Team } from '@/types'

const statusOptions = [
  { value: 'planning',             label: 'Planning'             },
  { value: 'in_progress',          label: 'In Progress'          },
  { value: 'continue_development', label: 'Continue Development' },
  { value: 'on_hold',              label: 'On Hold'              },
  { value: 'completed',            label: 'Completed'            },
] as const

const projectSchema = z.object({
  projectName: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().max(280, 'Keep it under 280 characters').optional(),
  owner: z.string().min(1, 'Owner is required'),
  teamId: z.string().min(1, 'Team is required'),
  status: z.enum([
    'planning',
    'in_progress',
    'continue_development',
    'on_hold',
    'completed',
  ]),
  blocker: z.string().optional(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>

interface ProjectFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<ProjectFormValues>
  users: User[]
  teams: Team[]
}

export function ProjectFormModal({ open, onOpenChange, defaultValues, users, teams }: ProjectFormModalProps) {
  const createProjectMutation = useCreateProjectMutation()
  const updateProjectMutation = useUpdateProjectMutation()

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: '',
      description: '',
      owner: '',
      teamId: teams[0]?.id ?? '',
      status: 'in_progress',
      blocker: '',
    },
  })

  // Reset form when defaultValues change (for editing)
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      if (defaultValues) {
        // Update existing project
        await updateProjectMutation.mutateAsync({
          id: defaultValues.projectName || '', // You'll need to pass the project ID
          project: {
            id: defaultValues.projectName || '', // Include ID in the project object
            projectName: data.projectName,
            ownerId: data.owner,
            teamId: data.teamId,
            category: 'tech' as const, // Default or add to form
            status: data.status as 'planning' | 'in_progress' | 'continue_development' | 'on_hold' | 'completed',
            priority: 'medium' as const, // Default or add to form
            currentProgress: 0,
            targetProgress: 100,
            riskLevel: 'low' as const,
            dueDate: new Date().toISOString(),
            description: data.description || '',
          }
        })
        toast.success('Project updated successfully')
      } else {
        // Create new project
        await createProjectMutation.mutateAsync({
          projectName: data.projectName,
          ownerId: data.owner,
          teamId: data.teamId,
          category: 'tech' as const, // Default or add to form
          status: data.status as 'planning' | 'in_progress' | 'continue_development' | 'on_hold' | 'completed',
          priority: 'medium' as const, // Default or add to form
          currentProgress: 0,
          targetProgress: 100,
          riskLevel: 'low' as const,
          dueDate: new Date().toISOString(),
          description: data.description || '',
        })
        toast.success('Project created successfully')
      }
      form.reset()
      onOpenChange(false)
    } catch {
      toast.error('Failed to save project. Please try again.')
    }
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
                <Field label="Project Name" error={form.formState.errors.projectName?.message}>
                  <Input
                    placeholder="e.g. Customer Insights Platform"
                    {...form.register('projectName')}
                  />
                </Field>

                <Field label="Project Lead" error={form.formState.errors.owner?.message}>
                  <Controller
                    control={form.control}
                    name="owner"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {users.map((u) => (
                            <SelectItem key={u.id} value={u.name}>
                              {u.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
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

                <Field label="Team" error={form.formState.errors.teamId?.message}>
                  <Controller
                    control={form.control}
                    name="teamId"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {teams.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field label="Status" className="">
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

            <LivePreview control={form.control} teams={teams} />
          </div>

          <div className="grid grid-cols-1 gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Blocker / Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <Field label="Blocker / Risk">
                  <Textarea rows={3} placeholder="Write blocker if any" {...form.register('blocker')} />
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

interface LivePreviewProps {
  control: Control<ProjectFormValues>
  teams: Array<{ id: string; name: string }>
}

function LivePreview({ control, teams }: LivePreviewProps) {
  const values = useWatch({ control })
  const statusLabel = statusOptions.find((s) => s.value === values.status)?.label ?? '—'
  const team = teams.find(t => t.id === values.teamId)

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle className="text-base">Live Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Project" value={values.projectName || 'Untitled'} />
        <Row label="Project Lead" value={values.owner || 'Not assigned'} />
        <Row label="Team" value={team?.name ?? '—'} />
        <Row label="Status" value={statusLabel} />
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
