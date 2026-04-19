"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Eye,
  FileText,
  Landmark,
  GraduationCap,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  ChevronDown,
  Bookmark,
  Calculator,
  Trophy,
  Star,
  Sparkles,
  CreditCard,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { logoutAction } from "@/lib/supabase/actions"
import type { SubscriptionTier } from "@/lib/subscription"
import { CommandPalette } from "@/components/dashboard/command-palette"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { GamificationWidget } from "@/components/gamification/GamificationWidget"
import type { UserGamificationState } from "@/lib/gamification"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badgeKey?: "bookmarks"
}

const NAV_ITEMS: NavItem[] = [
  { label: "Przetargi", href: "/dashboard/przetargi", icon: FileText },
  { label: "Zapisane", href: "/dashboard/zapisane", icon: Bookmark, badgeKey: "bookmarks" },
  { label: "Kalkulator", href: "/dashboard/kalkulator", icon: Calculator },
  { label: "Finansowanie BUR/KFS", href: "/dashboard/finansowanie", icon: Landmark },
  { label: "Akademia", href: "/dashboard/akademia", icon: GraduationCap },
  { label: "Statystyki", href: "/dashboard/statystyki", icon: BarChart3 },
  { label: "Osiągnięcia", href: "/dashboard/osiagniecia", icon: Trophy },
  { label: "Hall of Fame", href: "/dashboard/hall-of-fame", icon: Star },
  { label: "Użycie AI", href: "/dashboard/uzycie", icon: Sparkles },
  { label: "Rozliczenia", href: "/dashboard/rozliczenia", icon: CreditCard },
  { label: "Ustawienia", href: "/dashboard/ustawienia", icon: Settings },
]

interface DashboardShellProps {
  children: React.ReactNode
  user: {
    email: string
    full_name?: string
  }
  gamificationState?: UserGamificationState | null
  unreadAlertCount?: number
  bookmarkCount?: number
  userTier?: SubscriptionTier
}

function getInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(" ")
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  if (email) {
    return email.slice(0, 2).toUpperCase()
  }
  return "UZ"
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0EA5E9]">
        <Eye className="size-4.5 text-white" strokeWidth={2} />
      </div>
      <span className="text-base font-semibold tracking-tight text-foreground">
        Eagle Eye
      </span>
    </div>
  )
}

interface NavLinkProps {
  item: NavItem
  pathname: string
  onClick?: () => void
  badgeCount?: number
}

function NavLink({ item, pathname, onClick, badgeCount }: NavLinkProps) {
  const isActive = pathname.startsWith(item.href)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:transition-all",
        isActive
          ? "bg-[#0EA5E9]/10 text-[#0EA5E9] before:bg-[#0EA5E9]"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground before:bg-transparent"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="flex-1">{item.label}</span>
      {badgeCount !== undefined && badgeCount > 0 && (
        <span
          className={cn(
            "ml-auto inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
            isActive
              ? "bg-[#0EA5E9]/20 text-[#0EA5E9]"
              : "bg-muted text-muted-foreground"
          )}
        >
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
    </Link>
  )
}

interface SidebarContentProps {
  user: DashboardShellProps["user"]
  pathname: string
  onNavClick?: () => void
  gamificationState?: UserGamificationState | null
  bookmarkCount?: number
}

function SidebarContent({ user, pathname, onNavClick, gamificationState, bookmarkCount }: SidebarContentProps) {
  const router = useRouter()
  const initials = getInitials(user.full_name, user.email)
  const displayName = user.full_name ?? user.email

  function handleLogout() {
    logoutAction()
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center border-b border-border/50 px-4">
        <Logo />
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-3">
        <nav className="flex flex-col gap-0.5 px-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              onClick={onNavClick}
              badgeCount={item.badgeKey === "bookmarks" ? bookmarkCount : undefined}
            />
          ))}
        </nav>
      </ScrollArea>

      {/* Gamification mini-widget */}
      {gamificationState && (
        <div className="shrink-0 px-3 pb-2">
          <GamificationWidget state={gamificationState} />
        </div>
      )}

      {/* User area */}
      <div className="shrink-0 border-t border-border/50 p-3">
        <div className="flex items-center gap-2.5">
          <Avatar size="sm">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">
              {displayName}
            </p>
            {user.full_name && (
              <p className="truncate text-[11px] text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleLogout}
            aria-label="Wyloguj się"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DashboardShell({ children, user, unreadAlertCount = 0, bookmarkCount = 0, userTier = "free", gamificationState }: DashboardShellProps) {
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const initials = getInitials(user.full_name, user.email)
  const displayName = user.full_name ?? user.email
  const router = useRouter()

  function handleLogout() {
    logoutAction()
  }

  return (
    <div className="flex min-h-[100dvh] overflow-hidden bg-background">
      <CommandPalette />
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/50 bg-background/80 backdrop-blur-sm md:flex">
        <SidebarContent user={user} pathname={pathname} gamificationState={gamificationState} bookmarkCount={bookmarkCount} />
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/50 bg-background/80 px-4 backdrop-blur-sm">
          {/* Mobile hamburger */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Otwórz menu"
                  className="md:hidden"
                />
              }
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Nawigacja</SheetTitle>
              </SheetHeader>
              <SidebarContent
                user={user}
                pathname={pathname}
                onNavClick={() => setSheetOpen(false)}
                gamificationState={gamificationState}
                bookmarkCount={bookmarkCount}
              />
            </SheetContent>
          </Sheet>

          {/* Search — triggers Command Palette */}
          <button
            type="button"
            onClick={() => {
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true })
              )
            }}
            aria-label="Otwórz wyszukiwarkę (Cmd+K)"
            className="relative hidden h-8 max-w-xs flex-1 items-center gap-2 rounded-lg border border-input bg-transparent px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/50 sm:flex"
          >
            <Search className="size-3.5" />
            <span>Szukaj przetargów...</span>
            <kbd className="ml-auto pointer-events-none hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-block">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            {/* Theme toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Powiadomienia (${unreadAlertCount})`}
                render={<Link href="/dashboard/powiadomienia" />}
              >
                <Bell className="size-4" />
              </Button>
              {unreadAlertCount > 0 && (
                <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#0EA5E9] text-[10px] font-semibold text-white">
                  {unreadAlertCount}
                </span>
              )}
            </div>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 px-2"
                    aria-label="Menu użytkownika"
                  />
                }
              >
                <Avatar size="sm">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[120px] truncate text-sm font-medium sm:block">
                  {displayName}
                </span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{displayName}</span>
                    {user.full_name && (
                      <span className="text-xs font-normal text-muted-foreground">
                        {user.email}
                      </span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 size-4" />
                  Mój profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  Ustawienia
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 size-4" />
                  Wyloguj się
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <ScrollArea className="flex-1">
          <main className="min-h-full p-6">
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  )
}
