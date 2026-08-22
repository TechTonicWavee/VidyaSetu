# Vidyasetu — System Architecture

This documents the system **as it runs today**, after the role-based restructure
(`refactor/MIGRATION-PLAN.md`) and the Prisma consolidation. Every claim below was verified by
reading the actual code — file references are given throughout so you can check any of it
yourself. See `refactor/FINDINGS.md` for known gaps that were documented rather than fixed.

---

## 1. The shape of the monorepo

```
Vidyasetu/
├── frontend/    "vidyasetu" — Next.js 14 (App Router) + Tailwind. The live application.
├── backend/     "vidyasetu-backend" — standalone Express + Socket.IO service.
└── refactor/    Migration record (baseline, plan, deletions, findings).
```

**Single shared Prisma schema.** `backend/prisma/schema.prisma` is the only schema in the repo —
frontend has no `prisma/` directory of its own anymore. `frontend/lib/shared/prisma.ts` is a
one-line re-export (`export { prisma } from '../../../backend/src/shared/lib/prisma'`) that
reaches across the package boundary into backend's client instance. This is made bundlable by
`next.config.mjs`'s `experimental.externalDir: true`, which lets Next.js's compiler pull in files
outside `frontend/`. Because `prisma generate` always resolves its output relative to the
*schema* file's own `node_modules` (backend's) regardless of what directory you run it from,
frontend keeps its own `@prisma/client` package in sync via
`frontend/scripts/sync-prisma-client.mjs`, wired into `npm run dev/build/typecheck`. Skipping that
sync is exactly how a stale-client / mismatched-field bug reappears — it happened once already
during this restructure (`spiHistory` on `Student`), see `refactor/FINDINGS.md`.

**The load-bearing fact that shapes everything else in this document:** the frontend does not
call the Express backend by default for anything except attendance. It has its own, parallel
implementation of the rest of the API.

---

## 2. Two backends, one of them dormant for everything but attendance

```mermaid
graph TB
    subgraph Browser
        UI[Next.js pages/components]
    end
    subgraph "frontend/ (Next.js — deployed to Vercel)"
        API["app/api/** route handlers"]
        SRV["lib/shared/server/*, lib/shared/prisma.ts,\nlib/shared/spi/*, lib/shared/resume/*"]
    end
    subgraph "backend/ (standalone Express — NEXT_PUBLIC_API_BASE_URL gated)"
        EXP["modules/student/**, modules/shared/attendance/**"]
        SOCK[Socket.IO server]
    end
    DB[(Postgres, one schema)]
    SUPA[Supabase Realtime]

    UI -->|apiFetch same-origin, default| API
    UI -.->|only if NEXT_PUBLIC_API_BASE_URL is set —\nunset in this repo's .env| EXP
    API --> SRV --> DB
    EXP --> DB
    UI -->|attendance: frontend now has its own\napp/api/attendance/{preview,confirm}, same-origin| API
    EXP -.->|io.to(studentId).emit — nothing subscribes,\nsee §6| SOCK
    UI <-->|live notifications, actually used| SUPA
```

- **`frontend/lib/shared/api/client.ts`** (`resolveApiUrl`): when `NEXT_PUBLIC_API_BASE_URL` is
  unset — which it is, in both `frontend/.env` and `.env.example` — every `apiFetch()` call
  resolves **same-origin**, straight to `frontend/app/api/**`. That env var is the *only* switch
  that would ever send traffic to the Express service.
- **`frontend/app/api/auth/login/route.ts`** contains the comment *"Ported from the standalone
  backend's POST /api/auth/login"* and calls `frontend/lib/shared/server/authService.ts` — a
  reimplementation, not a proxy. The same pattern holds for teams, invites, directory, and
  notifications.
- **Attendance now has a same-origin route too.** `frontend/app/api/attendance/{preview,confirm}/
  route.ts` exist and call `frontend/lib/shared/server/attendanceService.ts` — a duplicate
  implementation of the parsing logic in `backend/src/modules/shared/attendance/services/
  attendance.service.ts`, not a shared one. So the faculty attendance-upload page now works
  same-origin by default; the Express version (`backend/src/modules/shared/attendance/`) is a
  second, independently-maintained copy that only gets exercised if
  `NEXT_PUBLIC_API_BASE_URL` is set. **Neither copy has an auth check** — see
  `refactor/FINDINGS.md`.

**Practical upshot:** `backend/` is real, maintained, `tsc`/`build`-clean code — not legacy
cruft — but for everything except attendance, it is not what serves the deployed app's requests
by default.

---

## 3. Frontend (`frontend/`)

### Directory structure

