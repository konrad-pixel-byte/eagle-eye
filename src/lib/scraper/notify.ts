// Notify users when new tenders match their preferences.
// Called by scraper routes after successful DB insert.

import { createAdminClient } from "@/lib/supabase/admin"

interface NewTender {
  id: string
  title: string
  cpv_codes: string[]
  voivodeship: string | null
  source: string
}

interface Profile {
  id: string
  preferred_regions: string[] | null
  preferred_cpv_codes: string[] | null
  notification_email: boolean
}

function tenderMatchesProfile(tender: NewTender, profile: Profile): boolean {
  const hasRegionPref = profile.preferred_regions && profile.preferred_regions.length > 0
  const hasCpvPref = profile.preferred_cpv_codes && profile.preferred_cpv_codes.length > 0

  // If user has no preferences set, they get all alerts
  if (!hasRegionPref && !hasCpvPref) return true

  const regionMatch =
    !hasRegionPref ||
    !tender.voivodeship ||
    profile.preferred_regions!.includes(tender.voivodeship)

  const cpvMatch =
    !hasCpvPref ||
    tender.cpv_codes.some((code) =>
      profile.preferred_cpv_codes!.some(
        (pref) => code === pref || code.startsWith(pref.slice(0, 5))
      )
    )

  return regionMatch && cpvMatch
}

export async function notifyMatchingUsers(
  tenders: NewTender[]
): Promise<{ alertsCreated: number }> {
  if (tenders.length === 0) return { alertsCreated: 0 }

  try {
    const admin = createAdminClient()

    // Fetch all users with email notifications enabled
    const { data: profiles, error } = await admin
      .from("profiles")
      .select("id, preferred_regions, preferred_cpv_codes, notification_email")
      .eq("notification_email", true)

    if (error || !profiles?.length) return { alertsCreated: 0 }

    const alertRows: {
      user_id: string
      tender_id: string
      channel: "email"
      title: string
      body: string
    }[] = []

    for (const tender of tenders) {
      for (const profile of profiles as Profile[]) {
        if (tenderMatchesProfile(tender, profile)) {
          alertRows.push({
            user_id: profile.id,
            tender_id: tender.id,
            channel: "email",
            title: `Nowy przetarg: ${tender.title.slice(0, 120)}`,
            body: `Źródło: ${tender.source}${tender.voivodeship ? ` · ${tender.voivodeship}` : ""}`,
          })
        }
      }
    }

    if (alertRows.length === 0) return { alertsCreated: 0 }

    // Insert in batches of 100 to avoid payload limits
    let created = 0
    const batchSize = 100
    for (let i = 0; i < alertRows.length; i += batchSize) {
      const batch = alertRows.slice(i, i + batchSize)
      const { error: insertError } = await admin.from("alerts").insert(batch)
      if (!insertError) created += batch.length
    }

    return { alertsCreated: created }
  } catch {
    return { alertsCreated: 0 }
  }
}
