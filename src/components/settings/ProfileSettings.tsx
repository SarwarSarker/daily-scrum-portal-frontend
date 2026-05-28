import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { updateUser } from '@/redux/slices/authSlice'
import { getInitials } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  designation: z.string().min(2),
  bio: z.string().max(280).optional(),
})

type Values = z.infer<typeof schema>

export function ProfileSettings() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? 'Sarwar Hossain',
      email: user?.email ?? 'sarwar@company.com',
      designation: user?.designation ?? 'Engineering Lead',
      bio: '',
    },
  })

  const onSubmit = (data: Values) => {
    dispatch(updateUser(data))
    toast.success('Profile updated')
  }

  const name = form.watch('name')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>How your name and details appear across the workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="size-20 ring-2 ring-background">
                {user?.avatar && <AvatarImage src={user.avatar} alt={name} />}
                <AvatarFallback className="text-xl">{getInitials(name)}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110"
                aria-label="Change photo"
              >
                <Camera className="size-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium">Photo</p>
              <p className="text-xs text-muted-foreground">PNG or JPG, max 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" error={form.formState.errors.name?.message}>
              <Input {...form.register('name')} />
            </Field>
            <Field label="Email" error={form.formState.errors.email?.message}>
              <Input type="email" {...form.register('email')} />
            </Field>
          </div>

          <Field label="Designation" error={form.formState.errors.designation?.message}>
            <Input {...form.register('designation')} />
          </Field>

          <Field label="Bio">
            <Textarea
              rows={3}
              placeholder="Tell your teammates a bit about you..."
              {...form.register('bio')}
            />
          </Field>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
            <Button type="submit" variant="gradient">Save changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
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
