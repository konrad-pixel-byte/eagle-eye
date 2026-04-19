"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { CheckIcon, LinkIcon } from "lucide-react"

interface CopyLinkButtonProps {
  url?: string
  label?: string
}

export function CopyLinkButton({ url, label = "Kopiuj link" }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)
  const [, startTransition] = useTransition()

  function handleClick() {
    const target = url ?? (typeof window !== "undefined" ? window.location.href : "")
    if (!target) return

    startTransition(async () => {
      try {
        await navigator.clipboard.writeText(target)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // Fallback for non-secure contexts: open a prompt so user can copy manually
        if (typeof window !== "undefined") window.prompt("Skopiuj link", target)
      }
    })
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="w-full justify-start gap-2"
    >
      {copied ? (
        <>
          <CheckIcon className="size-4 text-emerald-400" />
          Skopiowano
        </>
      ) : (
        <>
          <LinkIcon className="size-4 text-muted-foreground" />
          {label}
        </>
      )}
    </Button>
  )
}
