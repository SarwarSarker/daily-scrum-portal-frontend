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
import { mockTeams } from '@/mocks/teams'

const roleOptions = [
  { value: 'admin',     label: 'Admin'     },
  { value: 'manager',   label: 'Manager'   },
  { value: 'team_lead', label: 'Team Lead' },
  { value: 'member',    label: 'Member'    },
] as const

const statusOptions = [
  { value: 'active',   label: 'Active'   },
  { value: 'inactive', label: 'Inactive' },
] as const

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  role: z.enum(['admin', 'manager', 'team_lead', 'member']),
  designation: z.string().min(2, 'Designation is required'),
  teamId: z.string().min(1, 'Pick a team'),
  status: z.enum(['active', 'inactive']),
})

export type UserFormValues = z.infer<typeof schema>

interface UserFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<UserFormValues>
}

export function UserFormModal({ open, onOpenChange, defaultValues }: UserFormModalProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
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
              <Controller
                control={form.control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
                      {mockTeams.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field label="Status">
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
