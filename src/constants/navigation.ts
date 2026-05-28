import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  UserCircle,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string | number
}

export interface NavSection {
  label?: string
  items: NavItem[]
}

export const navigation: NavSection[] = [
  {
    label: 'Workspace',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Projects', href: '/projects', icon: FolderKanban },
      { label: 'Tasks', href: '/tasks', icon: CheckSquare },
    ],
  },
  {
    label: 'Organization',
    items: [
      { label: 'Teams', href: '/teams', icon: Users },
      { label: 'Users', href: '/users', icon: UserCircle },
    ],
  },
  {
    label: 'Account',
    items: [{ label: 'Settings', href: '/settings', icon: Settings }],
  },
]
