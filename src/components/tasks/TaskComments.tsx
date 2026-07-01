import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAppSelector } from '@/redux/hooks'
import { CommentItem } from './CommentItem'
import { generateSeedComments, findUserById, type Comment } from './taskDrawerHelpers'
import type { UserData } from '@/types/api'

interface TaskCommentsProps {
  taskId: string
  users: UserData[]
}

export function TaskComments({ taskId, users }: TaskCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(() => generateSeedComments(taskId))
  const [commentDraft, setCommentDraft] = useState('')
  const currentUser = useAppSelector((state) => state.auth.user)

  const handleSubmitComment = () => {
    if (!commentDraft.trim()) return

    const newComment: Comment = {
      id: `${taskId}-c${comments.length + 1}`,
      userId: currentUser?.id ?? 'u_1',
      body: commentDraft,
      timestamp: new Date().toISOString(),
    }

    setComments((prev) => [...prev, newComment])
    setCommentDraft('')
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold">Comments</p>

      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            user={findUserById(comment.userId, users)}
          />
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={commentDraft}
          onChange={(e) => setCommentDraft(e.target.value)}
          rows={2}
        />
        <Button
          onClick={handleSubmitComment}
          variant="gradient"
          size="icon"
          className="shrink-0 self-end"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  )
}
