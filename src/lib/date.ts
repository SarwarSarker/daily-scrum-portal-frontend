import { formatDistanceToNow, format, differenceInCalendarDays } from 'date-fns'

export const timeAgo = (iso: string) => formatDistanceToNow(new Date(iso), { addSuffix: true })

export const fmtDate = (iso: string, pattern = 'MMM d') => format(new Date(iso), pattern)

export const fmtDateTime = (iso: string) => format(new Date(iso), 'MMM d, h:mm a')

export const daysUntil = (iso: string) => differenceInCalendarDays(new Date(iso), new Date())
