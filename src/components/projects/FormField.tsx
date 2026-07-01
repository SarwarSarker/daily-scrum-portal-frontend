import { Controller, type Control, type FieldPath } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ProjectFormValues } from './projectFormSchema'

interface FormFieldProps {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}

export function FormField({ label, error, children, className }: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-primary">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

interface FormSelectFieldProps {
  control: Control<ProjectFormValues>
  name: FieldPath<ProjectFormValues>
  options: ReadonlyArray<{ value: string; label: string }>
  placeholder?: string
}

export function FormSelectField({
  control,
  name,
  options,
  placeholder,
}: FormSelectFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
}
