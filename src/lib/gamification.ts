// ─── Gamification config: XP, levels, badges, monthly challenges ──────────────

export const XP_REWARDS = {
  tender_view:          5,
  daily_login:          10,
  streak_bonus:         5,       // per consecutive day above 1
  save_tender:          15,
  complete_onboarding:  50,
  complete_module:      75,
  complete_lesson:      25,
  ai_analysis:          20,
  // Monthly challenge rewards
  monthly_reader:       100,
  monthly_saver:        75,
  monthly_ai:           150,
  monthly_learner:      50,
} as const

export type XpEventType = keyof typeof XP_REWARDS

// 10 levels with XP thresholds and rank titles from spec
export const LEVELS = [
  { level: 1,  xpRequired: 0,    title: "Nowicjusz Przetargowy",  icon: "🌱" },
  { level: 2,  xpRequired: 100,  title: "Asystent Analizy",       icon: "📋" },
  { level: 3,  xpRequired: 250,  title: "Śledczy Zamówień",       icon: "🔍" },
  { level: 4,  xpRequired: 450,  title: "Manager Biznesu",        icon: "💼" },
  { level: 5,  xpRequired: 700,  title: "Senior Strategista",     icon: "👔" },
  { level: 6,  xpRequired: 1000, title: "Specjalista Zamówień",   icon: "🎯" },
  { level: 7,  xpRequired: 1400, title: "Mistrz Eagle Eye",       icon: "🦅" },
  { level: 8,  xpRequired: 1900, title: "Władca Rynku",           icon: "👑" },
  { level: 9,  xpRequired: 2300, title: "Sage Przetargowy",       icon: "🌟" },
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
  category: "activity" | "saving" | "level" | "streak" | "onboarding" | "ai" | "learning"
}

export const BADGES: BadgeDefinition[] = [
  // ── Onboarding ──────────────────────────────────────────────────────────────
  {
    id: "welcome",
    emoji: "🦅",
    name: "Orzeł Przylądował",
    description: "Zakończyłeś onboarding — witamy w ekipie!",
    category: "onboarding",
  },

  // ── Activity: tender views ───────────────────────────────────────────────────
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
  {
    id: "spy_250",
    emoji: "🧐",
    name: "Analityk Rynku",
    description: "Przejrzałeś 250 przetargów. Rynek nie ma przed Tobą tajemnic.",
    category: "activity",
  },
  {
    id: "spy_500",
    emoji: "🦉",
    name: "Weteran Przetargów",
    description: "Przejrzałeś 500 przetargów. Prawdziwa legenda.",
    category: "activity",
  },

  // ── Saving tenders ───────────────────────────────────────────────────────────
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
  {
    id: "save_25",
    emoji: "📁",
    name: "Kolekcjoner Pro",
    description: "Zapisałeś 25 przetargów. Porządna baza!",
    category: "saving",
  },
  {
    id: "save_50",
    emoji: "🗄️",
    name: "Archiwista",
    description: "Zapisałeś 50 przetargów. Twoje archiwum rośnie!",
    category: "saving",
  },

  // ── Streaks ──────────────────────────────────────────────────────────────────
  {
    id: "streak_3",
    emoji: "⚡",
    name: "Pierwsze Kroki",
    description: "3 logowania z rzędu — nawyk się buduje!",
    category: "streak",
  },
  {
    id: "streak_7",
    emoji: "📅",
    name: "Regularny Ping",
    description: "7 logowań z rzędu — nawet w niedzielę!",
    category: "streak",
  },
  {
    id: "streak_14",
    emoji: "🔥",
    name: "Dwa Tygodnie",
    description: "14 logowań z rzędu. Naprawdę traktujesz to serio.",
    category: "streak",
  },
  {
    id: "streak_30",
    emoji: "🌋",
    name: "Święty Ogień",
    description: "30 logowań z rzędu. Nawet święta Cię nie powstrzymały!",
    category: "streak",
  },
  {
    id: "streak_60",
    emoji: "💪",
    name: "Żelazna Dyscyplina",
    description: "60 logowań z rzędu. Dwa miesiące bez przerwy!",
    category: "streak",
  },
  {
    id: "streak_100",
    emoji: "⚔️",
    name: "Niezniszczalny",
    description: "100 logowań z rzędu. Absolutna legenda streaka.",
    category: "streak",
  },

  // ── Level milestones ──────────────────────────────────────────────────────────
  {
    id: "level_3",
    emoji: "🔍",
    name: "Śledczy Zamówień",
    description: "Osiągnąłeś poziom 3 — Śledczy Zamówień.",
    category: "level",
  },
  {
    id: "level_5",
    emoji: "👔",
    name: "Senior Strategista",
    description: "Osiągnąłeś poziom 5 — Senior Strategista.",
    category: "level",
  },
  {
    id: "level_7",
    emoji: "🦅",
    name: "Mistrz Eagle Eye",
    description: "Osiągnąłeś poziom 7 — Mistrz Eagle Eye.",
    category: "level",
  },
  {
    id: "level_10",
    emoji: "🐲",
    name: "Legenda Zamówień",
    description: "Poziom 10 — Legenda Zamówień Publicznych!",
    category: "level",
  },

  // ── AI ────────────────────────────────────────────────────────────────────────
  {
    id: "first_ai",
    emoji: "🤖",
    name: "AI Explorer",
    description: "Uruchomiłeś pierwszą analizę AI. Witaj w przyszłości!",
    category: "ai",
  },
  {
    id: "ai_power",
    emoji: "🧠",
    name: "Prompt Inżynier",
    description: "10 analiz AI — czujesz klimat tych danych.",
    category: "ai",
  },

  // ── Learning (Akademia ZP) ────────────────────────────────────────────────────
  {
    id: "first_lesson",
    emoji: "📖",
    name: "Uczeń Eagle Eye",
    description: "Ukończyłeś pierwszą lekcję w Akademii ZP.",
    category: "learning",
  },
  {
    id: "first_module",
    emoji: "🎓",
    name: "Absolwent Modułu",
    description: "Ukończyłeś wszystkie lekcje w jednym module Akademii.",
    category: "learning",
  },
  {
    id: "all_modules",
    emoji: "🏆",
    name: "Mistrz Akademii",
    description: "Ukończyłeś wszystkie 4 moduły Akademii ZP. Brawo!",
    category: "learning",
  },
]

