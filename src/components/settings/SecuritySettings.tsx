import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z
  .object({
    current: z.string().min(8, 'Min 8 characters'),
    next: z.string().min(8, 'Min 8 characters'),
    confirm: z.string().min(8, 'Min 8 characters'),
  })
  .refine((data) => data.next === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  })

type Values = z.infer<typeof schema>

export function SecuritySettings() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { current: '', next: '', confirm: '' },
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Use a strong, unique password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(() => {
              toast.success('Password updated')
              form.reset()
            })}
          >
            <Field label="Current password" error={form.formState.errors.current?.message}>
              <Input type="password" {...form.register('current')} />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="New password" error={form.formState.errors.next?.message}>
                <Input type="password" {...form.register('next')} />
              </Field>
              <Field label="Confirm new password" error={form.formState.errors.confirm?.message}>
                <Input type="password" {...form.register('confirm')} />
              </Field>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="gradient">Update password</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
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
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
