// ─── Gamification config: XP, levels, badges ─────────────────────────────────

export const XP_REWARDS = {
  tender_view: 5,
  daily_login: 10,
  streak_bonus: 5,       // per consecutive day above 1
  save_tender: 15,
  complete_onboarding: 50,
} as const

export type XpEventType = keyof typeof XP_REWARDS

// 10 levels with XP thresholds and rank titles from spec
export const LEVELS = [
  { level: 1, xpRequired: 0,     title: "Nowicjusz Przetargowy",  icon: "🌱" },
  { level: 2, xpRequired: 100,   title: "Asystent Analizy",       icon: "📋" },
  { level: 3, xpRequired: 250,   title: "Śledczy Zamówień",       icon: "🔍" },
  { level: 4, xpRequired: 450,   title: "Manager Biznesu",        icon: "💼" },
  { level: 5, xpRequired: 700,   title: "Senior Strategista",     icon: "👔" },
  { level: 6, xpRequired: 1000,  title: "Specjalista Zamówień",   icon: "🎯" },
  { level: 7, xpRequired: 1400,  title: "Mistrz Eagle Eye",       icon: "🦅" },
  { level: 8, xpRequired: 1900,  title: "Władca Rynku",           icon: "👑" },
  { level: 9, xpRequired: 2300,  title: "Sage Przetargowy",       icon: "🌟" },
  { level: 10, xpRequired: 2700, title: "Legenda Zamówień",       icon: "🐲" },
] as const

export type LevelConfig = (typeof LEVELS)[number]

export function getLevelForXp(xp: number): LevelConfig {
  let current: LevelConfig = LEVELS[0]
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl
    else break
  }
  return current
}

export function getNextLevel(currentLevel: number): LevelConfig | null {
  return LEVELS.find((l) => l.level === currentLevel + 1) ?? null
}

export function xpToNextLevel(xp: number): { current: LevelConfig; next: LevelConfig | null; progress: number } {
  const current = getLevelForXp(xp)
  const next = getNextLevel(current.level)
  if (!next) return { current, next: null, progress: 100 }
  const range = next.xpRequired - current.xpRequired
  const earned = xp - current.xpRequired
  const progress = Math.min(100, Math.round((earned / range) * 100))
  return { current, next, progress }
}

// ─── Badge definitions ────────────────────────────────────────────────────────

export interface BadgeDefinition {
  id: string
  emoji: string
  name: string
  description: string
  category: "activity" | "saving" | "level" | "streak" | "onboarding"
}

export const BADGES: BadgeDefinition[] = [
  // Onboarding
  {
    id: "welcome",
    emoji: "🦅",
    name: "Orzeł Przylądował",
    description: "Zakończyłeś onboarding — witamy w ekipie!",
    category: "onboarding",
  },
  // Activity — views
  {
    id: "spy_10",
    emoji: "🔍",
    name: "Szpieg Mahoniu",
    description: "Przejrzałeś 10 przetargów.",
    category: "activity",
  },
  {
    id: "spy_50",
    emoji: "🕵️",
    name: "Detektyw Przetargowy",
    description: "Przejrzałeś 50 przetargów.",
    category: "activity",
  },
  {
    id: "spy_100",
    emoji: "🔎",
    name: "Obsesjonat Analizy",
    description: "Przejrzałeś 100 przetargów.",
    category: "activity",
  },
  // Saving tenders
  {
    id: "first_save",
    emoji: "💾",
    name: "Pierwszy Bookmark",
    description: "Zapisałeś swój pierwszy przetarg.",
    category: "saving",
  },
  {
    id: "save_10",
    emoji: "📂",
    name: "Kolekcjoner",
    description: "Zapisałeś 10 przetargów.",
    category: "saving",
  },
  // Streaks
  {
    id: "streak_7",
    emoji: "📅",
    name: "Regularny Ping",
    description: "7 logowań z rzędu — nawet w niedzielę!",
    category: "streak",
  },
  {
    id: "streak_30",
    emoji: "🔥",
    name: "Święty Ogień",
    description: "30 logowań z rzędu. Nawet święta Cię nie powstrzymały!",
    category: "streak",
  },
  // Level milestones
  {
    id: "level_5",
    emoji: "👔",
    name: "Senior Strategista",
    description: "Osiągnąłeś poziom 5 — Senior Strategista.",
    category: "level",
  },
  {
    id: "level_10",
    emoji: "🐲",
    name: "Legenda Zamówień",
    description: "Poziom 10 — Legenda Zamówień Publicznych!",
    category: "level",
  },
]

export function getBadge(id: string): BadgeDefinition | undefined {
  return BADGES.find((b) => b.id === id)
}

// ─── Daily tips ───────────────────────────────────────────────────────────────

export const DAILY_TIPS = [
  "Przetargi otwierane w piątki o 14:00 mają mniejszą konkurencję.",
  "Oferta w +/- 5% budżetu zamawiającego = złoto.",
  "Zmień słowa kluczowe co 2 miesiące.",
  "Wygrana? Celebruj 5 minut, potem analizuj przegrane.",
  "Składaj oferty 9–12, nie o 22:00 — zmęczenie = błędy.",
  "Każdy piąty przetarg ma usterkę w specyfikacji — bądź tym, co ją znajdzie!",
  "Zamiast 'doświadczeni' napisz: '427 projektów, 98% zadowolenia'.",
  "Spóźniona o 2 sekundy = przepadła. Upload 10 min przed deadline!",
  "Obserwuj konkurentów w innym regionie — jutro mogą być w Twoim.",
  "Referensprojekty sprzed 2 lat? Odśwież portfolio co 3 miesiące.",
  "Duży przetarg w Warszawie? 200 firm. Szukaj mniejszych miast.",
  "Zamawiający z ostatniego przetargu ma nowy tender — sprawdź historię!",
  "Napisz ofertę jakby komisja była Twoją babcią — proste, jasne, bez żargonu.",
  "Koniec miesiąca = rajd. Przeanalizuj, zaplanuj nowy miesiąc.",
  "Wygrana nie jest losowa. Jest powtarzalna. Buduj system.",
  "Nie bój się pytać zamawiającego — pytania o SWZ to Twoje prawo.",
  "Konsorcjum z inną firmą = większe szanse. Nie walcz sam.",
  "Dashboard Eagle Eye rano + kawa = idealne combo na dzień.",
  "Każda przegrana oferta to materiał do wygranej następnej.",
  "Wygrana > 100K PLN? Dokumentuj. To Twój nowy referencsprojekt.",
]

export function getDailyTip(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  return DAILY_TIPS[dayOfYear % DAILY_TIPS.length]
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserGamificationState {
  totalXp: number
  level: number
  levelConfig: LevelConfig
  nextLevel: LevelConfig | null
  xpProgress: number        // 0-100
  currentStreak: number
  longestStreak: number
  badges: string[]          // badge IDs
  tenderViews: number
}
