import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import {
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { ConfirmDialog } from "@/components/common/ConfirmDialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"
import type { Project } from "@/types"

// ============================================================================
// TYPES
// ============================================================================

interface ProjectCardProps {
  /** Project to display */
  project: Project
  /** Callback when edit is triggered */
  onEdit?: (project: Project) => void
  /** Callback when remove is triggered */
  onRemove?: (project: Project) => void
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Status color mapping for project badges
 */
const STATUS_COLORS: Record<string, string> = {
  planning: '#3B82F6',           // Blue
  in_progress: '#10B981',        // Green
  continue_development: '#8B5CF6', // Purple
  on_hold: '#F59E0B',            // Amber
  completed: '#059669',          // Emerald
  cancelled: '#6B7280',           // Gray
}

/**
 * Default status color if no match found
 */
const DEFAULT_STATUS_COLOR = '#10B981'

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get color for project status badge
 */
function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || DEFAULT_STATUS_COLOR
}

/**
 * Format status text for display
 */
function formatStatusText(status: string): string {
  return status.replace(/_/g, ' ')
}

/**
 * Get project card styling classes
 */
function getProjectCardClasses(): string {
  return cn(
    "group relative overflow-hidden transition-all duration-300",
    "hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10",
    "bg-white",
    "border border-gray-100 hover:border-blue-300"
  )
}

/**
 * Get status badge styling
 */
function getStatusBadgeStyle(statusColor: string): React.CSSProperties {
  return {
    borderColor: statusColor,
    color: statusColor,
  }
}

/**
 * Get avatar fallback styling
 */
function getAvatarFallbackStyle(statusColor: string): React.CSSProperties {
  return {
    backgroundColor: statusColor,
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ProjectCard({ project, onEdit, onRemove }: ProjectCardProps) {
  // ============================================================================
  // STATE
  // ============================================================================
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const statusColor = getStatusColor(project.status)
  const formattedStatus = formatStatusText(project.status)
  const cardClasses = getProjectCardClasses()
  const badgeStyle = getStatusBadgeStyle(statusColor)
  const avatarFallbackStyle = getAvatarFallbackStyle(statusColor)

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  const handleEditClick = () => {
    onEdit?.(project)
  }

  const handleRemoveClick = () => {
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmRemove = () => {
    if (onRemove) {
      onRemove(project)
    } else {
      toast.success(`Project "${project.name}" removed`)
    }
    setIsConfirmDialogOpen(false)
  }

  const handleDialogClose = () => {
    setIsConfirmDialogOpen(false)
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <Card className={cardClasses}>
      <div className="relative p-5 space-y-4">
        {/* Header Section */}
        <div className="space-y-2">
          {/* Title and Actions */}
          <div className="flex items-start justify-between gap-4">
            {/* Project Title */}
            <Link
              to={`/projects/${project.id}`}
              className="flex-1 group/link"
            >
              <h3 className="line-clamp-2 text-lg font-bold text-black leading-snug">
                {project.name}
              </h3>
            </Link>

            {/* Action Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 transition-all duration-200 hover:scale-105 hover:bg-gray-100 rounded-full"
                  aria-label="Project actions"
                >
                  <MoreHorizontal className="size-4 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border border-gray-200 bg-white shadow-lg">
                <DropdownMenuItem
                  onClick={handleEditClick}
                  className="gap-2 hover:bg-blue-50"
                >
                  <Pencil className="size-4 text-blue-600" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 hover:bg-blue-50">
                  <Link to={`/projects/${project.id}`}>
                    <ExternalLink className="size-4 text-blue-600" /> Open details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleRemoveClick}
                  className="text-red-600 focus:text-red-600 gap-2 hover:bg-red-50"
                >
                  <Trash2 className="size-4" /> Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status Badge */}
          <div
            className="px-2 pt-1 pb-0.5 rounded-full border bg-transparent text-[10px] font-bold uppercase w-fit"
            style={badgeStyle}
          >
            {formattedStatus}
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Footer Section */}
        <div className="space-y-3 pt-2">
          {/* Project Owner */}
          {project.owner && (
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
              <Avatar className="size-6 ring-2 ring-white">
                {project.owner.avatar ? (
                  <AvatarImage
                    src={project.owner.avatar}
                    alt={project.owner.name}
                  />
                ) : (
                  <AvatarFallback
                    className="text-white text-[10px] font-semibold"
                    style={avatarFallbackStyle}
                  >
                    {getInitials(project.owner.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-medium">
                  Project Lead
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {project.owner.name}
                </span>
              </div>
            </div>
          )}

          {/* Team Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="size-4" />
              <span className="text-sm">
                {project.team?.name || `Team ${project.teamId}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={handleDialogClose}
        title={`Remove "${project.name}"?`}
        description="This will delete the project and its scrum history. This action cannot be undone."
        confirmText="Remove"
        destructive
        onConfirm={handleConfirmRemove}
      />
    </Card>
  )
}
