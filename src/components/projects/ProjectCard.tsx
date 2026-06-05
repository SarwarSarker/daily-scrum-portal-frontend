import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  CalendarDays,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Target,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { RiskBadge } from "@/components/common/RiskBadge";
import { UserAvatarGroup } from "@/components/common/UserAvatarGroup";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockUsers, userById } from "@/mocks/users";
import { tasksByProject } from "@/mocks/tasks";
import { fmtDate, daysUntil } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onRemove?: (project: Project) => void;
}

export function ProjectCard({ project, onEdit, onRemove }: ProjectCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const owner = userById(project.ownerId);
  const tasks = tasksByProject(project.id);
  const teammates = mockUsers.filter((u) => u.teamId === project.teamId);
  const days = daysUntil(project.dueDate);
  const overdue = days < 0 && project.status !== "completed";
  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  const gap = project.targetProgress - project.currentProgress;
  const onTarget = project.currentProgress >= project.targetProgress;
  const progressTone = onTarget
    ? "bg-success"
    : gap > 15
      ? "bg-destructive"
      : "bg-primary";

  return (
    <Card className="group relative overflow-hidden p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      

      <div className="relative">
        {/* Header — owner + actions */}
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
        <div className="mt-3 flex flex-wrap gap-1.5 mb-8">
          <StatusBadge status={project.status} kind="project" />
          <PriorityBadge priority={project.priority} />
          <RiskBadge level={project.riskLevel} />
        </div>

        {/* Progress block */}
        <div className="mt-4 flex items-center gap-3">
          <Progress
            value={project.currentProgress}
            indicatorClassName={progressTone}
            className="h-1.5 flex-1"
          />
          <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
            {project.currentProgress}%
          </span>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/50 pt-3">
          <UserAvatarGroup
            users={
              owner
                ? [owner, ...teammates.filter((u) => u.id !== owner.id)]
                : teammates
            }
            max={4}
          />
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1" title="Tasks">
              <Target className="size-3" />
              {completedTasks}/{tasks.length}
            </span>
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
