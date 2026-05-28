import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { PageLoader } from '@/components/common/PageLoader'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setMobileSidebarOpen, toggleSidebar } from '@/redux/slices/uiSlice'
import { cn } from '@/lib/utils'

export function MainLayout() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const mobileOpen = useAppSelector((s) => s.ui.mobileSidebarOpen)
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed)

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <a
        href="#main-content"
        className="absolute left-2 top-2 z-50 -translate-y-16 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-md transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <div className="relative hidden lg:flex">
        <Sidebar variant="desktop" />

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => dispatch(toggleSidebar())}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={cn(
                'absolute top-[1.25rem] -right-3 z-40 grid size-6 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition-all',
                'hover:bg-accent hover:text-foreground hover:scale-110',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
              )}
            >
              <ChevronLeft className={cn('size-3.5 transition-transform duration-300', collapsed && 'rotate-180')} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</TooltipContent>
        </Tooltip>
      </div>

      <Sheet open={mobileOpen} onOpenChange={(open) => dispatch(setMobileSidebarOpen(open))}>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar variant="mobile" onNavigate={() => dispatch(setMobileSidebarOpen(false))} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main id="main-content" className="flex-1 overflow-y-auto" tabIndex={-1}>
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-8">
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
