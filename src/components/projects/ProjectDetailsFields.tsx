import type { UseFormReturn } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from './FormField'
import { FormSelectField } from './FormSelectField'
import { STATUS_OPTIONS, type ProjectFormValues } from './projectFormSchema'

interface ProjectDetailsFieldsProps {
  form: UseFormReturn<ProjectFormValues>
  users: Array<{ id: string; name: string }>
  teams: Array<{ id: string; name: string }>
}

export function ProjectDetailsFields({ form, users, teams }: ProjectDetailsFieldsProps) {
  const { register, control, formState } = form

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Project Details</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Project Name" error={formState.errors.name?.message}>
          <Input
            placeholder="e.g. Customer Insights Platform"
            {...register('name')}
          />
        </FormField>

        <FormField label="Project Lead" error={formState.errors.owner?.message}>
          <FormSelectField
            control={control}
            name="owner"
            placeholder="Select project lead"
            options={users.map((user) => ({ value: user.id, label: user.name }))}
          />
        </FormField>

        <FormField
          label="Short Description"
          error={formState.errors.description?.message}
          className="sm:col-span-2"
        >
          <Textarea
            rows={2}
            placeholder="One-line summary of the project goal"
            {...register('description')}
          />
        </FormField>

        <FormField label="Team" error={formState.errors.teamId?.message}>
          <FormSelectField
            control={control}
            name="teamId"
            placeholder="Select team"
            options={teams.map((team) => ({ value: team.id, label: team.name }))}
          />
        </FormField>

        <FormField label="Status">
          <FormSelectField control={control} name="status" options={STATUS_OPTIONS} />
        </FormField>
      </CardContent>
    </Card>
  )
}
