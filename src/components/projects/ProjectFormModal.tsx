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
import { useCreateProjectMutation, useUpdateProjectMutation, useUsers, useTeams } from '@/utils/apiHelper'
import { useAppSelector } from '@/redux/hooks'
import type { CreateProjectData } from '@/types/api'

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Available project status options
 */
const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'continue_development', label: 'Continue Development' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
] as const

/**
 * Default project status
 */
const DEFAULT_STATUS = 'in_progress'

// ============================================================================
// FORM SCHEMA & TYPES
// ============================================================================

/**
 * Project form validation schema
 */
const projectFormSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
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

export type ProjectFormValues = z.infer<typeof projectFormSchema>

interface ProjectFormModalProps {
  /** Whether the modal is open */
  open: boolean
  /** Callback to control modal state */
  onOpenChange: (open: boolean) => void
  /** Default values for edit mode */
  defaultValues?: Partial<ProjectFormValues>
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Transform form values to API payload format
 */
function transformToApiPayload(
  formValues: ProjectFormValues,
  currentUserId: string
): CreateProjectData {
  return {
    name: formValues.name,
    owner_id: parseInt(formValues.owner),
    team_id: parseInt(formValues.teamId),
    created_by: parseInt(currentUserId),
    status: formValues.status,
    description: formValues.description || '',
    blocker: formValues.blocker || '',
  }
}

/**
 * Get default form values
 */
function getDefaultFormValues(teams: Array<{ id: string }>): Partial<ProjectFormValues> {
  return {
    name: '',
    description: '',
    owner: '',
    teamId: teams[0]?.id ?? '',
    status: DEFAULT_STATUS,
    blocker: '',
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
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-primary">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

/**
 * Live preview card component
 */
function LivePreview({
  control,
  teams,
}: {
  control: Control<ProjectFormValues>
  teams: Array<{ id: string; name: string }>
}) {
  const values = useWatch({ control })

  // Find display values
  const statusLabel = STATUS_OPTIONS.find(s => s.value === values.status)?.label ?? '—'
  const team = teams.find(t => t.id === values.teamId)

  return (
    <Card className="self-start">
      <CardHeader>
        <CardTitle className="text-base">Live Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <PreviewRow label="Project" value={values.name || 'Untitled'} />
        <PreviewRow label="Project Lead" value={values.owner || 'Not assigned'} />
        <PreviewRow label="Team" value={team?.name ?? '—'} />
        <PreviewRow label="Status" value={statusLabel} />
      </CardContent>
    </Card>
  )
}

/**
 * Display row for preview
 */
function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold">{label}:</span>{' '}
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ProjectFormModal({
  open,
  onOpenChange,
  defaultValues,
}: ProjectFormModalProps) {
  // ============================================================================
  // DATA FETCHING
  // ============================================================================
  const currentUser = useAppSelector(state => state.auth.user)
  const { data: users = [], isLoading: isLoadingUsers } = useUsers()
  const { data: teams = [], isLoading: isLoadingTeams } = useTeams()
  const createProjectMutation = useCreateProjectMutation()
  const updateProjectMutation = useUpdateProjectMutation()

  // ============================================================================
  // FORM SETUP
  // ============================================================================
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: getDefaultFormValues(teams),
  })

  // ============================================================================
  // EFFECTS
  // ============================================================================
  // Reset form when defaultValues change (for editing)
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  const handleSubmit = async (data: ProjectFormValues) => {
    try {
      if (!currentUser?.id) {
        toast.error('You must be logged in to create projects')
        return
      }

      // Transform form data to API format
      const payload = transformToApiPayload(data, currentUser.id)

      if (defaultValues) {
        // Update existing project
        const projectId = defaultValues.name || '' // TODO: This should be the actual project ID
        await updateProjectMutation.mutateAsync({
          id: projectId,
          project: {
            ...payload,
            id: projectId,
          },
        })
        toast.success('Project updated successfully')
      } else {
        // Create new project
        await createProjectMutation.mutateAsync(payload)
        toast.success('Project created successfully')
      }

      form.reset()
      onOpenChange(false)
    } catch {
      toast.error('Failed to save project. Please try again.')
    }
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  // ============================================================================
  // LOADING STATE
  // ============================================================================
  if (isLoadingUsers || isLoadingTeams) {
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
  const submitButtonText = isEditMode ? 'Save changes' : 'Create project'
  const dialogTitle = isEditMode ? 'Edit project' : 'Create project'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            All fields populate the live preview as you type.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Main Form Area */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Form Fields */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Project Name */}
                <FormField
                  label="Project Name"
                  error={form.formState.errors.name?.message}
                >
                  <Input
                    placeholder="e.g. Customer Insights Platform"
                    {...form.register('name')}
                  />
                </FormField>

                {/* Project Lead */}
                <FormField
                  label="Project Lead"
                  error={form.formState.errors.owner?.message}
                >
                  <Controller
                    control={form.control}
                    name="owner"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.name}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
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
                    placeholder="One-line summary of the project goal"
                    {...form.register('description')}
                  />
                </FormField>

                {/* Team */}
                <FormField
                  label="Team"
                  error={form.formState.errors.teamId?.message}
                >
                  <Controller
                    control={form.control}
                    name="teamId"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                {/* Status */}
                <FormField label="Status">
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <LivePreview control={form.control} teams={teams} />
          </div>

          {/* Blocker/Risk Section */}
          <div className="grid grid-cols-1 gap-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Blocker / Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField label="Blocker / Risk">
                  <Textarea
                    rows={3}
                    placeholder="Write blocker if any"
                    {...form.register('blocker')}
                  />
                </FormField>
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
    </Dialog>
  )
}
