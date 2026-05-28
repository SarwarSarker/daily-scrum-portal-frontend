import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { useTheme, type Theme } from '@/components/providers/ThemeProvider'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const themes: Array<{ value: Theme; label: string; description: string; icon: LucideIcon }> = [
  { value: 'light',  label: 'Light',  description: 'Bright, default surface', icon: Sun },
  { value: 'dark',   label: 'Dark',   description: 'Easy on the eyes',         icon: Moon },
  { value: 'system', label: 'System', description: 'Follows OS preference',    icon: Monitor },
]

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')
  const [reducedMotion, setReducedMotion] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Theme, density, and motion preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <div>
            <p className="text-sm font-medium">Theme</p>
            <p className="text-xs text-muted-foreground">Pick how the app looks for you.</p>
          </div>
          <RadioGroup value={theme} onValueChange={(v) => setTheme(v as Theme)} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {themes.map((t) => (
              <Label
                key={t.value}
                htmlFor={`theme-${t.value}`}
                className={cn(
                  'flex cursor-pointer flex-col items-start gap-2 rounded-lg border border-border p-4 transition-colors',
                  'hover:bg-accent',
                  theme === t.value && 'border-primary bg-accent/40 shadow-sm',
                )}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <t.icon className={cn('size-5', theme === t.value && 'text-primary')} />
                  <RadioGroupItem id={`theme-${t.value}`} value={t.value} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </section>

        <Separator />

        <section className="space-y-3">
          <div>
            <p className="text-sm font-medium">Density</p>
            <p className="text-xs text-muted-foreground">How tightly we pack content.</p>
          </div>
          <RadioGroup
            value={density}
            onValueChange={(v) => setDensity(v as typeof density)}
            className="grid grid-cols-2 gap-3"
          >
            <Label
              htmlFor="density-comfortable"
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3',
                density === 'comfortable' && 'border-primary bg-accent/40',
              )}
            >
              <RadioGroupItem id="density-comfortable" value="comfortable" />
              <div>
                <p className="text-sm font-medium">Comfortable</p>
                <p className="text-xs text-muted-foreground">Default spacing</p>
              </div>
            </Label>
            <Label
              htmlFor="density-compact"
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3',
                density === 'compact' && 'border-primary bg-accent/40',
              )}
            >
              <RadioGroupItem id="density-compact" value="compact" />
              <div>
                <p className="text-sm font-medium">Compact</p>
                <p className="text-xs text-muted-foreground">More on screen</p>
              </div>
            </Label>
          </RadioGroup>
        </section>

        <Separator />

        <section className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Reduce motion</p>
            <p className="text-xs text-muted-foreground">Disable non-essential animations.</p>
          </div>
          <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
        </section>
      </CardContent>
    </Card>
  )
}
