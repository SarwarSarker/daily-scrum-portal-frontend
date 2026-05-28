export type ActivityType = 'update' | 'blocker' | 'completion' | 'comment' | 'risk'

export interface ActivityEntry {
  id: string
  type: ActivityType
  userId: string
  message: string
  context?: string
  timestamp: string
}

export const activityFeed: ActivityEntry[] = [
  {
    id: 'a_1',
    type: 'completion',
    userId: 'u_8',
    message: 'completed task',
    context: 'Finalize button + input token contract',
    timestamp: '2026-05-27T08:42:00Z',
  },
  {
    id: 'a_2',
    type: 'blocker',
    userId: 'u_3',
    message: 'flagged a blocker on',
    context: 'Refactor auth middleware to JWT v2',
    timestamp: '2026-05-27T08:10:00Z',
  },
  {
    id: 'a_3',
    type: 'update',
    userId: 'u_4',
    message: 'submitted scrum update for',
    context: 'Q3 Brand Campaign',
    timestamp: '2026-05-27T07:55:00Z',
  },
  {
    id: 'a_4',
    type: 'risk',
    userId: 'u_1',
    message: 'escalated risk on',
    context: 'Performance Marketing Sprint',
    timestamp: '2026-05-27T07:32:00Z',
  },
  {
    id: 'a_5',
    type: 'comment',
    userId: 'u_2',
    message: 'commented on',
    context: 'Enterprise Sales Playbook',
    timestamp: '2026-05-26T18:14:00Z',
  },
  {
    id: 'a_6',
    type: 'completion',
    userId: 'u_5',
    message: 'closed PR for',
    context: 'Service mesh observability dashboards',
    timestamp: '2026-05-26T16:48:00Z',
  },
  {
    id: 'a_7',
    type: 'update',
    userId: 'u_7',
    message: 'pushed an update to',
    context: 'Partner Portal Launch',
    timestamp: '2026-05-26T14:22:00Z',
  },
]

export interface UpcomingEvent {
  id: string
  title: string
  date: string
  team: string
  variant: 'primary' | 'success' | 'warning' | 'info'
}

export const upcomingEvents: UpcomingEvent[] = [
  { id: 'e_1', title: 'Daily standup — Tech',        date: '2026-05-28T09:00:00Z', team: 'Tech',      variant: 'primary' },
  { id: 'e_2', title: 'Sprint review — Marketing',   date: '2026-05-28T14:30:00Z', team: 'Marketing', variant: 'warning' },
  { id: 'e_3', title: 'Quarterly OKR alignment',     date: '2026-05-29T11:00:00Z', team: 'All',       variant: 'info'    },
  { id: 'e_4', title: 'Release checkpoint — Mobile', date: '2026-05-30T10:00:00Z', team: 'Tech',      variant: 'success' },
]
