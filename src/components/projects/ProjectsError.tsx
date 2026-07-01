import { Button } from '@/components/ui/button'

export function ProjectsError() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center max-w-md">
        <div className="text-destructive mb-2">Failed to load projects</div>
        <div className="text-sm text-muted-foreground mb-4">
          Please check your connection and try again.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    </div>
  )
}
