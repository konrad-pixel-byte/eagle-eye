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
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-[#0EA5E9]" strokeWidth={1.5} />
          <span className="text-sm font-semibold tracking-tight text-zinc-200">
            Eagle Eye
          </span>
        </Link>

        {/* Desktop nav — minimal */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/auth/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-zinc-500 hover:text-zinc-200"
            )}
          >
            Zaloguj się
          </Link>
          <Link
            href="/auth/signup"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-zinc-100 text-zinc-950 hover:bg-white active:scale-[0.98] transition-all"
            )}
          >
            Rozpocznij
          </Link>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden text-zinc-400" />
            }
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-zinc-950 border-zinc-800">
            <SheetTitle className="sr-only">Menu nawigacyjne</SheetTitle>
            <nav className="flex flex-col gap-4 pt-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-200"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-zinc-800 text-zinc-400"
                  )}
                >
                  Zaloguj się
                </Link>
                <Link
                  href="/auth/signup"
                  className={cn(
                    buttonVariants(),
                    "bg-zinc-100 text-zinc-950 hover:bg-white"
                  )}
                >
                  Rozpocznij
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
