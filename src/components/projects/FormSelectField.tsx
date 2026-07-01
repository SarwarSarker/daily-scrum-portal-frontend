import { Controller, type Control, type FieldPath } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ProjectFormValues } from './projectFormSchema'

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
