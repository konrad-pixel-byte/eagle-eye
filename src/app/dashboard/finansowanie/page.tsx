import { createClient } from "@/lib/supabase/server"
import { FinansowanieClient } from "./finansowanie-client"

export default async function FinansowaniePage() {
  const supabase = await createClient()

  const { data: kfsNabory } = await supabase
    .from("kfs_nabory")
    .select("*")
    .order("application_start", { ascending: false })

  const { data: burNabory } = await supabase
    .from("bur_nabory")
    .select("*")
    .order("application_start", { ascending: false })

  return (
    <FinansowanieClient
      kfsNabory={kfsNabory ?? []}
      burNabory={burNabory ?? []}
    />
  )
}
