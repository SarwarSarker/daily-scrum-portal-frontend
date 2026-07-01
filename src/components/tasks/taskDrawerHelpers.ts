import type { UserData } from '@/types/api'

export interface Comment {
  id: string
  userId: string
  body: string
  timestamp: string
}

const MOCK_COMMENTS: Omit<Comment, 'id'>[] = [
  {
    userId: 'u_2',
    body: 'Just synced with the PM team — they need this wrapped by EOW. Can we tighten the scope?',
    timestamp: '2026-05-27T08:14:00Z',
  },
  {
    userId: 'u_1',
    body: 'Let\'s drop the optional analytics step and ship the core flow first.',
    timestamp: '2026-05-27T09:02:00Z',
  },
]

export function generateSeedComments(taskId: string): Comment[] {
  return MOCK_COMMENTS.map((comment, index) => ({
    ...comment,
    id: `${taskId}-c${index + 1}`,
  }))
}

export function findUserById(userId: string, users: UserData[]): UserData | undefined {
  return users.find(user => user.id === userId)
}

export function getDueDateBadgeVariant(
  daysUntilDue: number
): 'destructive' | 'warning' | 'secondary' {
  if (daysUntilDue < 0) return 'destructive'
  if (daysUntilDue <= 3) return 'warning'
  return 'secondary'
}

export function formatDueDateText(days: number): string {
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return 'Due today'
  return `${days}d left`
}
