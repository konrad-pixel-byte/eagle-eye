# Eagle Eye

Monitoring przetargów szkoleniowych dla firm szkoleniowych i konsultingowych.
Agreguje ogłoszenia z BZP, TED, BUR i KFS, punktuje je AI-owo i pomaga
przygotować konkurencyjną ofertę.

Produkcja: [eagle-eye.hatedapps.pl](https://eagle-eye.hatedapps.pl)

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19
- **TypeScript**
- **Supabase** — Postgres, Auth, Storage (self-hosted na Coolify VPS)
- **Tailwind CSS v4** + shadcn/ui v2 (`@base-ui/react`)
- **Resend** — wysyłka e-maili
- **Stripe** — subskrypcje
- **Anthropic Claude** — scoring, streszczenia, bid coach

## Rozwój lokalny

```bash
npm install
cp .env.example .env.local   # uzupełnij klucze
npm run dev
```

Dev server na [http://localhost:3000](http://localhost:3000).

## Skrypty

- `npm run dev` — tryb deweloperski
- `npm run build` — build produkcyjny
- `npm run start` — uruchomienie builda
- `npm run lint` — ESLint
- `npx tsc --noEmit` — sprawdzenie typów

## Struktura

```
src/
  app/
    (public)          page.tsx, polityka-prywatnosci, regulamin, status
    auth/             login, signup, forgot-password, callback
    dashboard/        przetargi, zapisane, powiadomienia, ustawienia, ...
    api/              health, scraper/{bzp,ted,all}, notifications, stripe, ai
  components/
    landing/          Navbar, Hero, Pricing, FAQ, Footer
    dashboard/        DashboardShell, BookmarkButton, AiUsageMini, ...
    ui/               shadcn/ui v2 primitives
  lib/
    actions/          Server actions (admin, alerts, bookmarks, ...)
    supabase/         SSR + client helpers
    types.ts          Współdzielone typy domenowe
```

## Cron i scrapery

Zadania w tle autoryzowane nagłówkiem `Authorization: Bearer $CRON_SECRET`:

- `POST /api/scraper/bzp`
- `POST /api/scraper/ted`
- `POST /api/scraper/all`
- `POST /api/notifications/send-daily`

Status systemu (publiczny health check): `/status`.

## Bezpieczeństwo

Zgłoszenia podatności: zobacz [SECURITY.md](./SECURITY.md).

## Licencja

Źródła prywatne. Wszelkie prawa zastrzeżone.
