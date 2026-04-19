import { cn } from "@/lib/utils"

type Tone = "expired" | "urgent" | "soon" | "fresh"

function getTone(daysLeft: number): Tone {
  if (daysLeft < 0) return "expired"
  if (daysLeft <= 3) return "urgent"
  if (daysLeft <= 7) return "soon"
  return "fresh"
}

function getLabel(daysLeft: number): string {
  if (daysLeft < 0) return "Po terminie"
  if (daysLeft === 0) return "Dziś!"
  if (daysLeft === 1) return "1 dzień"
  if (daysLeft < 5) return `${daysLeft} dni`
  return `${daysLeft} dni`
}

const TONE_STYLES: Record<Tone, string> = {
  expired: "bg-muted text-muted-foreground border-border",
  urgent: "bg-red-500/15 text-red-400 border-red-500/20",
  soon: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  fresh: "bg-sky-500/15 text-sky-400 border-sky-500/20",
}

interface DeadlineProximityProps {
  deadline: string
  className?: string
}

// Compact pill used in tender cards and lists to visually flag urgency at a
// glance. The full badge on the tender detail page keeps its own copy with
// an icon — this one is tuned for tight grid cells.
export function DeadlineProximity({ deadline, className }: DeadlineProximityProps) {
  const msLeft = new Date(deadline).getTime() - Date.now()
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24))
  const tone = getTone(daysLeft)

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tabular-nums",
        TONE_STYLES[tone],
        className,
      )}
    >
      {getLabel(daysLeft)}
    </span>
  )
}
