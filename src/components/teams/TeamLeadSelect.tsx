import { Controller, type Control } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UNASSIGNED, type TeamFormValues } from './teamFormSchema'

interface TeamLeadSelectProps {
  control: Control<TeamFormValues>
  leads: Array<{ id: string; name: string }>
}

export function TeamLeadSelect({ control, leads }: TeamLeadSelectProps) {
  return (
    <Controller
      control={control}
      name="leadId"
      render={({ field }) => (
        <Select
          value={field.value ?? UNASSIGNED}
          onValueChange={(v) => field.onChange(v === UNASSIGNED ? undefined : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Unassigned" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
            {leads.map((lead) => (
              <SelectItem key={lead.id} value={lead.id}>
                {lead.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
}
