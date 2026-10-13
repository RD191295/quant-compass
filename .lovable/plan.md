# Quant Compass — Full-Stack Upgrade Plan

## What exists today
- App is branded "Quant Intelligence"; every page (/, /screener, /stocks, /rankings, /lab, /watchlists, /copilot, /reports, /settings) renders inside the research shell, which wraps all routes from the root.
- All data comes from a labelled mock provider. No backend, no accounts. Watchlist stars are in-memory only.
- Fonts IBM Plex Sans/Mono and dark OKLCH tokens are already in place and will be reused.

## Key changes visible to you
1. **Rename** to Quant Compass everywhere (titles, sidebar, footer, metadata).
2. **New public homepage at /** with the requested headline, CTAs, capability sections, illustrative chart preview (labelled), methodology, data-integrity and risk disclosure, final CTA and footer. No invented stats or testimonials.
3. **Research workspace moves under /app** (e.g. /app, /app/screener, /app/stocks …) and requires sign-in. Existing pages are reused as-is.
4. **New pages:** Options Intelligence (mock, labelled), Saved Research, Methodology, Privacy, Terms, Risk Disclosure, Contact.
5. **Real accounts** via Lovable Cloud: sign up (name, email, password, confirm, terms), sign in with show/hide password and return-to-page, forgot/reset password, logout, profile settings. Google sign-in included (managed, no keys needed).
6. **Persistent data:** watchlists with items, saved research, profile, and preferences stored per user and isolated from other users.

## Phases
1. Enable Lovable Cloud; database migration for profiles, user_preferences, watchlists, watchlist_items, saved_research with RLS, indexes, cascades and a signup trigger that creates profile + preferences.
2. Layout split: root renders a bare Outlet; marketing layout for public pages; auth layout for /login, /signup, /forgot-password, /reset-password; protected `_authenticated` layout wraps the ResearchShell for /app/*.
3. Homepage and marketing components (reuse Recharts and existing tokens; teal accent tuned within existing palette).
4. Auth forms with Zod schemas, neutral error messages (no account enumeration), session listener in root.
5. Watchlists / saved research / profile wired through server functions with auth middleware and React Query; shell avatar menu shows real user and sign-out.
6. Tests: signup/login schema validation, recovery state handling, protected redirect, watchlist data helpers; update existing routing test for new paths. Head metadata per route.

## Technical details
- Routes: `src/routes/_authenticated/route.tsx` (managed gate) + `src/routes/_authenticated/app.*.tsx`; marketing/auth as top-level routes with their own layout components (not pathless duplicates of /).
- Data layer: `src/lib/account/*.functions.ts` using `requireSupabaseAuth`; JSONB `configuration` constrained with a CHECK on `jsonb_typeof = 'object'` and validated with Zod.
- Research mock provider and ResearchProvider interface unchanged.
- Old URLs (/screener etc.) redirect to /app equivalents.

## Not included / honest limits
- No live market or options data (no licensed provider configured) — mock data stays labelled.
- No payments or subscription billing yet (architecture only).
- Email confirmation uses default Cloud emails; custom domain email optional later.
