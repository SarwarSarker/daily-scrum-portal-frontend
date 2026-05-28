import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from './Logo'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { navigation } from '@/constants/navigation'
import { useAppSelector } from '@/redux/hooks'
import { cn } from '@/lib/utils'

interface SidebarProps {
  variant?: 'desktop' | 'mobile'
  onNavigate?: () => void
}

export function Sidebar({ variant = 'desktop', onNavigate }: SidebarProps) {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed) && variant === 'desktop'

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300',
        variant === 'desktop' && (collapsed ? 'w-[72px]' : 'w-64'),
        variant === 'mobile' && 'w-full',
      )}
    >
      <div
        className={cn(
          'flex h-16 items-center border-b border-sidebar-border px-4',
          collapsed && 'justify-center px-0',
        )}
      >
        <Logo collapsed={collapsed} />
      </div>

      <ScrollArea className="flex-1">
        <nav className="space-y-6 p-3">
          {navigation.map((section) => (
            <div key={section.label ?? 'group'} className="space-y-1">
              {section.label && !collapsed && (
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </p>
              )}
              {section.items.map((item) => {
                const link = (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.href === '/dashboard'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        collapsed && 'justify-center px-0',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-primary'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <AnimatePresence>
                          {isActive && !collapsed && (
                            <motion.span
                              layoutId="sidebar-active-pill"
                              className="absolute left-0 h-6 w-1 rounded-r-full bg-sidebar-primary"
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                        </AnimatePresence>
                        <item.icon className={cn('size-4 shrink-0', isActive && 'text-sidebar-primary')} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                        {!collapsed && item.badge && (
                          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                )

                return collapsed ? (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  link
                )
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {!collapsed && (
        <>
          <Separator />
          <div className="p-3">
            <div className="rounded-lg border border-dashed border-sidebar-border p-3 text-xs text-muted-foreground">
              <p className="font-medium text-sidebar-foreground">Need help?</p>
              <p>Check the docs or contact support.</p>
            </div>
          </div>
        </>
      )}
    </aside>
  )
}
