import { useState } from 'react'
import { Link } from 'react-router-dom'
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
import type { Project } from '@/types'

interface ProjectCardActionsProps {
  project: Project
  onEdit?: (project: Project) => void
  onRemove?: (project: Project) => void
}

export function ProjectCardActions({ project, onEdit, onRemove }: ProjectCardActionsProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const handleConfirmRemove = () => {
    if (onRemove) {
      onRemove(project)
    } else {
      toast.success(`Project "${project.name}" removed`)
    }
    setIsConfirmDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full text-muted-foreground transition-all duration-200 hover:scale-105 hover:bg-accent hover:text-foreground"
            aria-label="Project actions"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onEdit?.(project)} className="gap-2">
            <Pencil className="size-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="gap-2">
            <Link to={`/projects/${project.id}`}>
              <ExternalLink className="size-4" /> Open details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsConfirmDialogOpen(true)}
            className="gap-2 text-red-500 focus:text-red-500"
          >
            <Trash2 className="size-4" /> Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={() => setIsConfirmDialogOpen(false)}
        title={`Remove "${project.name}"?`}
        description="This will delete the project and its scrum history. This action cannot be undone."
        confirmText="Remove"
        destructive
        onConfirm={handleConfirmRemove}
      />
    </>
  )
}
