import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { mockUsers } from '@/mocks/users'

const schema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters'),
  department: z.string().min(2, 'Department is required'),
  leadId: z.string().optional(),
})

export type TeamFormValues = z.infer<typeof schema>

interface TeamFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<TeamFormValues>
}

const UNASSIGNED = '__none__'

export function TeamFormModal({ open, onOpenChange, defaultValues }: TeamFormModalProps) {
  const eligibleLeads = mockUsers.filter(
    (u) => u.role === 'admin' || u.role === 'manager' || u.role === 'team_lead',
  )

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(schema),
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
              <Controller
                control={form.control}
                name="leadId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? UNASSIGNED}
                    onValueChange={(v) => field.onChange(v === UNASSIGNED ? undefined : v)}
                  >
                    <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                      {eligibleLeads.map((u) => (
                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
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

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold uppercase tracking-wider text-primary">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
