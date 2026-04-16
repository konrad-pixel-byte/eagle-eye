import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUnreadAlertCount } from "@/lib/actions/alerts"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import type { SubscriptionTier } from "@/lib/subscription"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const [unreadCount, profileResult] = await Promise.all([
    getUnreadAlertCount(),
    supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single(),
  ])

  const userTier =
    ((profileResult.data?.subscription_tier as SubscriptionTier | undefined) ??
      "free") as SubscriptionTier

  const displayUser = {
    email: user.email ?? "",
    full_name:
      (user.user_metadata?.full_name as string | undefined) ?? undefined,
  }

  return (
    <DashboardShell
      user={displayUser}
      unreadAlertCount={unreadCount}
      userTier={userTier}
    >
      {children}
    </DashboardShell>
  )
}
