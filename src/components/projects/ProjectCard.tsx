import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  CalendarDays,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { RiskBadge } from "@/components/common/RiskBadge";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { fmtDate, daysUntil } from "@/lib/date";
import { cn, getInitials } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onRemove?: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onRemove }: ProjectCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Handle optional fields with fallbacks
  const days = project.dueDate ? daysUntil(project.dueDate) : null;
  const overdue = days !== null && days < 0 && project.status !== "completed";

  const currentProgress = project.currentProgress ?? 0;
  const targetProgress = project.targetProgress ?? 100;
  const gap = targetProgress - currentProgress;
  const onTarget = currentProgress >= targetProgress;
  const progressTone = onTarget
    ? "bg-success"
    : gap > 15
      ? "bg-destructive"
      : "bg-primary";

  return (
    <Card className="group relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">


      <div className="relative">
        {/* Header — actions */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <Link
            to={`/projects/${project.id}`}
            className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight transition-colors hover:text-primary"
          >
            {project.projectName}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
                aria-label="Project actions"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit?.(project)}>
                <Pencil /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/projects/${project.id}`}>
                  <ExternalLink /> Open details
                </Link>
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

        {/* Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5 mb-3">
          <StatusBadge status={project.status} kind="project" />
          {project.priority && <PriorityBadge priority={project.priority} />}
          {project.riskLevel && <RiskBadge level={project.riskLevel} />}
        </div>

        {/* Progress block */}
        {project.currentProgress !== undefined && (
          <div className="mt-4 flex items-center gap-3">
            <Progress
              value={currentProgress}
              indicatorClassName={progressTone}
              className="h-1.5 flex-1"
            />
            <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
              {currentProgress}%
            </span>
          </div>
        )}

        {/* Description */}
        {project.description && (
          <div className="mt-3 text-xs text-muted-foreground line-clamp-2">
            {project.description}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 space-y-3 border-t border-border/50 pt-3">
          {/* Owner Info with Avatar */}
          {project.owner && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="size-7 ring-1 ring-border/50">
                      {project.owner.avatar ? (
                        <AvatarImage src={project.owner.avatar} alt={project.owner.name} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                          {getInitials(project.owner.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground">Owner</span>
                      <span className="text-xs font-medium">{project.owner.name}</span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{project.owner.name}</p>
                  <p className="text-[10px] text-muted-foreground">Owner</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Dates and Team */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="size-3" />
              <span>{project.team?.name || `Team ID: ${project.teamId}`}</span>
            </div>
            <div className="flex items-center gap-3">
              {project.createdAt && (
                <div className="flex items-center gap-1" title="Created date">
                  <Clock className="size-3" />
                  <span>{fmtDate(project.createdAt, "MMM d")}</span>
                </div>
              )}
              {project.dueDate && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    overdue && "font-medium text-destructive",
                  )}
                  title="Due date"
                >
                  <CalendarDays className="size-3" />
                  {overdue
                    ? `${Math.abs(days)}d overdue`
                    : fmtDate(project.dueDate, "MMM d")}
                </span>
              )}
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
