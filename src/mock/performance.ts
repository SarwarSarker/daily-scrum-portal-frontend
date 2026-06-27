export interface UserPerformance {
  userId: string
  tasksDelivered: number
  tasksPlanned: number
  velocity: number
  onTimeRate: number
  contribution: number
}

export const userPerformance: UserPerformance[] = [
  { userId: 'u_1', tasksDelivered: 28, tasksPlanned: 30, velocity: 93, onTimeRate: 96, contribution: 18 },
  { userId: 'u_2', tasksDelivered: 22, tasksPlanned: 26, velocity: 85, onTimeRate: 92, contribution: 15 },
  { userId: 'u_3', tasksDelivered: 26, tasksPlanned: 28, velocity: 93, onTimeRate: 88, contribution: 16 },
  { userId: 'u_4', tasksDelivered: 19, tasksPlanned: 24, velocity: 79, onTimeRate: 84, contribution: 12 },
  { userId: 'u_5', tasksDelivered: 24, tasksPlanned: 25, velocity: 96, onTimeRate: 98, contribution: 17 },
  { userId: 'u_6', tasksDelivered: 17, tasksPlanned: 22, velocity: 77, onTimeRate: 81, contribution: 10 },
  { userId: 'u_7', tasksDelivered: 21, tasksPlanned: 24, velocity: 88, onTimeRate: 90, contribution: 13 },
  { userId: 'u_8', tasksDelivered: 23, tasksPlanned: 24, velocity: 96, onTimeRate: 94, contribution: 14 },
]

export const perfByUser = (userId: string) => userPerformance.find((p) => p.userId === userId)

export interface MonthlyTrendPoint {
  month: string
  velocity: number
  delivered: number
  planned: number
}

export const monthlyTrend: MonthlyTrendPoint[] = [
  { month: 'Dec', velocity: 76, delivered: 82, planned: 108 },
  { month: 'Jan', velocity: 81, delivered: 95, planned: 117 },
  { month: 'Feb', velocity: 84, delivered: 102, planned: 121 },
  { month: 'Mar', velocity: 87, delivered: 118, planned: 136 },
  { month: 'Apr', velocity: 89, delivered: 124, planned: 139 },
  { month: 'May', velocity: 94, delivered: 142, planned: 151 },
]

export interface CategoryBreakdownPoint {
  category: string
  projects: number
  budget: number
  color: string
}

export const categoryBreakdown: CategoryBreakdownPoint[] = [
  { category: 'Tech',      projects: 14, budget: 480, color: 'var(--chart-1)' },
  { category: 'Marketing', projects: 9,  budget: 320, color: 'var(--chart-2)' },
  { category: 'Business',  projects: 7,  budget: 280, color: 'var(--chart-3)' },
  { category: 'Design',    projects: 4,  budget: 140, color: 'var(--chart-4)' },
]
