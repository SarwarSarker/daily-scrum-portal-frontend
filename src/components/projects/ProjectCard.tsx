import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

export function ProjectCard({ project, onEdit, onRemove }: ProjectCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: '#3B82F6',      // Blue
      in_progress: '#10B981',   // Green
      continue_development: '#8B5CF6', // Purple
      on_hold: '#F59E0B',       // Amber
      completed: '#059669',      // Emerald
      cancelled: '#6B7280'       // Gray
    };
    return colors[status] || '#10B981';
  };

  const statusColor = getStatusColor(project.status);

  const currentProgress = project.currentProgress ?? 0;

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300",
      "hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10",
      "bg-white",
      "border border-gray-100 hover:border-blue-300"
    )}>


      <div className="relative p-5 space-y-4">
        {/* Header with title, status badge and actions */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <Link
              to={`/projects/${project.id}`}
              className="flex-1 group/link"
            >
              <h3 className="line-clamp-2 text-lg font-bold text-black leading-snug">
                {project.projectName}
              </h3>
            </Link>
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
                <DropdownMenuItem onClick={() => onEdit?.(project)} className="gap-2 hover:bg-blue-50">
                  <Pencil className="size-4 text-blue-600" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="gap-2 hover:bg-blue-50">
                  <Link to={`/projects/${project.id}`}>
                    <ExternalLink className="size-4 text-blue-600" /> Open details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setConfirmOpen(true)}
                  className="text-red-600 focus:text-red-600 gap-2 hover:bg-red-50"
                >
                  <Trash2 className="size-4" /> Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="px-2 pt-1 pb-0.5 rounded-full border bg-transparent text-[10px] font-bold uppercase w-fit" style={{ borderColor: statusColor, color: statusColor }}>
            {project.status.replace('_', ' ')}
          </div>
        </div>

        {/* Description/Note */}
        {project.description && (
          <p className="text-sm text-gray-600 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Progress Section */}
        {project.currentProgress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm text-gray-600">{currentProgress}%</span>
            </div>
            <div className="relative h-1">
              <Progress
                value={currentProgress}
                indicatorClassName="h-full bg-[#4CAF50] transition-all duration-500"
                className="h-full bg-[#E0E0E0] rounded-full overflow-hidden"
              />
            </div>
          </div>
        )}

        {/* Footer Section */}
        <div className="space-y-3 pt-2">
          {/* Project Lead - Full Width */}
          {project.owner && (
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
              <Avatar className="size-6 ring-2 ring-white">
                {project.owner.avatar ? (
                  <AvatarImage src={project.owner.avatar} alt={project.owner.name} />
                ) : (
                  <AvatarFallback className="bg-blue-500 text-white text-[10px] font-semibold" style={{ backgroundColor: statusColor }}>
                    {getInitials(project.owner.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-medium">Project Lead</span>
                <span className="text-sm font-semibold text-gray-900">{project.owner.name}</span>
              </div>
            </div>
          )}

          {/* Team and End Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="size-4" />
              <span className="text-sm">{project.team?.name || `Team ${project.teamId}`}</span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Remove "${project.projectName}"?`}
        description="This will delete the project and its scrum history. This action cannot be undone."
        confirmText="Remove"
        destructive
        onConfirm={() => {
          if (onRemove) onRemove(project);
          else toast.success(`Project "${project.projectName}" removed`);
        }}
      />
    </Card>
  );
}
