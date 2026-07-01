import { Users as UsersIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DeptTheme } from "./teamCardThemes"

interface TeamCardStatsProps {
  memberCount: number
  activeProjects: number
  totalProjects: number
  theme: DeptTheme
}

export function TeamCardStats({
  memberCount,
  activeProjects,
  totalProjects,
  theme,
}: TeamCardStatsProps) {
  const load =
    totalProjects === 0 ? 0 : Math.round((activeProjects / totalProjects) * 100)

  return (
    <>
      <div className="p-3 flex items-center gap-2">
        <div
          className={cn("grid size-6 place-items-center rounded-lg", theme.gradient)}
        >
          <UsersIcon className="size-3 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <p className="mt-1 text-xs font-bold tabular-nums leading-none">
            {memberCount}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Members
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Project load</span>
          <span className="font-semibold tabular-nums">
            {activeProjects}/{totalProjects}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", theme.bar)}
            style={{ width: `${load}%` }}
          />
        </div>
      </div>
    </>
  )
}
