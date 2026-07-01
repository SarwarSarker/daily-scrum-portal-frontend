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
  /** Current filter values */
  value: ProjectFiltersValue
  /** Callback when filters change */
  onChange: (values: ProjectFiltersValue) => void
}

/**
 * Available category filter options
 */
const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All categories' },
  { value: 'tech', label: 'Tech' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'business', label: 'Business' },
] as const

/**
 * Available status filter options
 */
const STATUS_OPTIONS = [
  { value: 'all', label: 'All status' },
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'continue_development', label: 'Continue Development' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const

/**
 * Available priority filter options
 */
const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
] as const

/**
 * Select trigger width for filters
 */
const SELECT_TRIGGER_WIDTH = 'w-full sm:w-36'

/**
 * Search input placeholder text
 */
const SEARCH_PLACEHOLDER = 'Search projects...'

/**
 * Update a single filter value while preserving other filters
 */
function updateFilter<K extends keyof ProjectFiltersValue>(
  currentFilters: ProjectFiltersValue,
  key: K,
  value: ProjectFiltersValue[K]
): ProjectFiltersValue {
  return {
    ...currentFilters,
    [key]: value,
  }
}

export function ProjectFilters({ value, onChange }: ProjectFiltersProps) {
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFilters = updateFilter(value, 'query', event.target.value)
    onChange(updatedFilters)
  }

  const handleCategoryChange = (category: string) => {
    const updatedFilters = updateFilter(value, 'category', category as Category)
    onChange(updatedFilters)
  }

  const handleStatusChange = (status: string) => {
    const updatedFilters = updateFilter(value, 'status', status as Status)
    onChange(updatedFilters)
  }

  const handlePriorityChange = (priority: string) => {
    const updatedFilters = updateFilter(value, 'priority', priority as Priority)
    onChange(updatedFilters)
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={SEARCH_PLACEHOLDER}
          value={value.query}
          onChange={handleQueryChange}
          className="pl-9"
        />
      </div>

      {/* Category Filter */}
      <Select value={value.category} onValueChange={handleCategoryChange}>
        <SelectTrigger className={SELECT_TRIGGER_WIDTH}>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={value.status} onValueChange={handleStatusChange}>
        <SelectTrigger className={SELECT_TRIGGER_WIDTH}>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select value={value.priority} onValueChange={handlePriorityChange}>
        <SelectTrigger className={SELECT_TRIGGER_WIDTH}>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          {PRIORITY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