```
frontend/
├── app/
│   ├── student/    17 routes — the only portal built to real DB data + a full design system
│   ├── faculty/    12 routes — UI-complete, runs on local mock data (lib/faculty/mock-data.ts)
│   ├── dean/       16 routes — UI-complete, runs on local mock data (lib/dean/mock-data.ts)
│   ├── admin/       5 routes — UI-complete, runs on local mock data
│   ├── parent/       1 route — a 5th portal not mentioned in most planning docs, same pattern
│   ├── api/        39 route handlers — same-origin implementation (see §2)
│   ├── login/, form/, demo/, demo-script/, integrations/  — ungrouped top-level pages
│   └── layout.tsx, page.tsx, globals.css
├── components/
│   ├── student/ dean/            role-exclusive components
│   └── shared/                   used by 2+ roles (the design system lives here — see below)
├── lib/
│   ├── student/ faculty/ dean/ admin/   role-exclusive: data layer, nav config, API clients
│   └── shared/                          auth, api client, Prisma re-export, server-only code
│       used by app/api/** (resume parsing, the live SPI pipeline, cloudinary, etc.)
└── scripts/sync-prisma-client.mjs
```

Each of the four named roles is **already** exactly one top-level `app/` folder with its own
`layout.tsx` providing role-specific chrome and auth — this is why `app/` itself didn't need to
move as part of the restructure (see `refactor/MIGRATION-PLAN.md` Finding 1). `app/student/
layout.tsx`, for instance, wraps every student page in `AuthProvider → SocketProvider →
NotificationsProvider` and renders the shared `components/shared/ui/AppShell.tsx` with a
role-specific nav config (now at `lib/student/access.ts` for pilot-mode routing).

### Route accessibility right now

`frontend/middleware.ts` + `frontend/lib/student/access.ts` gate the whole app:

- `RESTRICTED_ROUTES = ['/admin', '/parent']` — these two are **always** redirected to
  `/login`, unconditionally, regardless of any pilot flag. (Note: the middleware's own comment
  says it blocks "admin / faculty / dean / parent," but the actual array only lists `/admin` and
  `/parent` — faculty and dean are *not* blocked. Comment and code disagree; flagged in
  `refactor/FINDINGS.md`, not fixed here.)
- `STUDENT_PILOT_MODE` is currently **`false`**, so the additional allowlist-only pilot
  restriction is off. If flipped to `true`, only `STUDENT_ALLOWED_ROUTES` (`/`, `/login`,
  `/form*`, `/student`, `/student/profile*`, `/student/spi`) would be reachable and everything
  else would redirect to `/student`.

### Two portals, two different data strategies

- **Student** (`lib/student/data/`): a mix of real DB-backed pages (profile, team, directory,
  notifications, SPI score, attendance upload — via `app/api/**`) and a deliberate "swappable
  mock layer" (`lib/student/data/mock/*.ts` + `lib/student/data/index.ts`, each getter marked
  `// TODO: replace with apiGet(...)`) for rankings, skill radar, career, placement, the
  attendance *view*, assignments, extracurriculars, action plan, and potential gap.
- **Faculty/dean/admin**: no database models exist for these roles at all (see §5) — their pages
  render entirely from local `lib/{faculty,dean}/mock-data.ts` or inline fixtures.

### Design system

`components/shared/ui/` (`AppShell`, `Button`, `Card`, `StatCard`, `PageHeader`, `Tabs`, `Modal`,
`ChartCard`, etc., barrel-exported from `components/shared/ui/index.ts`) plus
`lib/shared/utils/cn.ts` / `lib/student/utils/lucide.ts` form a token-driven design system used
by all four portals — dark-mode-correct via CSS variables in `app/globals.css` +
`tailwind.config.ts`.

---

## 4. Backend (`backend/`)

```
backend/src/
├── modules/
│   ├── student/     routes/controllers/services/validators for
│   │                 auth, team, invite, directory, notification
│   ├── shared/attendance/   faculty writes, student meant to read — cross-role, not
│   │                         filed under faculty (see MIGRATION-PLAN.md Finding 6)
│   └── faculty/, dean/, admin/   scaffolded (routes/controllers/services/validators
│                                  folders + README) — no backend logic exists for
│                                  these roles yet
├── shared/   config, middleware, utils, lib/prisma, sockets — used by every module
├── seed/     seed.ts, bulkStudents.ts, seed_cgpa.js — operational tooling, not a module
├── scripts/oneoff/   one-time data-repair scripts (see README there)
└── app.ts, index.ts
```

**The `student` module is 100% of the working backend**, not by convention but by its type
system: `shared/middleware/auth.ts`'s `AuthedRequest` types `user.role` as the literal string
`'student'` — not a union. Every router except `attendance` calls
`router.use(authMiddleware)`, so auth/team/invite/directory/notification are student-only by
construction.

