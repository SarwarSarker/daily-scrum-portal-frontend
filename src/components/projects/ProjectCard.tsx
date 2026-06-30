import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowUpRight,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onRemove?: (project: Project) => void;
}

const STATUS_COLORS: Record<string, string> = {
  planning: "#3B82F6",
  in_progress: "#10B981",
  continue_development: "#8B5CF6",
  on_hold: "#F59E0B",
  completed: "#059669",
  cancelled: "#6B7280",
};

const DEFAULT_STATUS_COLOR = "#10B981";

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  tech: { label: "Technology", color: "#60A5FA" },
  marketing: { label: "Marketing", color: "#EC4899" },
  business: { label: "Business", color: "#F59E0B" },
};

/** Format a status enum value into readable text */
function formatStatusText(status: string): string {
  return status.replace(/_/g, " ");
}

/** Truncate text to a maximum number of words, appending an ellipsis when cut */
function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
}

function getPillMeta(project: Project): { label: string; color: string } {
  if (project.category && CATEGORY_META[project.category]) {
    return CATEGORY_META[project.category];
  }
  return {
    label: formatStatusText(project.status),
    color: STATUS_COLORS[project.status] || DEFAULT_STATUS_COLOR,
  };
}

export function ProjectCard({ project, onEdit, onRemove }: ProjectCardProps) {
  console.log("🚀 ~ ProjectCard ~ project:", project);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const pill = getPillMeta(project);
  const teamName = project.team?.name || `Team ${project.teamId}`;

  const handleEditClick = () => {
    onEdit?.(project);
  };

  const handleRemoveClick = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    if (onRemove) {
      onRemove(project);
    } else {
      toast.success(`Project "${project.name}" removed`);
    }
    setIsConfirmDialogOpen(false);
  };

  const handleDialogClose = () => {
    setIsConfirmDialogOpen(false);
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg",
      )}
    >
      <div className="relative space-y-3 p-6">
        {/* Header: category pill + actions */}
        <div className="flex items-start justify-between gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: `${pill.color}1a`, color: pill.color }}
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: pill.color }}
            />
            {pill.label}
          </span>

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
              <DropdownMenuItem onClick={handleEditClick} className="gap-2">
                <Pencil className="size-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="gap-2">
                <Link to={`/projects/${project.id}`}>
                  <ExternalLink className="size-4" /> Open details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleRemoveClick}
                className="gap-2 text-red-500 focus:text-red-500"
              >
                <Trash2 className="size-4" /> Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-6">
          {/* Title */}
          <Link to={`/projects/${project.id}`} className="block">
            <h3 className="truncate text-lg font-semibold tracking-tight">
              {project.name}
            </h3>
          </Link>

          {/* Description */}
          {project.description && (
            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {truncateWords(project.description, 150)}
            </p>
          )}
        </div>

        {/* Project Lead */}
        {project.owner && (
          <div className="flex items-center gap-3">
            <Avatar className="size-8 ring-2 ring-border">
              <AvatarImage
                src={
                  project.owner.avatar ||
                  `https://i.pravatar.cc/150?u=${project.owner.id}`
                }
                alt={project.owner.name}
              />
              <AvatarFallback className="bg-indigo-500 text-sm font-semibold text-white">
                {getInitials(project.owner.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="truncate text-sm font-medium">
                {project.owner.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                Project Lead
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          {/* Team */}
          <div className="flex items-center gap-3">
            <span className="grid size-6 place-items-center rounded-full bg-indigo-500">
              <Users className="size-3 text-white" />
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-foreground">
                {teamName}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Team
              </span>
            </div>
          </div>

          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View <ArrowUpRight className="size-4" />
          </Link>
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
  );
}
