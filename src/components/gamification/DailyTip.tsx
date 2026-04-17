import { Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getDailyTip } from "@/lib/gamification"

export function DailyTip() {
  const tip = getDailyTip()

  return (
    <Card className="border-sky-900/40 bg-sky-950/20">
      <CardContent className="flex items-start gap-3 py-4">
        <div className="mt-0.5 shrink-0 rounded-md bg-sky-500/15 p-1.5">
          <Lightbulb className="size-4 text-sky-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-sky-400">Porada dnia</p>
          <p className="mt-0.5 text-sm text-zinc-300">{tip}</p>
        </div>
      </CardContent>
    </Card>
  )
}
