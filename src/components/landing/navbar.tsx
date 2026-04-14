"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Eye, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#funkcje", label: "Funkcje" },
  { href: "#cennik", label: "Cennik" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0EA5E9]">
            <Eye className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Eagle Eye
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth/login"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Zaloguj się
          </Link>
          <Link
            href="/auth/signup"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90"
            )}
          >
            Rozpocznij za darmo
          </Link>
        </div>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Menu nawigacyjne</SheetTitle>
            <nav className="flex flex-col gap-4 pt-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Zaloguj się
                </Link>
                <Link
                  href="/auth/signup"
                  className={cn(
                    buttonVariants(),
                    "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90"
                  )}
                >
                  Rozpocznij za darmo
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
