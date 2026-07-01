import { useState } from 'react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { UserRow } from './UserRow'
import type { User } from '@/types'

interface UserTableProps {
  users: User[]
  onRowClick?: (user: User) => void
  onEdit?: (user: User) => void
  onRemove?: (user: User) => void
}

export function UserTable({ users, onRowClick, onEdit, onRemove }: UserTableProps) {
  const [removing, setRemoving] = useState<User | null>(null)

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-medium">User</th>
                <th className="px-5 py-3 text-left font-medium">Role</th>
                <th className="px-5 py-3 text-left font-medium">Team</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Delivered</th>
                <th className="px-3 py-3 text-right font-medium" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <UserRow
                  key={u.id}
                  user={u}
                  onRowClick={(x) => onRowClick?.(x)}
                  onEdit={(x) => onEdit?.(x)}
                  onRemove={setRemoving}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(o) => !o && setRemoving(null)}
        title={removing ? `Remove ${removing.name}?` : 'Remove user?'}
        description="They'll lose access to the workspace immediately. This action cannot be undone."
        confirmText="Remove"
        destructive
        onConfirm={() => {
          if (removing) {
            if (onRemove) onRemove(removing)
            else toast.success(`${removing.name} removed`)
          }
          setRemoving(null)
        }}
      />
    </>
  )
}
