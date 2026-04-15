import { createClient } from "@/lib/supabase/server"
import { getUserBookmarks } from "@/lib/actions/bookmarks"
import { TenderListClient } from "./tender-list-client"
import type { Tender } from "@/lib/types"

export default async function PrzetargiPage() {
  const supabase = await createClient()

  const [{ data: tenders, error }, bookmarkedIds] = await Promise.all([
    supabase
      .from("tenders")
      .select("*")
      .order("published_at", { ascending: false }),
    getUserBookmarks(),
  ])

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          Błąd podczas pobierania przetargów: {error.message}
        </div>
      </div>
    )
  }

  return (
    <TenderListClient
      tenders={(tenders ?? []) as Tender[]}
      bookmarkedIds={bookmarkedIds}
    />
  )
}
