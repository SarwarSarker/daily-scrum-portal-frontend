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
import { mockUsers } from '@/mock/users'
import { Field } from './Field'
import { TeamLeadSelect } from './TeamLeadSelect'
import { teamFormSchema, type TeamFormValues } from './teamFormSchema'

export type { TeamFormValues } from './teamFormSchema'

interface TeamFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<TeamFormValues>
}

export function TeamFormModal({ open, onOpenChange, defaultValues }: TeamFormModalProps) {
  const eligibleLeads = mockUsers.filter(
    (u) => u.role === 'admin' || u.role === 'manager' || u.role === 'team_lead',
  )

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: '',
      department: '',
      leadId: undefined,
      ...defaultValues,
    },
  })

  const onSubmit = (data: TeamFormValues) => {
    toast.success(`Team "${data.name}" saved`, {
      description: 'Wire this up to your backend in src/services/api.ts.',
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Edit team' : 'New team'}</DialogTitle>
          <DialogDescription>
            Group people under a department and optionally pick a lead.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Field label="Team name" error={form.formState.errors.name?.message}>
            <Input placeholder="e.g. Platform Engineering" {...form.register('name')} />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Department" error={form.formState.errors.department?.message}>
              <Input placeholder="e.g. Engineering" {...form.register('department')} />
            </Field>

            <Field label="Team lead (optional)">
              <TeamLeadSelect control={form.control} leads={eligibleLeads} />
            </Field>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              {defaultValues ? 'Save changes' : 'Create team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
