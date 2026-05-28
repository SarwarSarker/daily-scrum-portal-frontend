import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Project } from '@/types'

export type Category = Project['category'] | 'all'
export type Status = Project['status'] | 'all'
export type Priority = Project['priority'] | 'all'

export interface ProjectFiltersValue {
  query: string
  category: Category
  status: Status
  priority: Priority
}

interface ProjectFiltersProps {
  value: ProjectFiltersValue
  onChange: (v: ProjectFiltersValue) => void
}

export function ProjectFilters({ value, onChange }: ProjectFiltersProps) {
  const set = <K extends keyof ProjectFiltersValue>(key: K, v: ProjectFiltersValue[K]) =>
    onChange({ ...value, [key]: v })

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={value.query}
          onChange={(e) => set('query', e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={value.category} onValueChange={(v) => set('category', v as Category)}>
        <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Category" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          <SelectItem value="tech">Tech</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="business">Business</SelectItem>
        </SelectContent>
      </Select>

      <Select value={value.status} onValueChange={(v) => set('status', v as Status)}>
        <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="planning">Planning</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="continue_development">Continue Development</SelectItem>
          <SelectItem value="on_hold">On Hold</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select value={value.priority} onValueChange={(v) => set('priority', v as Priority)}>
        <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
