import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormField } from "./FormField"
import { FormSelect } from "./FormSelect"
import { AddProjectOption } from "./AddProjectOption"
import { PRIORITY_OPTIONS, STATUS_OPTIONS, type TaskFormValues } from "./taskFormSchema"
import type { UserData, ProjectData } from "@/types/api"

interface TaskDetailsFieldsProps {
  form: UseFormReturn<TaskFormValues>
  values: TaskFormValues
  projects: ProjectData[]
  users: UserData[]
  isEditMode: boolean
}

export function TaskDetailsFields({
  form,
  values,
  projects,
  users,
  isEditMode,
}: TaskDetailsFieldsProps) {
  const { register, setValue, formState } = form

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">
          {isEditMode ? "Task Details" : "New Task Form"}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Project" error={formState.errors.projectId?.message}>
          <FormSelect
            value={values.projectId}
            onValueChange={(value) => setValue("projectId", value)}
            placeholder="Select project"
            options={projects.map((project) => ({ value: project.id, label: project.name }))}
          >
            <AddProjectOption />
          </FormSelect>
        </FormField>

        <FormField label="Assignee" error={formState.errors.assignedTo?.message}>
          <FormSelect
            value={values.assignedTo}
            onValueChange={(value) => setValue("assignedTo", value)}
            placeholder="Select user"
            options={users.map((user) => ({ value: user.name, label: user.name }))}
          />
        </FormField>

        <FormField
          label="Task Title"
          error={formState.errors.title?.message}
          className="sm:col-span-2"
        >
          <Input
            placeholder="Example: Build Revenue Dashboard API"
            {...register("title")}
          />
        </FormField>

        <FormField
          label="Short Description"
          error={formState.errors.description?.message}
          className="sm:col-span-2"
        >
          <Textarea
            rows={2}
            placeholder="One-line summary of what this task delivers"
            {...register("description")}
          />
        </FormField>

        <FormField label="Priority">
          <FormSelect
            value={values.priority}
            onValueChange={(value) => setValue("priority", value as TaskFormValues["priority"])}
            placeholder="e.g. High"
            options={PRIORITY_OPTIONS}
          />
        </FormField>

        <FormField label="Progress (%)">
          <Input
            type="number"
            min={0}
            max={100}
            {...register("progress", { valueAsNumber: true })}
          />
        </FormField>

        <FormField label="Start Date" error={formState.errors.startDate?.message}>
          <Input type="date" {...register("startDate")} />
        </FormField>

        <FormField label="End Date" error={formState.errors.endDate?.message}>
          <Input type="date" {...register("endDate")} />
        </FormField>

        <FormField label="Status">
          <FormSelect
            value={values.status}
            onValueChange={(value) => setValue("status", value as TaskFormValues["status"])}
            placeholder="e.g. In Progress"
            options={STATUS_OPTIONS}
          />
        </FormField>
      </CardContent>
    </Card>
  )
}
