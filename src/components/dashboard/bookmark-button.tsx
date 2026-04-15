"use client"

import { useState } from "react"
import { Bookmark } from "lucide-react"
import { toggleBookmark } from "@/lib/actions/bookmarks"

interface BookmarkButtonProps {
  tenderId: string
  isBookmarked: boolean
}

export function BookmarkButton({ tenderId, isBookmarked }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (loading) return
    setLoading(true)
    const prev = bookmarked
    setBookmarked(!prev)
    try {
      await toggleBookmark(tenderId)
    } catch {
      setBookmarked(prev)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-start gap-2 px-4 py-2 rounded-md border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.95] disabled:pointer-events-none disabled:opacity-50"
      aria-label={bookmarked ? "Usuń z zapisanych" : "Zapisz przetarg"}
    >
      {loading ? (
        <span className="size-4 rounded-full border-2 border-zinc-500 border-t-transparent animate-spin shrink-0" />
      ) : (
        <Bookmark
          className="size-4 shrink-0"
          style={{ color: bookmarked ? "#F59E0B" : undefined }}
          fill={bookmarked ? "#F59E0B" : "none"}
        />
      )}
      <span className={bookmarked ? "text-[#F59E0B]" : "text-zinc-500"}>
        {bookmarked ? "Zapisano" : "Zapisz przetarg"}
      </span>
    </button>
  )
}
