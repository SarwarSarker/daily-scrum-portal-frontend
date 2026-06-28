import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, ExternalLink, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { userById } from "@/mock/users";
import { projectById } from "@/mock/projects";
import { fmtDate, daysUntil } from "@/lib/date";
import { getInitials, cn } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskTableProps {
  tasks: Task[];
  onRowClick?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onRemove?: (task: Task) => void;
}

export function TaskTable({
  tasks,
  onRowClick,
  onEdit,
  onRemove,
}: TaskTableProps) {
  const [removing, setRemoving] = useState<Task | null>(null);

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-medium">Task</th>
                <th className="px-5 py-3 text-left font-medium">Project</th>
                <th className="px-5 py-3 text-left font-medium">Assignee</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Priority</th>
                <th className="px-5 py-3 text-left font-medium">Progress</th>
                <th className="px-5 py-3 text-left font-medium">Due</th>
                <th className="px-3 py-3 text-right font-medium" />
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => {
                const u = userById(t.assignedTo);
                const p = projectById(t.projectId);
                const days = daysUntil(t.dueDate);
                const overdue = days < 0 && t.status !== "completed";
                return (
                  <tr
                    key={t.id}
                    onClick={() => onRowClick?.(t)}
                    className="group cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium">{t.title}</p>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {p?.projectName}
                    </td>
                    <td className="px-5 py-3">
                      {u && (
                        <div className="flex items-center gap-2">
                          <Avatar className="size-7">
                            {u.avatar && (
                              <AvatarImage src={u.avatar} alt={u.name} />
                            )}
                            <AvatarFallback>
                              {getInitials(u.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{u.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-5 py-3">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="px-5 py-3 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <Progress value={t.progress} className="h-1.5 w-20" />
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {t.progress}%
                        </span>
                      </div>
                    </td>
                    <td
                      className={cn(
                        "px-5 py-3 text-xs whitespace-nowrap",
                        overdue
                          ? "text-destructive font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      {fmtDate(t.dueDate, "MMM d, yyyy")}
                    </td>
                    <td
                      className="px-3 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            aria-label="Task actions"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => onEdit?.(t)}>
                            <Pencil /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onRowClick?.(t)}>
                            <ExternalLink /> Open details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setRemoving(t)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 /> Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(o) => !o && setRemoving(null)}
        title={removing ? `Remove "${removing.title}"?` : "Remove task?"}
        description="This action cannot be undone."
        confirmText="Remove"
        destructive
        onConfirm={() => {
          if (removing) {
            if (onRemove) onRemove(removing);
            else toast.success(`Task "${removing.title}" removed`);
          }
          setRemoving(null);
        }}
      />
    </>
  );
}
