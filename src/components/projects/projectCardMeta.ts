import type { Project } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  planning: '#3B82F6',
  in_progress: '#10B981',
  continue_development: '#8B5CF6',
  on_hold: '#F59E0B',
  completed: '#059669',
  cancelled: '#6B7280',
}

const DEFAULT_STATUS_COLOR = '#10B981'

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  tech: { label: 'Technology', color: '#60A5FA' },
  marketing: { label: 'Marketing', color: '#EC4899' },
  business: { label: 'Business', color: '#F59E0B' },
}

export function formatStatusText(status: string): string {
  return status.replace(/_/g, ' ')
}

export function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/)
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(' ') + '…'
}

export function getPillMeta(project: Project): { label: string; color: string } {
  if (project.category && CATEGORY_META[project.category]) {
    return CATEGORY_META[project.category]
  }
  return {
    label: formatStatusText(project.status),
    color: STATUS_COLORS[project.status] || DEFAULT_STATUS_COLOR,
  }
}
