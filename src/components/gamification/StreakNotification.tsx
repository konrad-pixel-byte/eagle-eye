"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { getBadge } from "@/lib/gamification"

interface StreakNotificationProps {
  streak: number
  newBadges: string[]
}

// Milestone streaks that deserve a separate congratulatory toast
const STREAK_MILESTONES = new Set([3, 7, 14, 30, 60, 100])

export function StreakNotification({ streak, newBadges }: StreakNotificationProps) {
  // useRef prevents double-firing in React StrictMode
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    // Show badge toasts first (each badge gets its own toast)
    for (const badgeId of newBadges) {
      const badge = getBadge(badgeId)
      if (!badge) continue
      // Delay slightly so toasts stack nicely rather than all appearing at once
      const delay = newBadges.indexOf(badgeId) * 600
      setTimeout(() => {
        toast.success(`Nowe odznaczenie: ${badge.emoji} ${badge.name}`, {
          description: badge.description,
          duration: 6000,
        })
      }, delay)
    }

    // Show streak milestone toast only if no badge toasts already cover it
    const hasBadgeForStreak = newBadges.some((id) => id.startsWith("streak_"))
    if (!hasBadgeForStreak && streak > 1 && STREAK_MILESTONES.has(streak)) {
      const delay = newBadges.length * 600
      setTimeout(() => {
        toast(`🔥 ${streak}-dniowy streak!`, {
          description: "Świetna robota — kolejny dzień z rzędu!",
          duration: 4000,
        })
      }, delay)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
