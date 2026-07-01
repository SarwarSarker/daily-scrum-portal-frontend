import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  options: ReadonlyArray<{ value: string; label: string }>
  children?: React.ReactNode
}

export function FormSelect({
  value,
  onValueChange,
  placeholder,
  options,
  children,
}: FormSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
        {children}
      </SelectContent>
    </Select>
  )
}
