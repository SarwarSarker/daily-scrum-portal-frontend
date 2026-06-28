import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowUpRight,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatarGroup } from "@/components/common/UserAvatarGroup";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { mockUsers, userById } from "@/mock/users";
import { mockProjects } from "@/mock/projects";
import { departmentById } from "@/mock/teams";
import { getInitials, cn } from "@/lib/utils";
import type { Team } from "@/types";

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
  onEdit?: (team: Team) => void;
  onRemove?: (team: Team) => void;
}

interface DeptTheme {
  gradient: string;
  glow: string;
  badge: string;
  tile: string;
  bar: string;
}

const deptThemes: Record<string, DeptTheme> = {
  d_tech: {
    gradient: "gradient-primary",
    glow: "bg-primary",
    badge: "bg-primary/10 text-primary",
    tile: "bg-primary/10 text-primary",
    bar: "bg-primary",
  },
  d_marketing: {
    gradient: "gradient-warning",
    glow: "bg-warning",
    badge: "bg-warning/15 text-warning-foreground",
    tile: "bg-warning/15 text-warning-foreground",
    bar: "bg-warning",
  },
  d_business: {
    gradient: "gradient-success",
    glow: "bg-success",
    badge: "bg-success/10 text-success",
    tile: "bg-success/10 text-success",
    bar: "bg-success",
  },
};

export function TeamCard({ team, onClick, onEdit, onRemove }: TeamCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const lead = team.leadId ? userById(team.leadId) : undefined;
  const members = mockUsers.filter((u) => u.teamId === team.id);
  const projects = mockProjects.filter((p) => p.teamId === team.id);
  const activeProjects = projects.filter(
    (p) => p.status !== "completed" && p.status !== "cancelled",
  );
  const department = departmentById(team.departmentId);
  const theme = deptThemes[team.departmentId] ?? deptThemes.d_tech;

  const load =
    projects.length === 0
      ? 0
      : Math.round((activeProjects.length / projects.length) * 100);

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative flex flex-1 flex-col">
        {/* Department badge + actions */}
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
              theme.badge,
            )}
          >
            <span className={cn("size-1.5 rounded-full", theme.bar)} />
            {department?.name}
          </span>
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
              <DropdownMenuItem onClick={onClick}>
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
        </div>

        {/* Team identity */}
        <h3 className="mt-3 truncate text-lg font-semibold tracking-tight">
          {team.name}
        </h3>

        {/* Lead */}
        <div className="mt-3 flex items-center gap-2.5">
          {lead ? (
            <>
              <Avatar className="size-8 ring-2 ring-background">
                {lead.avatar && (
                  <AvatarImage src={lead.avatar} alt={lead.name} />
                )}
                <AvatarFallback className="text-[11px]">
                  {getInitials(lead.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium">{lead.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {lead.designation}
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No team lead assigned
            </p>
          )}
        </div>

        {/* Stat tiles */}
        <div className="p-3 flex items-center gap-2">
          <div
            className={cn(
              "grid size-6 place-items-center rounded-lg",
              theme.gradient,
            )}
          >
            <UsersIcon className="size-3 text-white" />
          </div>
          <div className="flex items-center gap-2">
          <p className="mt-1 text-xs font-bold tabular-nums leading-none">
            {members.length}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Members
          </p>
          </div>
        </div>

        {/* Project load */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">
              Project load
            </span>
            <span className="font-semibold tabular-nums">
              {activeProjects.length}/{projects.length}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", theme.bar)}
              style={{ width: `${load}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/50 pt-4">
          {members.length > 0 ? (
            <UserAvatarGroup users={members} max={5} />
          ) : (
            <span className="text-xs text-muted-foreground">
              No members yet
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className="gap-1 hover:text-foreground"
          >
            View
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Remove "${team.name}"?`}
        description="The team and its assignments will be deleted. This action cannot be undone."
        confirmText="Remove"
        destructive
        onConfirm={() => {
          if (onRemove) onRemove(team);
          else toast.success(`Team "${team.name}" removed`);
        }}
      />
    </Card>
  );
}
