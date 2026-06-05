export interface WeeklyProductivityPoint {
  day: string
  tech: number
  marketing: number
  business: number
  [key: string]: string | number
}

export const weeklyProductivity: WeeklyProductivityPoint[] = [
  { day: 'Mon', tech: 72, marketing: 58, business: 64 },
  { day: 'Tue', tech: 81, marketing: 62, business: 70 },
  { day: 'Wed', tech: 76, marketing: 71, business: 68 },
  { day: 'Thu', tech: 85, marketing: 75, business: 73 },
  { day: 'Fri', tech: 90, marketing: 82, business: 79 },
  { day: 'Sat', tech: 54, marketing: 40, business: 32 },
  { day: 'Sun', tech: 22, marketing: 18, business: 14 },
]

export interface CompletionSlice {
  name: string
  value: number
  color: string
}

export const projectCompletion: CompletionSlice[] = [
  { name: 'Completed', value: 12, color: 'var(--success)' },
  { name: 'In Progress', value: 28, color: 'var(--info)' },
  { name: 'At Risk', value: 7, color: 'var(--warning)' },
  { name: 'Blocked', value: 4, color: 'var(--destructive)' },
]

export interface TeamPerformancePoint {
  team: string
  delivered: number
  planned: number
  [key: string]: string | number
}

export const teamPerformance: TeamPerformancePoint[] = [
  { team: 'Tech', delivered: 42, planned: 50 },
  { team: 'Marketing', delivered: 28, planned: 35 },
  { team: 'Business', delivered: 24, planned: 26 },
  { team: 'Design', delivered: 18, planned: 22 },
  { team: 'Ops', delivered: 14, planned: 18 },
]

export interface TaskTrendPoint {
  week: string
  completed: number
  created: number
  [key: string]: string | number
}

export const taskTrends: TaskTrendPoint[] = [
  { week: 'W18', completed: 22, created: 28 },
  { week: 'W19', completed: 31, created: 30 },
  { week: 'W20', completed: 27, created: 34 },
  { week: 'W21', completed: 35, created: 32 },
  { week: 'W22', completed: 42, created: 38 },
  { week: 'W23', completed: 38, created: 41 },
]

export interface RiskDistribution {
  level: string
  count: number
  color: string
  [key: string]: string | number
}

export const riskDistribution: RiskDistribution[] = [
  { level: 'Low', count: 18, color: 'var(--success)' },
  { level: 'Medium', count: 12, color: 'var(--info)' },
  { level: 'High', count: 8, color: 'var(--warning)' },
  { level: 'Critical', count: 3, color: 'var(--destructive)' },
]

export interface DashboardStat {
  id: string
  label: string
  value: string
  delta: number
  helper: string
  variant: 'primary' | 'success' | 'warning' | 'info' | 'danger'
}

export const dashboardStats: DashboardStat[] = [
  { id: 'projects',  label: 'Active Projects',  value: '32',   delta: 8.2,  helper: 'vs last month', variant: 'primary' },
  { id: 'tasks',     label: 'Open Tasks',       value: '184',  delta: -3.4, helper: 'vs last month', variant: 'info'    },
  { id: 'velocity',  label: 'Sprint Velocity',  value: '94%',  delta: 5.1,  helper: 'completion rate', variant: 'success' },
  { id: 'risk',      label: 'High-Risk Items',  value: '11',   delta: 12.5, helper: 'needs attention', variant: 'danger' },
]
