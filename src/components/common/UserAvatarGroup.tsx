import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getInitials, cn } from '@/lib/utils'
import type { User } from '@/types'

interface UserAvatarGroupProps {
  users: User[]
  max?: number
  size?: 'sm' | 'md'
  className?: string
}

export function UserAvatarGroup({ users, max = 4, size = 'sm', className }: UserAvatarGroupProps) {
  const visible = users.slice(0, max)
  const extra = users.length - visible.length
  const sizeCls = size === 'sm' ? 'size-7 text-[10px]' : 'size-9 text-xs'

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((u) => (
        <Tooltip key={u.id}>
          <TooltipTrigger asChild>
            <Avatar className={cn(sizeCls, 'ring-2 ring-background')}>
              {u.avatar && <AvatarImage src={u.avatar} alt={u.name} />}
              <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{u.name}</p>
            <p className="text-[10px] text-muted-foreground">{u.designation}</p>
          </TooltipContent>
        </Tooltip>
      ))}
      {extra > 0 && (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground ring-2 ring-background',
            sizeCls,
          )}
        >
          +{extra}
        </span>
      )}
    </div>
  )
}
