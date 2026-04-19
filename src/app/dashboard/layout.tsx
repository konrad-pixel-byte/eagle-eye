import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// Dashboard routes are authenticated private views. robots.txt already
// blocks crawlers but a route-level noindex is belt-and-braces in case a
// dashboard URL ends up in a backlink or sitemap pull.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
}
import { getUnreadAlertCount } from "@/lib/actions/alerts"
import { getBookmarkCount } from "@/lib/actions/bookmarks"
import { getGamificationState, updateLoginStreak } from "@/lib/actions/gamification"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { EmailVerificationBanner } from "@/components/dashboard/email-verification-banner"
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

  void updateLoginStreak()

  const [unreadCount, bookmarkCount, profileResult, gamificationState] = await Promise.all([
    getUnreadAlertCount(),
    getBookmarkCount(),
    supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single(),
    getGamificationState(),
  ])

  const userTier =
    ((profileResult.data?.subscription_tier as SubscriptionTier | undefined) ??
      "free") as SubscriptionTier

  const displayUser = {
    email: user.email ?? "",
    full_name:
      (user.user_metadata?.full_name as string | undefined) ?? undefined,
  }

  const emailUnverified = !user.email_confirmed_at && Boolean(user.email)

  return (
    <DashboardShell
      user={displayUser}
      unreadAlertCount={unreadCount}
      bookmarkCount={bookmarkCount}
      userTier={userTier}
      gamificationState={gamificationState}
    >
      {emailUnverified && user.email && (
        <div className="mb-4">
          <EmailVerificationBanner email={user.email} />
        </div>
      )}
      {children}
    </DashboardShell>
  )
}
