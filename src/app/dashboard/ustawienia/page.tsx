"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { SaveIcon } from "lucide-react"

const VOIVODESHIPS = [
  "Dolnośląskie",
  "Kujawsko-Pomorskie",
  "Lubelskie",
  "Lubuskie",
  "Łódzkie",
  "Małopolskie",
  "Mazowieckie",
  "Opolskie",
  "Podkarpackie",
  "Podlaskie",
  "Pomorskie",
  "Śląskie",
  "Świętokrzyskie",
  "Warmińsko-Mazurskie",
  "Wielkopolskie",
  "Zachodniopomorskie",
]

const CPV_GROUPS = [
  "Szkolenia personelu",
  "Szkolenia zawodowe",
  "Szkolenia z zarządzania",
  "BHP",
  "Soft skills",
  "Pierwsza pomoc",
  "IT/e-learning",
  "Językowe",
  "Coaching/doradztwo",
]

const KFS_PRIORITIES = [
  "Priorytet 1 (45+)",
  "Priorytet 2 (kompetencje cyfrowe)",
  "Priorytet 3 (zielona transformacja)",
  "Priorytet 4 (branże strategiczne)",
]

type AlertFrequency = "1x" | "2x" | "realtime"

export default function UstawieniaPage() {
  // Profil state
  const [fullName, setFullName] = useState("Jan Kowalski")
  const [companyName, setCompanyName] = useState("Firma Szkoleniowa Sp. z o.o.")
  const [phone, setPhone] = useState("+48 500 123 456")

  // Powiadomienia state
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(false)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [alertFrequency, setAlertFrequency] = useState<AlertFrequency>("1x")
  const [notifTypes, setNotifTypes] = useState({
    newTenders: true,
    observedChanges: true,
    kfsRegional: false,
    burRegional: false,
    newsletter: false,
  })

  // Preferencje state
  const [regions, setRegions] = useState<Record<string, boolean>>(
    Object.fromEntries(VOIVODESHIPS.map((v) => [v, false]))
  )
  const [cpvGroups, setCpvGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(CPV_GROUPS.map((g) => [g, false]))
  )
  const [kfsPriorities, setKfsPriorities] = useState<Record<string, boolean>>(
    Object.fromEntries(KFS_PRIORITIES.map((p) => [p, false]))
  )
  const [budgetMin, setBudgetMin] = useState("")
  const [budgetMax, setBudgetMax] = useState("")

  const allRegionsChecked = VOIVODESHIPS.every((v) => regions[v])

  function toggleAllRegions() {
    const newValue = !allRegionsChecked
    setRegions(Object.fromEntries(VOIVODESHIPS.map((v) => [v, newValue])))
  }

  function toggleRegion(region: string) {
    setRegions((prev) => ({ ...prev, [region]: !prev[region] }))
  }

  function toggleCpv(group: string) {
    setCpvGroups((prev) => ({ ...prev, [group]: !prev[group] }))
  }

  function toggleKfs(priority: string) {
    setKfsPriorities((prev) => ({ ...prev, [priority]: !prev[priority] }))
  }

  function toggleNotifType(key: keyof typeof notifTypes) {
    setNotifTypes((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Ustawienia</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Zarządzaj swoim profilem i preferencjami
        </p>
      </div>

      <Tabs defaultValue="profil">
        <TabsList className="mb-6">
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="powiadomienia">Powiadomienia</TabsTrigger>
          <TabsTrigger value="preferencje">Preferencje wyszukiwania</TabsTrigger>
        </TabsList>

        {/* TAB 1 — Profil */}
        <TabsContent value="profil">
          <Card>
            <CardHeader>
              <CardTitle>Dane profilu</CardTitle>
              <CardDescription>
                Zaktualizuj swoje dane osobowe i firmowe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#0EA5E9]/20 text-lg font-semibold text-[#0EA5E9]">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    Zdjęcie avatara wkrótce dostępne
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="full-name">Imię i nazwisko</Label>
                  <Input
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jan Kowalski"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Adres e-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="jan.kowalski@firma.pl"
                    disabled
                    placeholder="jan.kowalski@firma.pl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="company">Nazwa firmy</Label>
                  <Input
                    id="company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Nazwa firmy"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Numer telefonu</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+48 500 000 000"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90">
                  <SaveIcon />
                  Zapisz zmiany
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2 — Powiadomienia */}
        <TabsContent value="powiadomienia">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Kanały powiadomień</CardTitle>
                <CardDescription>
                  Wybierz, w jaki sposób chcesz otrzymywać alerty
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-xs text-muted-foreground">
                      Powiadomienia na adres e-mail
                    </p>
                  </div>
                  <Switch
                    checked={emailEnabled}
                    onCheckedChange={setEmailEnabled}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Push</p>
                    <p className="text-xs text-muted-foreground">
                      Powiadomienia push w przeglądarce
                    </p>
                  </div>
                  <Switch
                    checked={pushEnabled}
                    onCheckedChange={setPushEnabled}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      SMS
                      <Badge variant="outline" className="ml-2 text-xs">
                        Dostępne w planie Pro+
                      </Badge>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Powiadomienia SMS na telefon
                    </p>
                  </div>
                  <Switch
                    checked={smsEnabled}
                    onCheckedChange={setSmsEnabled}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Częstotliwość alertów</CardTitle>
                <CardDescription>
                  Jak często chcesz otrzymywać zestawienia nowych przetargów
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(
                  [
                    { value: "1x" as const, label: "1x dziennie", badge: undefined, disabled: false },
                    { value: "2x" as const, label: "2x dziennie", badge: undefined, disabled: false },
                    {
                      value: "realtime" as const,
                      label: "Real-time",
                      badge: "Pro+" as const,
                      disabled: true,
                    },
                  ]
                ).map(({ value, label, badge, disabled }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => !disabled && setAlertFrequency(value)}
                    disabled={disabled}
                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm transition-colors ${
                      alertFrequency === value
                        ? "border-[#0EA5E9] bg-[#0EA5E9]/10 text-foreground"
                        : "border-border bg-transparent text-muted-foreground hover:border-border/80 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`size-4 rounded-full border-2 ${
                          alertFrequency === value
                            ? "border-[#0EA5E9] bg-[#0EA5E9]"
                            : "border-muted-foreground"
                        }`}
                      />
                      {label}
                    </span>
                    {badge && (
                      <Badge variant="outline" className="text-xs">
                        {badge}
                      </Badge>
                    )}
                  </button>
                ))}
                <p className="text-xs text-muted-foreground">
                  Real-time dostępne w planie Pro+
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typy powiadomień</CardTitle>
                <CardDescription>
                  Wybierz, o czym chcesz być informowany
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(
                  [
                    {
                      key: "newTenders" as const,
                      label: "Nowe przetargi dopasowane do profilu",
                    },
                    {
                      key: "observedChanges" as const,
                      label: "Zmiany w obserwowanych przetargach",
                    },
                    {
                      key: "kfsRegional" as const,
                      label: "Nabory KFS w moim regionie",
                    },
                    {
                      key: "burRegional" as const,
                      label: "Nabory BUR w moim regionie",
                    },
                    {
                      key: "newsletter" as const,
                      label: "Newsletter tygodniowy",
                    },
                  ] as const
                ).map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-3">
                    <Checkbox
                      id={`notif-${key}`}
                      checked={notifTypes[key]}
                      onCheckedChange={() => toggleNotifType(key)}
                    />
                    <label
                      htmlFor={`notif-${key}`}
                      className="cursor-pointer text-sm leading-none"
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90">
                <SaveIcon />
                Zapisz ustawienia
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3 — Preferencje wyszukiwania */}
        <TabsContent value="preferencje">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Regiony</CardTitle>
                <CardDescription>
                  Wybierz województwa, w których szukasz przetargów
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 pb-1">
                  <Checkbox
                    id="all-regions"
                    checked={allRegionsChecked}
                    onCheckedChange={toggleAllRegions}
                  />
                  <label
                    htmlFor="all-regions"
                    className="cursor-pointer text-sm font-medium leading-none"
                  >
                    Zaznacz wszystkie
                  </label>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {VOIVODESHIPS.map((region) => (
                    <div key={region} className="flex items-center gap-2">
                      <Checkbox
                        id={`region-${region}`}
                        checked={regions[region]}
                        onCheckedChange={() => toggleRegion(region)}
                      />
                      <label
                        htmlFor={`region-${region}`}
                        className="cursor-pointer text-xs leading-tight"
                      >
                        {region}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kody CPV</CardTitle>
                <CardDescription>
                  Wybierz główne grupy tematyczne zamówień
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {CPV_GROUPS.map((group) => (
                    <div key={group} className="flex items-center gap-2">
                      <Checkbox
                        id={`cpv-${group}`}
                        checked={cpvGroups[group]}
                        onCheckedChange={() => toggleCpv(group)}
                      />
                      <label
                        htmlFor={`cpv-${group}`}
                        className="cursor-pointer text-sm leading-none"
                      >
                        {group}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priorytety KFS</CardTitle>
                <CardDescription>
                  Filtruj nabory według priorytetów Krajowego Funduszu Szkoleniowego
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {KFS_PRIORITIES.map((priority) => (
                  <div key={priority} className="flex items-center gap-2">
                    <Checkbox
                      id={`kfs-${priority}`}
                      checked={kfsPriorities[priority]}
                      onCheckedChange={() => toggleKfs(priority)}
                    />
                    <label
                      htmlFor={`kfs-${priority}`}
                      className="cursor-pointer text-sm leading-none"
                    >
                      {priority}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zakres budżetu</CardTitle>
                <CardDescription>
                  Ogranicz wyniki do przetargów w wybranym przedziale wartości
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="budget-min">Minimalna wartość (PLN)</Label>
                    <Input
                      id="budget-min"
                      type="number"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                      placeholder="np. 10 000"
                      min={0}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="budget-max">Maksymalna wartość (PLN)</Label>
                    <Input
                      id="budget-max"
                      type="number"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      placeholder="np. 500 000"
                      min={0}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90">
                <SaveIcon />
                Zapisz preferencje
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
