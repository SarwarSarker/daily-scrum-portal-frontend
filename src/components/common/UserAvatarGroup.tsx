import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getInitials, cn } from '@/lib/utils'

const AVATAR_COLORS = [
  'bg-indigo-500 text-white',
  'bg-emerald-500 text-white',
  'bg-rose-500 text-white',
  'bg-amber-500 text-white',
  'bg-sky-500 text-white',
  'bg-violet-500 text-white',
  'bg-teal-500 text-white',
  'bg-orange-500 text-white',
  'bg-fuchsia-500 text-white',
  'bg-cyan-500 text-white',
]

function colorFor(key: string): string {
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

interface AvatarPerson {
  id: string
  name: string
  avatar?: string | null
  designation?: string
}

interface UserAvatarGroupProps {
  users: AvatarPerson[]
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
              <AvatarFallback className={colorFor(u.id)}>
                {getInitials(u.name)}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{u.name}</p>
            {u.designation && (
              <p className="text-[10px] text-muted-foreground">{u.designation}</p>
            )}
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
