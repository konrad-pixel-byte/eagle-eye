import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUnreadAlertCount } from "@/lib/actions/alerts"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

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

  const [unreadCount] = await Promise.all([getUnreadAlertCount()])

  const displayUser = {
    email: user.email ?? "",
    full_name:
      (user.user_metadata?.full_name as string | undefined) ?? undefined,
  }

  return (
    <DashboardShell user={displayUser} unreadAlertCount={unreadCount}>
      {children}
    </DashboardShell>
  )
}