export function getBadge(id: string): BadgeDefinition | undefined {
  return BADGES.find((b) => b.id === id)
}

// ─── Monthly challenges ───────────────────────────────────────────────────────

export interface MonthlyChallenge {
  id: string
  title: string
  description: string
  emoji: string
  xpReward: XpEventType
  target: number
  /** Which xp_events.event_type to count for progress */
  trackedEvent: string
}

export const MONTHLY_CHALLENGES: MonthlyChallenge[] = [
  {
    id: "monthly_reader",
    title: "Aktywny Czytelnik",
    description: "Przeglądnij 30 przetargów w tym miesiącu",
    emoji: "📰",
    xpReward: "monthly_reader",
    target: 30,
    trackedEvent: "tender_view",
  },
  {
    id: "monthly_saver",
    title: "Kolekcjoner Miesiąca",
    description: "Zapisz 5 przetargów w tym miesiącu",
    emoji: "📌",
    xpReward: "monthly_saver",
    target: 5,
    trackedEvent: "save_tender",
  },
  {
    id: "monthly_ai",
    title: "Analityk AI",
    description: "Uruchom 3 analizy AI w tym miesiącu",
    emoji: "🤖",
    xpReward: "monthly_ai",
    target: 3,
    trackedEvent: "ai_analysis",
  },
  {
    id: "monthly_learner",
    title: "Uczeń Miesiąca",
    description: "Ukończ 1 lekcję w Akademii ZP",
    emoji: "📚",
    xpReward: "monthly_learner",
    target: 1,
    trackedEvent: "complete_lesson",
  },
]

export function getCurrentMonthKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
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

export interface MonthlyChallengeProgress {
  challenge: MonthlyChallenge
  progress: number          // count of events this month
  claimed: boolean
  completed: boolean        // progress >= target
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  displayName: string
  totalXp: number
  level: number
  levelTitle: string
  levelIcon: string
  currentStreak: number
  badgeCount: number
  tenderViews: number
  isCurrentUser: boolean
}