**Attendance has no auth middleware at all** — the two endpoints (`POST /preview`,
`POST /confirm`) are open on both the Express and the Next.js copy (§2). `/confirm` writes
directly to `student.attendance` / `classesAttended` / `classesTotal` via Prisma.

Deep-nested backend imports (e.g. `modules/student/services/directory.service.ts` importing
`../../../shared/lib/prisma`) are intentionally relative, not `@/`-aliased: frontend's `@/*`
alias needs zero new tooling (Next.js resolves it natively), but backend runs via plain
`tsc`/`tsx` with no bundler, so aliasing there would require adding `tsc-alias`/
`tsconfig-paths` — new runtime machinery that's itself a source of "works in dev, breaks in
prod" failures.

---

## 5. Database

One schema, `backend/prisma/schema.prisma` (frontend shares it — see §1), 12 models:

`Student`, `CodingProfile`, `Project`, `Certification`, `Hackathon`, `Extracurricular`,
`Internship`, `Team`, `TeamMember`, `TeamInvite`, `Notification`, `RefreshToken`.

**There is no Faculty, Dean, Admin, or Parent model.** Every one of those portals' pages is UI
built ahead of any backing data model.

---

## 6. Auth and real-time

- **Auth**: JWT access token (short-lived, held in memory via
  `frontend/lib/shared/auth/tokenStore.ts`) + refresh token (httpOnly cookie, rotated via
  `POST /api/auth/refresh`). `apiFetch()` transparently retries once on a 401 after a refresh.
  `AuthProvider.tsx` (`lib/shared/auth/`) exposes `useAuth()` to every student page via the
  layout.
- **Real-time notifications actually run on Supabase Realtime, not Socket.IO.**
  `frontend/lib/student/socket/SocketProvider.tsx` says so directly: *"There's no standalone
  backend/Socket.IO server anymore (Vercel serverless functions can't hold a persistent
  WebSocket connection), so live notification push now rides on Supabase Realtime."*
- **`backend/src/shared/sockets/index.ts` is a complete, working Socket.IO server** — and
  the Express attendance route still calls `getIO().to(studentId).emit('attendance:updated',
  ...)` on every confirmed upload. Nothing on the frontend listens for that event anymore — the
  frontend's realtime path moved to Supabase, the backend's didn't.

---

## 7. SPI (Student Performance Index) computation

The **live** pipeline, wired into `app/api/spi/recalculate/route.ts`:

```
lib/shared/spi/sources/{githubScore,leetcodeScore,resume,certifications,internships}.js
        → each produces a { score } shape
lib/shared/spi/evaluators/certificateEvaluators.js   (feeds the certifications source)
        → lib/shared/spi/orchestrator/calculateSPI.js
        → weights and sums the six source scores
          (lib/shared/spi/config/targets.js, utils/{clamp,helpers,normalize}.js)
        → { spi, evidenceCoverage, dimensions }
```

A second, more elaborate multi-dimension SPI model existed alongside this one with zero callers
anywhere in the repo — removed in the Stage 2 cleanup (`refactor/DELETION-REPORT.md`).

---

## 8. Known gaps (documented, not fixed — see `refactor/FINDINGS.md`)

- Attendance write endpoints have no auth check, on either the Express or the Next.js copy.
- The two attendance implementations (`backend/.../attendance.service.ts` and
  `frontend/lib/shared/server/attendanceService.ts`) are independent duplicates of the same
  parsing logic, not a shared module — a bug fixed in one won't apply to the other.
- The Express attendance route's Socket.IO push goes to a listener that no longer exists.
- The student attendance *view* still reads mock data, not the data the upload writes.
- `middleware.ts`'s comment claims faculty/dean are blocked; `RESTRICTED_ROUTES` says otherwise.
- Faculty/dean/admin/parent have no database models — their portals are UI shells over mock
  data by design.
- Skipping `frontend/scripts/sync-prisma-client.mjs` (i.e. running `next dev`/`next build`
  directly instead of through `npm run dev`/`npm run build`) will regenerate frontend's
  `@prisma/client` against a stale copy and can reintroduce type errors that look unrelated to
  whatever you're actually working on.

---

## 9. Where new code goes

See the repo root `README.md` for the practical "I'm building X, where does it live" guide.
Short version: figure out which of the 4 roles (or none) uses it, then:

- Frontend UI/logic exclusive to one role → `frontend/{app,components,lib}/<role>/`
- Frontend UI/logic used by 2+ roles → `frontend/{components,lib}/shared/`
- Backend logic exclusive to one role → `backend/src/modules/<role>/{routes,controllers,
  services,validators}/`
- Backend logic used by 2+ roles → `backend/src/shared/`
- A feature genuinely written by one role and read by another (like attendance) →
  `backend/src/modules/shared/<feature>/`, not filed under either role
