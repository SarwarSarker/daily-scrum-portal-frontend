import { formatDistanceToNow, format, differenceInCalendarDays } from 'date-fns'

/**
 * Safely parse a date string and return a Date object
 * Returns null if the date is invalid
 */
function safeParseDate(iso: string | null | undefined): Date | null {
  if (!iso) return null

  const date = new Date(iso)
  // Check if date is invalid
  if (isNaN(date.getTime())) {
    console.warn('Invalid date format:', iso)
    return null
  }
  return date
}

export const timeAgo = (iso: string) => {
  const date = safeParseDate(iso)
  if (!date) return 'Unknown'
  return formatDistanceToNow(date, { addSuffix: true })
}

export const fmtDate = (iso: string, pattern = 'MMM d') => {
  const date = safeParseDate(iso)
  if (!date) return 'Invalid date'
  return format(date, pattern)
}

export const fmtDateTime = (iso: string) => {
  const date = safeParseDate(iso)
  if (!date) return 'Invalid date'
  return format(date, 'MMM d, h:mm a')
}

export const daysUntil = (iso: string) => {
  const date = safeParseDate(iso)
  if (!date) return 0
  return differenceInCalendarDays(date, new Date())
}
