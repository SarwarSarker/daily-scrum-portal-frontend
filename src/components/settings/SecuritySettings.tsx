import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Laptop, ShieldCheck, Smartphone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'

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

const sessions = [
  { id: 's1', device: 'MacBook Pro · Chrome',     location: 'Dhaka, BD',        lastActive: 'Now',          current: true,  icon: Laptop     },
  { id: 's2', device: 'iPhone 15 · Safari',       location: 'Dhaka, BD',        lastActive: '2 hours ago',  current: false, icon: Smartphone },
  { id: 's3', device: 'Windows · Firefox',        location: 'Chittagong, BD',   lastActive: '3 days ago',   current: false, icon: Laptop     },
]

export function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false)
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-success" /> Two-factor authentication
          </CardTitle>
          <CardDescription>Add an extra step at sign-in to protect your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
            <div>
              <p className="text-sm font-medium">{twoFactor ? '2FA is enabled' : 'Not enabled yet'}</p>
              <p className="text-xs text-muted-foreground">
                {twoFactor ? 'You\'ll be prompted for a code each sign-in.' : 'Recommended for admins and team leads.'}
              </p>
            </div>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>Sign out of devices you no longer use.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {sessions.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-6 py-4">
                <div className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <s.icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {s.device}{' '}
                    {s.current && (
                      <span className="ml-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{s.location} · {s.lastActive}</p>
                </div>
                {!s.current && (
                  <Button variant="outline" size="sm">Sign out</Button>
                )}
              </li>
            ))}
          </ul>
          <Separator />
          <div className="flex justify-end px-6 py-4">
            <Button variant="destructive">Sign out everywhere</Button>
          </div>
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
