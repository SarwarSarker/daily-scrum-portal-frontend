import { Fragment, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function titleCase(slug: string) {
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

export function Breadcrumbs({ className }: { className?: string }) {
  const { pathname } = useLocation()
  const parts = useMemo(() => pathname.split('/').filter(Boolean), [pathname])

  if (parts.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
      <Link to="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
        Home
      </Link>
      {parts.map((part, idx) => {
        const href = '/' + parts.slice(0, idx + 1).join('/')
        const isLast = idx === parts.length - 1
        return (
          <Fragment key={href}>
            <ChevronRight className="size-3.5 text-muted-foreground/60" />
            {isLast ? (
              <span className="font-medium text-foreground">{titleCase(part)}</span>
            ) : (
              <Link to={href} className="text-muted-foreground transition-colors hover:text-foreground">
                {titleCase(part)}
              </Link>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
