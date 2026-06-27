import type { Department, Team } from '@/types'

export const mockDepartments: Department[] = [
  { id: 'd_tech',      name: 'Technology', slug: 'technology' },
  { id: 'd_marketing', name: 'Marketing',  slug: 'marketing'  },
  { id: 'd_business',  name: 'Business',   slug: 'business'   },
]

export const mockTeams: Team[] = [
  { id: 't_tech',      departmentId: 'd_tech',      name: 'Tech Squad',         leadId: 'u_1' },
  { id: 't_marketing', departmentId: 'd_marketing', name: 'Marketing Crew',     leadId: 'u_4' },
  { id: 't_business',  departmentId: 'd_business',  name: 'Business Strategy',  leadId: 'u_2' },
]

export const teamById = (id: string) => mockTeams.find((t) => t.id === id)
export const departmentById = (id: string) => mockDepartments.find((d) => d.id === id)
