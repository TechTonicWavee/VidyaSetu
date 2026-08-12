# VidyaSetu — Student Portal Completion & Overhaul · Progress

_Last updated: 2026-08-05_

This document tracks every change being made to complete and modernise the **student
portal**. It is a living log — update it as work proceeds.

---

## 1. Goal & scope (agreed)

- **Complete + fully redesign the STUDENT portal only.** Other roles (faculty/dean/
  admin/parent) are intentionally left untouched for a later phase.
- **Data strategy:** keep the already-working DB-backed pages on the local Postgres via
  the existing Next.js API routes; every other page reads from a **swappable mock data
  layer** so it works today and can flip to real APIs later with a one-line change.
- **Design:** full modern overhaul — a cohesive, token-driven design system with real
  dark mode.
- **Backend:** the standalone Express service in `backend/` is fixed, synced and runnable
  alongside Next.js.

## 2. Hard constraints (do not violate)

- ❌ **Never touch the deployed database.** No migrations are run against it. Any required
  schema change goes into a NEW file under `database/local-changes/*.sql` (local only).
  **Target: zero schema changes** — the overhaul needs none.
- ❌ **Nothing is committed or pushed** without explicit approval.
- ✅ All work is local; changes are reversible; the build is verified between phases.

## 3. Environment

- Node `v24`, npm `v11`. Dependencies installed in `vidyasetu/` and `backend/`.
- Env files (local only, not committed):
  - `vidyasetu/.env.local` — DB URL, `JWT_ACCESS_SECRET`, `NEXT_PUBLIC_API_BASE_URL`
    (empty = same-origin), `NEXT_PUBLIC_BACKEND_URL`.
  - `backend/.env` — same DB + matching `JWT_ACCESS_SECRET` + `JWT_REFRESH_SECRET`.
- ⚠️ **Local Postgres (`localhost:5432/vidyasetu`) is currently NOT reachable.** This does
  not block any code work or the whole UI. It only blocks *runtime* verification of the
  DB-backed pages, the backend data endpoints, and seeding. Start Postgres (or point
  `DATABASE_URL` at a reachable DB) to exercise those.

## 4. How to run

```bash
# Frontend (Next.js — includes its own API routes)
cd vidyasetu && npm run dev        # http://localhost:3000

# Backend (Express standalone API) — optional, needs DB for data endpoints
cd backend && npm run dev          # http://localhost:4000  (/health works without DB)

# Quality gates
cd vidyasetu && npm run typecheck && npm run lint && npm run build
cd backend   && npm run typecheck && npm run build
```

To route the frontend through the Express backend instead of same-origin routes, set
`NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` in `vidyasetu/.env.local` (leave empty
for the default, always-working same-origin setup).

---

## 5. Architecture added

### Design system (token-driven, dark-mode correct)
- `app/globals.css` — rewritten to CSS variables (`:root` + `.dark`) for surface / text /
  border / brand / semantic colors. All existing class names, animations and light-mode
  appearance preserved, so other roles are visually unchanged. Adds print styles for the
  résumé export.
- `tailwind.config.ts` — semantic color tokens (`surface`, `content`, `muted`, `line`,
  `brand`, `success/warning/danger/info`) mapped to the CSS variables. Legacy colors kept.

### UI primitives — `components/ui/`
`Button`, `Card` + `CardHeader`, `Badge`, `StatCard`, `PageHeader`, `Tabs`,
`Input`/`Textarea`/`Select`/`Field`, `Avatar`, `ProgressRing`, `ProgressBar`,
`ErrorState`, `SectionTitle`, `ChartCard`, `ChartTooltip` (+`CHART` colors), restyled
`Modal`, plus barrel `index.ts`. Helpers: `lib/utils/cn.ts`, `lib/utils/lucide.ts`.
`components/ErrorBoundary.tsx` catches render errors per subtree.

