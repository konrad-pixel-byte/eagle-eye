import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getAllAlerts } from "@/lib/actions/alerts"
import { AlertsClient } from "./alerts-client"

export default async function PowiadomieniaPage() {
  const alerts = await getAllAlerts()
  const unreadCount = alerts.filter((a) => !a.read).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Bell className="size-6 text-sky-500" />
        <h1 className="text-2xl font-semibold tracking-tight">Powiadomienia</h1>
        {unreadCount > 0 && (
          <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/20 text-sm px-2.5 h-6">
            {unreadCount} nowe
          </Badge>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Alerty o nowych przetargach pasujących do Twoich preferencji (CPV + region).
        Pokazujemy 100 najnowszych.
      </p>

      <AlertsClient alerts={alerts} />
    </div>
  )
}
