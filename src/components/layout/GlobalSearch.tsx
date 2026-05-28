import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckSquare, FolderKanban, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mockProjects } from '@/mocks/projects'
import { mockTasks } from '@/mocks/tasks'
import { mockUsers } from '@/mocks/users'
import { getInitials } from '@/lib/utils'
import type { Project, Task, User } from '@/types'

type Result =
  | { kind: 'project'; item: Project }
  | { kind: 'task'; item: Task }
  | { kind: 'user'; item: User }

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Cmd/Ctrl + K to focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const { projects, tasks, users, flat } = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { projects: [], tasks: [], users: [], flat: [] as Result[] }
    const projects = mockProjects
      .filter(
        (p) =>
          p.projectName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
      .slice(0, 4)
    const tasks = mockTasks
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      )
      .slice(0, 4)
    const users = mockUsers
      .filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      )
      .slice(0, 4)
    const flat: Result[] = [
      ...projects.map((item) => ({ kind: 'project' as const, item })),
      ...tasks.map((item) => ({ kind: 'task' as const, item })),
      ...users.map((item) => ({ kind: 'user' as const, item })),
    ]
    return { projects, tasks, users, flat }
  }, [query])

  // Reset highlight when query changes
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const close = () => {
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }

  const go = (r: Result) => {
    if (r.kind === 'project') navigate(`/projects/${r.item.id}`)
    else if (r.kind === 'task') navigate(`/tasks`)
    else if (r.kind === 'user') navigate(`/users`)
    close()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || flat.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % flat.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + flat.length) % flat.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(flat[activeIndex])
    } else if (e.key === 'Escape') {
      close()
    }
  }

  const hasResults = flat.length > 0
  const showPopover = open && query.trim().length > 0

  return (
    <Popover open={showPopover} onOpenChange={(o) => !o && setOpen(false)}>
      <PopoverAnchor asChild>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search projects, tasks, people..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => query && setOpen(true)}
            onKeyDown={onKeyDown}
            className="h-9 pl-9 pr-12"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
            ⌘K
          </kbd>
        </div>
      </PopoverAnchor>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] min-w-[20rem] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {!hasResults ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            No results for <span className="font-medium text-foreground">"{query}"</span>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto py-1">
            {projects.length > 0 && (
              <Group title="Projects">
                {projects.map((p) => {
                  const idx = flat.findIndex((r) => r.kind === 'project' && r.item.id === p.id)
                  return (
                    <ResultItem
                      key={p.id}
                      icon={<FolderKanban className="size-4 text-info" />}
                      title={p.projectName}
                      subtitle={p.description}
                      active={idx === activeIndex}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => go({ kind: 'project', item: p })}
                    />
                  )
                })}
              </Group>
            )}
            {tasks.length > 0 && (
              <Group title="Tasks">
                {tasks.map((t) => {
                  const idx = flat.findIndex((r) => r.kind === 'task' && r.item.id === t.id)
                  return (
                    <ResultItem
                      key={t.id}
                      icon={<CheckSquare className="size-4 text-warning" />}
                      title={t.title}
                      subtitle={t.description}
                      active={idx === activeIndex}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => go({ kind: 'task', item: t })}
                    />
                  )
                })}
              </Group>
            )}
            {users.length > 0 && (
              <Group title="People">
                {users.map((u) => {
                  const idx = flat.findIndex((r) => r.kind === 'user' && r.item.id === u.id)
                  return (
                    <ResultItem
                      key={u.id}
                      icon={
                        <Avatar className="size-5">
                          {u.avatar && <AvatarImage src={u.avatar} alt={u.name} />}
                          <AvatarFallback className="text-[9px]">{getInitials(u.name)}</AvatarFallback>
                        </Avatar>
                      }
                      title={u.name}
                      subtitle={u.email}
                      active={idx === activeIndex}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => go({ kind: 'user', item: u })}
                    />
                  )
                })}
              </Group>
            )}
          </div>
        )}
        <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
          <span>
            <KbdInline>↑↓</KbdInline> navigate <KbdInline>↵</KbdInline> select
          </span>
          <span>
            <KbdInline>esc</KbdInline> close
          </span>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  )
}

function ResultItem({
  icon,
  title,
  subtitle,
  active,
  onClick,
  onMouseEnter,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
  active?: boolean
  onClick: () => void
  onMouseEnter?: () => void
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
        active ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/60'
      }`}
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted">{icon}</span>
      <span className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </span>
    </button>
  )
}

function KbdInline({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
      {children}
    </kbd>
  )
}
