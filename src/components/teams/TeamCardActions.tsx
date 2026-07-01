import { useState } from "react"
import { toast } from "sonner"
import { ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Team } from "@/types"

interface TeamCardActionsProps {
  team: Team
  onOpen?: () => void
  onEdit?: (team: Team) => void
  onRemove?: (team: Team) => void
}

export function TeamCardActions({ team, onOpen, onEdit, onRemove }: TeamCardActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="-mr-2 -mt-1 size-7 shrink-0"
            aria-label="Team actions"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => onEdit?.(team)}>
            <Pencil /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpen}>
            <ExternalLink /> Open details
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

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Remove "${team.name}"?`}
        description="The team and its assignments will be deleted. This action cannot be undone."
        confirmText="Remove"
        destructive
        onConfirm={() => {
          if (onRemove) onRemove(team)
          else toast.success(`Team "${team.name}" removed`)
        }}
      />
    </>
  )
}
