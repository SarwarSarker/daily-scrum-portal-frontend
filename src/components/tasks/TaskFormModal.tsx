import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useProjects, useUsers } from "@/utils/apiHelper"
import { TaskDetailsFields } from "./TaskDetailsFields"
import { TaskPreview } from "./TaskPreview"
import {
  getDefaultFormValues,
  taskFormSchema,
  type TaskFormValues,
} from "./taskFormSchema"

export type { TaskFormValues } from "./taskFormSchema"

interface TaskFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<TaskFormValues>
}

export function TaskFormModal({
  open,
  onOpenChange,
  defaultValues,
}: TaskFormModalProps) {
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects()
  const { data: users = [], isLoading: isLoadingUsers } = useUsers()

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: getDefaultFormValues(defaultValues),
  })

  const formValues = useWatch({ control: form.control }) as TaskFormValues

  const handleSubmit = (data: TaskFormValues) => {
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

  const isEditMode = Boolean(defaultValues)
  const submitButtonText = isEditMode ? "Save changes" : "Create task"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit task" : "Create task"}</DialogTitle>
          <DialogDescription>
            All fields populate the preview on the right in real time.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <TaskDetailsFields
              form={form}
              values={formValues}
              projects={projects}
              users={users}
              isEditMode={isEditMode}
            />
            <TaskPreview values={formValues} projects={projects} users={users} />
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
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
