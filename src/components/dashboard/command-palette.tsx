"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  FileText,
  Landmark,
  GraduationCap,
  BarChart3,
  Settings,
  Search,
  Bell,
  Moon,
  Sun,
  LogOut,
  User,
  BookOpen,
  Calculator,
  MapPin,
} from "lucide-react";
import { useTheme } from "next-themes";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function runCommand(command: () => void) {
    setOpen(false);
    command();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-2xl">
        <DialogTitle className="sr-only">Szybka nawigacja</DialogTitle>
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
          <CommandInput placeholder="Szukaj przetargów, stron, akcji..." />
          <CommandList>
            <CommandEmpty>Brak wyników.</CommandEmpty>

            <CommandGroup heading="Nawigacja">
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/przetargi"))
                }
              >
                <FileText className="mr-2 h-4 w-4" />
                Przetargi szkoleniowe
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/finansowanie"))
                }
              >
                <Landmark className="mr-2 h-4 w-4" />
                Finansowanie BUR/KFS
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/akademia"))
                }
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Akademia ZP
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/statystyki"))
                }
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Statystyki
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/ustawienia"))
                }
              >
                <Settings className="mr-2 h-4 w-4" />
                Ustawienia
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Szybkie akcje">
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/przetargi"))
                }
              >
                <Search className="mr-2 h-4 w-4" />
                Szukaj przetargów...
              </CommandItem>
              <CommandItem>
                <Calculator className="mr-2 h-4 w-4" />
                Kalkulator ofert
              </CommandItem>
              <CommandItem>
                <Bell className="mr-2 h-4 w-4" />
                Powiadomienia
              </CommandItem>
              <CommandItem>
                <MapPin className="mr-2 h-4 w-4" />
                Mapa KFS naborów
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Preferencje">
              <CommandItem
                onSelect={() =>
                  runCommand(() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                  )
                }
              >
                {theme === "dark" ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                {theme === "dark"
                  ? "Przełącz na jasny motyw"
                  : "Przełącz na ciemny motyw"}
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/ustawienia"))
                }
              >
                <User className="mr-2 h-4 w-4" />
                Mój profil
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
