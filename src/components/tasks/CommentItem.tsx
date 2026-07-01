import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { timeAgo } from '@/lib/date'
import { getInitials } from '@/lib/utils'
import type { Comment } from './taskDrawerHelpers'
import type { UserData } from '@/types/api'

interface CommentItemProps {
  comment: Comment
  user: UserData | undefined
}

export function CommentItem({ comment, user }: CommentItemProps) {
  if (!user) return null

  return (
    <div className="flex gap-3">
      <Avatar className="size-8">
        {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
        <p className="flex items-baseline justify-between gap-2 text-xs">
          <span className="font-medium">{user.name}</span>
          <span className="text-muted-foreground">{timeAgo(comment.timestamp)}</span>
        </p>
        <p className="mt-1 text-sm">{comment.body}</p>
      </div>
    </div>
  )
}
