import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockTeams } from '@/mock/teams'

export interface UserFiltersValue {
  query: string
  role: 'all' | 'admin' | 'manager' | 'team_lead' | 'member'
  teamId: 'all' | string
  status: 'all' | 'active' | 'inactive'
}

interface UserFiltersProps {
  value: UserFiltersValue
  onChange: (v: UserFiltersValue) => void
}

export function UserFilters({ value, onChange }: UserFiltersProps) {
  const set = <K extends keyof UserFiltersValue>(k: K, v: UserFiltersValue[K]) =>
    onChange({ ...value, [k]: v })

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={value.query}
          onChange={(e) => set('query', e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={value.role} onValueChange={(v) => set('role', v as UserFiltersValue['role'])}>
        <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Role" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="team_lead">Team Lead</SelectItem>
          <SelectItem value="member">Member</SelectItem>
        </SelectContent>
      </Select>

      <Select value={value.teamId} onValueChange={(v) => set('teamId', v)}>
        <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Team" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All teams</SelectItem>
          {mockTeams.map((t) => (
            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.status} onValueChange={(v) => set('status', v as UserFiltersValue['status'])}>
        <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
