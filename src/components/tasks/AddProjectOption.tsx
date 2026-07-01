import { Plus } from "lucide-react"

export function AddProjectOption() {
  return (
    <div className="mt-1 border-t border-border pt-1">
      <button
        type="button"
        disabled
        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium text-muted-foreground opacity-50 outline-none cursor-not-allowed"
      >
        <Plus className="size-4" /> Add project (Coming soon)
      </button>
    </div>
  )
}
