import { type LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-zinc-800/60">
        <Icon className="size-7 text-zinc-500" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-zinc-300">{title}</p>
        <p className="max-w-[40ch] text-xs text-zinc-500">{description}</p>
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
