import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCreateProjectMutation, useUpdateProjectMutation, useUsers, useTeams } from '@/utils/apiHelper'
import { useAppSelector } from '@/redux/hooks'
import { FormField } from './FormField'
import { ProjectDetailsFields } from './ProjectDetailsFields'
import { ProjectLivePreview } from './ProjectLivePreview'
import {
  getDefaultFormValues,
  projectFormSchema,
  transformToApiPayload,
  type ProjectFormValues,
} from './projectFormSchema'

export type { ProjectFormValues } from './projectFormSchema'

interface ProjectFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<ProjectFormValues>
}

export function ProjectFormModal({
  open,
  onOpenChange,
  defaultValues,
}: ProjectFormModalProps) {
  const currentUser = useAppSelector(state => state.auth.user)
  const { data: users = [], isLoading: isLoadingUsers } = useUsers()
  const { data: teams = [], isLoading: isLoadingTeams } = useTeams()
  const createProjectMutation = useCreateProjectMutation()
  const updateProjectMutation = useUpdateProjectMutation()

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: getDefaultFormValues(teams),
  })

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  const handleSubmit = async (data: ProjectFormValues) => {
    try {
      if (!currentUser?.id) {
        toast.error('You must be logged in to create projects')
        return
      }

      const payload = transformToApiPayload(data, currentUser.id)

      if (defaultValues) {
        const projectId = defaultValues.name || ''
        await updateProjectMutation.mutateAsync({
          id: projectId,
          project: {
            ...payload,
            id: projectId,
          },
        })
        toast.success('Project updated successfully')
      } else {
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

  const isEditMode = Boolean(defaultValues)
  const submitButtonText = isEditMode ? 'Save changes' : 'Create project'
  const dialogTitle = isEditMode ? 'Edit project' : 'Create project'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            All fields populate the live preview as you type.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <ProjectDetailsFields form={form} teams={teams} />
            <ProjectLivePreview control={form.control} teams={teams} users={users} />
          </div>

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
