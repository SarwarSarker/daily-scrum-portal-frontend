export interface DeptTheme {
  gradient: string
  glow: string
  badge: string
  tile: string
  bar: string
}

const deptThemes: Record<string, DeptTheme> = {
  d_tech: {
    gradient: "gradient-primary",
    glow: "bg-primary",
    badge: "bg-primary/10 text-primary",
    tile: "bg-primary/10 text-primary",
    bar: "bg-primary",
  },
  d_marketing: {
    gradient: "gradient-warning",
    glow: "bg-warning",
    badge: "bg-warning/15 text-warning-foreground",
    tile: "bg-warning/15 text-warning-foreground",
    bar: "bg-warning",
  },
  d_business: {
    gradient: "gradient-success",
    glow: "bg-success",
    badge: "bg-success/10 text-success",
    tile: "bg-success/10 text-success",
    bar: "bg-success",
  },
}

export function getDeptTheme(departmentId: string): DeptTheme {
  return deptThemes[departmentId] ?? deptThemes.d_tech
}
