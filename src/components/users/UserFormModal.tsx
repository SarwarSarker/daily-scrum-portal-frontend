import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { mockTeams } from '@/mock/teams'
import { Field } from './Field'
import { FormSelectField } from './FormSelectField'
import {
  roleOptions,
  statusOptions,
  userFormSchema,
  type UserFormValues,
} from './userFormSchema'

export type { UserFormValues } from './userFormSchema'

interface UserFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<UserFormValues>
}

export function UserFormModal({ open, onOpenChange, defaultValues }: UserFormModalProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'member',
      designation: '',
      teamId: mockTeams[0]?.id ?? '',
      status: 'active',
      ...defaultValues,
    },
  })

  const onSubmit = (data: UserFormValues) => {
    toast.success(`User "${data.name}" saved`, {
      description: 'Wire this up to your backend in src/services/api.ts.',
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Edit user' : 'Add user'}</DialogTitle>
          <DialogDescription>
            Add a new person to a team. They'll get access immediately.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" error={form.formState.errors.name?.message}>
              <Input placeholder="e.g. John Doe" {...form.register('name')} />
            </Field>
            <Field label="Email" error={form.formState.errors.email?.message}>
              <Input type="email" placeholder="you@company.com" {...form.register('email')} />
            </Field>
          </div>

          <Field label="Designation" error={form.formState.errors.designation?.message}>
            <Input placeholder="e.g. Frontend Engineer" {...form.register('designation')} />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Role">
              <FormSelectField control={form.control} name="role" options={roleOptions} />
            </Field>

            <Field label="Team" error={form.formState.errors.teamId?.message}>
              <FormSelectField
                control={form.control}
                name="teamId"
                options={mockTeams.map((team) => ({ value: team.id, label: team.name }))}
              />
            </Field>

            <Field label="Status">
              <FormSelectField control={form.control} name="status" options={statusOptions} />
            </Field>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              {defaultValues ? 'Save changes' : 'Add user'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
