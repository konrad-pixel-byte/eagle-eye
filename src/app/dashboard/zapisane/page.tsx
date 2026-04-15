import { createClient } from "@/lib/supabase/server"
import { Bookmark } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SavedTendersClient, type SavedTenderRow } from "./saved-tenders-client"

export default async function ZapisanePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          Musisz być zalogowany, aby zobaczyć zapisane przetargi.
        </div>
      </div>
    )
  }

  const { data: savedTenders, error } = await supabase
    .from("saved_tenders")
    .select("*, tenders(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          Błąd podczas pobierania zapisanych przetargów: {error.message}
        </div>
      </div>
    )
  }

  const rows = (savedTenders ?? []).filter((row) => row.tenders !== null)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Zapisane przetargi</h1>
        <Badge className="bg-sky-500/15 text-sky-400 border border-sky-500/20 text-sm px-2.5 h-6">
          {rows.length}
        </Badge>
      </div>

      <SavedTendersClient savedTenders={rows as SavedTenderRow[]} />
    </div>
  )
}