### Student shell — `components/student/`
- `StudentSidebar.tsx` — dedicated, grouped, collapsible sidebar (desktop) + mobile
  drawer. Uses the real `useAuth().logout`.
- `StudentTopbar.tsx` — page title, search stub, live notifications bell + dropdown,
  theme toggle, profile menu.
- `app/student/layout.tsx` — composes the shell, wraps content in `ErrorBoundary`,
  keeps provider nesting (Auth → Socket → Notifications).

### Swappable data layer — `lib/data/`
- `types.ts` — typed models for every mock feature.
- `mock/*.ts` — realistic fixtures (rankings, skillRadar, career, placement, attendance,
  assignments, extracurricular, actionPlan, potentialGap, dashboard).
- `index.ts` — async getters returning mock now, each marked
  `// TODO: replace with apiGet(...)`. Pages `await` these like a real API.
- `lib/hooks/useAsyncData.ts` — standard loading/error/reload hook.

---

## 6. Page-by-page status (student portal)

| Page | Type | Status |
|------|------|--------|
| Dashboard (`/student`) | DB SPI + mock widgets | ✅ Rebuilt |
| SPI Score | DB-backed | ✅ Rebuilt (logic preserved) |
| Rankings | mock layer | ✅ Rebuilt |
| Skill Radar | mock layer | ✅ Rebuilt |
| Career Path | mock layer | ✅ Rebuilt |
| Placement Readiness | mock layer | ✅ Rebuilt |
| Attendance | mock layer | ✅ Rebuilt |
| Assignments | mock layer | ✅ Rebuilt |
| Extracurriculars | mock layer (+add modal) | ✅ Built out |
| Action Plan | mock layer | ✅ Built out |
| Potential Gap | mock layer | ✅ Built out |
| Résumé Builder | DB profile + fallback | ✅ Rebuilt (working PDF/print) |
| AI Advisor | live/demo fallback | ✅ Rebuilt (graceful demo mode) |
| My Profile (`/profile`) | DB-backed | ✅ Restyled |
| Edit Profile (`/profile/edit`) | DB-backed | ✅ Restyled |
| My Team (`/my-team` + `[teamId]`) | DB-backed | ✅ Restyled |
| Domain Directory | DB-backed | ✅ Restyled |
| Notifications | DB-backed | ✅ Restyled |

## 7. Backend (`backend/`)
- ✅ Canonical Prisma schema + migrations synced from `vidyasetu/prisma/`.
- ✅ Prisma client generated; `typecheck` + `build` clean.
- ✅ Boots on `:4000`; `/health` OK; auth-protected routes return 401 without a token.
- ⏳ Data endpoints + `npm run seed` need a reachable Postgres (see §3).

## 8. Bug fixes / cleanups done
- Fixed 10 pre-existing TS errors in `api/coding-profile/fetch` & `api/form/submit`
  (`next: { revalidate }` → `cache: 'no-store'`).
- Removed styled-jsx type errors by rebuilding `attendance` & `assignments`.
- Made the API client base-URL configurable (`resolveApiUrl`) without changing default
  behaviour.

## 9. Pending work
1. ✅ Restyle DB-backed pages: profile, profile/edit, my-team (+[teamId]), directory,
   notifications — onto the new design system (keep all data wiring).
2. ✅ Final quality gates: `typecheck` + `lint` + `build` (both apps) → zero errors.
   - Next.js: 58/58 static pages generated, zero TS errors
   - Express backend: tsc + prisma generate → clean
3. ⏳ Accessibility pass (aria-labels, focus states) on remaining interactive elements.
4. (Optional, last) flip frontend to the Express backend via `NEXT_PUBLIC_API_BASE_URL`
   and re-verify DB pages — env-gated, non-breaking.

## 10. Notes / risks
- DB unreachable locally → DB pages can't be runtime-verified yet; the UI overhaul, mock
  pages, typecheck and build are all unaffected.
- The Express-backend switch is deferred to the end and gated behind an env var so it can
  never break the working same-origin pages mid-build.
