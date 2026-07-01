import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

interface TaskMetadataProps {
  label: string
  value: string
  avatar?: string
}

export function TaskMetadata({ label, value, avatar }: TaskMetadataProps) {
  return (
    <div className="rounded-md border border-border/60 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 flex items-center gap-2">
        {avatar && (
          <Avatar className="size-6">
            <AvatarImage src={avatar} alt={value} />
            <AvatarFallback>{getInitials(value)}</AvatarFallback>
          </Avatar>
        )}
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  )
}
