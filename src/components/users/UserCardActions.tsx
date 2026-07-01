import { useState } from 'react'
import { toast } from 'sonner'
import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { User } from '@/types'

interface UserCardActionsProps {
  user: User
  onOpen?: () => void
  onEdit?: (user: User) => void
  onRemove?: (user: User) => void
}

export function UserCardActions({ user, onOpen, onEdit, onRemove }: UserCardActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              aria-label="User actions"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onEdit?.(user)}>
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onOpen}>
              <ExternalLink /> Open profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setConfirmOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Remove ${user.name}?`}
        description="They'll lose access to the workspace immediately. This action cannot be undone."
        confirmText="Remove"
        destructive
        onConfirm={() => {
          if (onRemove) onRemove(user)
          else toast.success(`${user.name} removed`)
        }}
      />
    </>
  )
}
