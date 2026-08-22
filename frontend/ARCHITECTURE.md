# Vidyasetu — System Architecture

This documents the system **as it actually runs today** (post dead-code cleanup, pre role-based
restructure — see `refactor/` for the in-progress migration). Every claim below was verified by
reading the actual code, not inferred from naming — file references are given throughout so you
can check any of it yourself.

---

## 1. The shape of the monorepo

```
Vidyasetu/
├── frontend/    "vidyasetu" — Next.js 14 (App Router) + Tailwind. The live application.
├── backend/     "vidyasetu-backend" — standalone Express + Socket.IO service.
└── refactor/    Migration-in-progress docs (baseline, plan, deletions, findings).
```

Two independent Node packages, each with its **own** Prisma client generated from its **own**
copy of the same schema (`frontend/prisma/schema.prisma` and `backend/prisma/schema.prisma` —
verified identical model lists). They are meant to point at the same Postgres database and be
kept in sync by hand; there is no shared package between them.

**The load-bearing fact that shapes everything else in this document:** the frontend does not
call the Express backend by default. It has its own, parallel implementation of the API.

---

## 2. Two backends, one of them dormant

```mermaid
graph TB
    subgraph Browser
        UI[Next.js pages/components]
    end
    subgraph "frontend/ (Next.js — deployed to Vercel)"
        API["app/api/** route handlers"]
        SRV["lib/server/*, lib/prisma.ts,\nlib/spi/*, lib/resume/*"]
    end
    subgraph "backend/ (standalone Express — NEXT_PUBLIC_API_BASE_URL gated)"
        EXP["routes → controllers → services"]
        SOCK[Socket.IO server]
    end
    DB[(Postgres)]
    SUPA[Supabase Realtime]

    UI -->|apiFetch same-origin, default| API
    UI -.->|only if NEXT_PUBLIC_API_BASE_URL is set —\nunset in this repo's .env| EXP
    API --> SRV --> DB
    EXP --> DB
    UI -->|attendance upload only,\nno same-origin route exists| EXP
    EXP -.->|io.to(studentId).emit — nothing subscribes,\nsee §6| SOCK
    UI <-->|live notifications, actually used| SUPA
```

- **`frontend/lib/api/client.ts`** (`resolveApiUrl`): when `NEXT_PUBLIC_API_BASE_URL` is unset —
  which it is, in both `frontend/.env` and `.env.example` — every `apiFetch()` call resolves
  **same-origin**, straight to `frontend/app/api/**`. That env var is the *only* switch that
  would ever send traffic to the Express service.
- **`frontend/app/api/auth/login/route.ts`** contains the comment *"Ported from the standalone
  backend's POST /api/auth/login"* and calls `frontend/lib/server/authService.ts` — a
  reimplementation, not a proxy. The same pattern holds for teams, invites, directory, and
  notifications: full parallel logic lives under `frontend/lib/server/*` and
  `frontend/app/api/**`.
- **`frontend/progress.md`** (kept — see `refactor/DELETION-REPORT.md`) documents this as
  deliberate: *"keep the already-working DB-backed pages on... the existing Next.js API
  routes... the standalone Express service in backend/ is fixed, synced and runnable alongside
  Next.js... the Express-backend switch is deferred to the end and gated behind an env var so it
  can never break the working same-origin pages."*
- **The one exception is attendance.** There is no `frontend/app/api/attendance` route at all,
  so the faculty attendance-upload page's calls to `/api/attendance/preview` and `/confirm` can
  *only* reach the Express backend — and only if that env var is set, which it isn't here. In
  this repo's default configuration, **the attendance upload feature has no server to reach.**

**Practical upshot:** `backend/` is real, maintained, `tsc`/`build`-clean code — not legacy
cruft — but it is not what serves the deployed app's requests today, with attendance as the
single, currently-non-functional exception.

---

## 3. Frontend (`frontend/`)

### App Router structure

```
app/
├── student/    17 routes — the only portal built to real DB data + a full design system
├── faculty/    12 routes — UI-complete, runs on local mock data (lib/faculty/mock-data.ts)
├── dean/       16 routes — UI-complete, runs on local mock data (lib/dean/mock-data.ts)
├── admin/       5 routes — UI-complete, runs on local mock data
├── parent/       1 route — a 5th portal not mentioned in most planning docs, same pattern
├── api/        37 route handlers — the real, live backend (see §2)
├── login/, form/, demo/, demo-script/, integrations/  — ungrouped top-level pages
└── layout.tsx, page.tsx, globals.css
```

Each of the four named roles is **already** exactly one top-level folder with its own
`layout.tsx` providing role-specific chrome and auth. `app/student/layout.tsx`, for instance,
wraps every student page in `AuthProvider → SocketProvider → NotificationsProvider` and renders
the shared `components/ui/AppShell.tsx` with a role-specific nav config. Faculty/dean/admin
follow the same one-folder-one-layout shape, just without the auth/data wiring.

### Route accessibility right now

`frontend/middleware.ts` + `frontend/lib/access.ts` gate the whole app:

- `RESTRICTED_ROUTES = ['/admin', '/parent']` — these two are **always** redirected to
  `/login`, unconditionally, regardless of any pilot flag. (Note: the middleware's own comment
  says it blocks "admin / faculty / dean / parent," but the actual array only lists `/admin` and
  `/parent` — faculty and dean are *not* blocked. Comment and code disagree; flagged in
  `refactor/FINDINGS.md`, not fixed here.)
- `STUDENT_PILOT_MODE` (`lib/access.ts:1`) is currently **`false`**, so the additional
  allowlist-only pilot restriction is off. If flipped to `true`, only `STUDENT_ALLOWED_ROUTES`
  (`/`, `/login`, `/form*`, `/student`, `/student/profile*`, `/student/spi`) would be reachable
  and everything else would redirect to `/student`.

### Two portals, two different data strategies

- **Student** (`lib/data/`): a mix of real DB-backed pages (profile, team, directory,
  notifications, SPI score — via `app/api/**`) and a deliberate "swappable mock layer"
  (`lib/data/mock/*.ts` + `lib/data/index.ts`, each getter marked `// TODO: replace with
  apiGet(...)`) for rankings, skill radar, career, placement, **attendance**, assignments,
  extracurriculars, action plan, and potential gap. This was an explicit design choice
  (`progress.md` §1) to ship a fully-navigable portal before every endpoint exists.
- **Faculty/dean/admin**: no database models exist for these roles at all (see §5) — their pages
  render entirely from local `lib/{faculty,dean}/mock-data.ts` or inline fixtures. This isn't
  incomplete wiring so much as a portal that hasn't been started yet, by design
  (`progress.md`: *"Other roles (faculty/dean/admin/parent) are intentionally left untouched for
  a later phase"*).

### Design system

`components/ui/` (`AppShell`, `Button`, `Card`, `StatCard`, `PageHeader`, `Tabs`, `Modal`,
`ChartCard`, etc., barrel-exported from `components/ui/index.ts`) plus
`lib/utils/cn.ts`/`lib/utils/lucide.ts` form a token-driven design system used by all four
portals and the ungrouped pages alike — dark-mode-correct via CSS variables in `app/globals.css`
+ `tailwind.config.ts`. This is the one part of the codebase already structured the way the
in-progress role-based refactor wants everything to end up (see `refactor/MIGRATION-PLAN.md`).

---

## 4. Backend (`backend/`)

```
backend/src/
├── routes/ controllers/ services/ validators/   — auth, team, invite, directory, notification
├── routes/, services/                            — attendance (no auth, no controller/validator)
├── middleware/   auth.ts, errorHandler.ts, requestLogger.ts, validate.ts
├── utils/        appError.ts, asyncHandler.ts, jwt.ts, response.ts
├── lib/          prisma.ts, publicStudent.ts
├── sockets/      index.ts (Socket.IO server)
├── seed/         seed.ts, bulkStudents.ts, seed_cgpa.js
├── scripts/oneoff/  one-time data-repair scripts (see README there)
├── config/env.ts
├── app.ts, index.ts
```

**This service is 100% student-domain**, not by convention but by its type system:
`middleware/auth.ts`'s `AuthedRequest` types `user.role` as the literal string `'student'` — not
a union. Every router except `attendance` calls `router.use(authMiddleware)`, so
auth/team/invite/directory/notification are student-only by construction. There is currently no
faculty, dean, or admin code anywhere in `backend/src`.

**Attendance is the odd one out**: `routes/attendance.routes.ts` has **no auth middleware at
all** — the two endpoints (`POST /preview`, `POST /confirm`) are open. `/confirm` writes directly
to `student.attendance` / `classesAttended` / `classesTotal` via Prisma. By current call-graph
evidence it's called only from the faculty attendance-upload page, but the data it writes exists
so students can eventually read it — a genuine write-here/read-there cross-role feature (see
`refactor/MIGRATION-PLAN.md` Finding 6 for the placement decision this implies).

---

## 5. Database

One schema (kept in sync by hand across two copies — `backend/prisma/schema.prisma` and
`frontend/prisma/schema.prisma`, verified identical model lists), 12 models:

`Student`, `CodingProfile`, `Project`, `Certification`, `Hackathon`, `Extracurricular`,
`Internship`, `Team`, `TeamMember`, `TeamInvite`, `Notification`, `RefreshToken`.

**There is no Faculty, Dean, Admin, or Parent model.** Every one of those portals' pages is UI
built ahead of any backing data model — confirming §3's "mock-data-only" description isn't a
gap in the frontend, it's a gap all the way down to the schema.

---

## 6. Auth and real-time

- **Auth**: JWT access token (short-lived, held in memory via `frontend/lib/auth/tokenStore.ts`)
  + refresh token (httpOnly cookie, rotated via `POST /api/auth/refresh`). `apiFetch()`
  transparently retries once on a 401 after a refresh. `AuthProvider.tsx` exposes `useAuth()`
  (student identity + `logout()`) to every student page via the layout.
- **Real-time notifications actually run on Supabase Realtime, not Socket.IO.**
  `frontend/lib/socket/SocketProvider.tsx` says so directly: *"There's no standalone
  backend/Socket.IO server anymore (Vercel serverless functions can't hold a persistent
  WebSocket connection), so live notification push now rides on Supabase Realtime: Postgres row
  replication on the `notifications` table."* It re-implements the same event names
  (`notification:new`, `invite:received`, etc.) via a small in-page emitter fed by a Supabase
  Realtime subscription, so `NotificationsProvider` and the My Team pages didn't need to change.
- **`backend/src/sockets/index.ts` is a complete, working Socket.IO server** — and
  `attendance.routes.ts` calls `getIO().to(studentId).emit('attendance:updated', ...)` on every
  confirmed upload. Given the point directly above, **nothing on the frontend listens for that
  event** — the frontend's realtime path moved to Supabase, the backend's didn't. This emit is
  currently a no-op in practice. Noted in `refactor/FINDINGS.md`, not fixed here.

---

## 7. SPI (Student Performance Index) computation

The **live** pipeline, wired into `app/api/spi/recalculate/route.ts`:

```
lib/spi/sources/{githubScore,leetcodeScore,resume,certifications,internships}.js
        → each produces a { score } shape
lib/spi/evaluators/certificateEvaluators.js   (feeds the certifications source)
        → lib/spi/orchestrator/calculateSPI.js
        → weights and sums the six source scores (lib/spi/config/targets.js, utils/{clamp,helpers,normalize}.js)
        → { spi, evidenceCoverage, dimensions }
```

A second, more elaborate multi-dimension SPI model (`lib/spi/dimensions/*`,
`evaluators/{activitiesEvaluator,extracurricularEvaluator,resumeEvaluators}.js`,
`sources/{academics,activities,extracurriculars,hackathons}.js`, `orchestrator/persistSPI.js`,
`config/dimensionMappings.js`, `breakdown.js`) existed alongside this one with zero callers
anywhere in the repo — it was removed in the Stage 2 cleanup (`refactor/DELETION-REPORT.md`).

---

## 8. Known gaps (documented, not fixed here — see `refactor/FINDINGS.md`)

- Attendance write endpoints have no auth check.
- Attendance is very likely unreachable end-to-end in this repo's default config (§2), and its
  Socket.IO push goes to a listener that no longer exists (§6).
- The student attendance *view* reads mock data (`lib/data/mock/attendance.ts`), not the data the
  faculty upload writes — so even if both ends worked, they aren't currently connected.
- `middleware.ts`'s comment claims faculty/dean are blocked; `RESTRICTED_ROUTES` says otherwise.
- Faculty/dean/admin/parent have no database models — their portals are UI shells over mock data
  by design, not by omission, per `progress.md`.

---

## 9. Where this is headed

A role-based restructure (frontend organized by `student/faculty/dean/admin` + `shared/`,
mirrored in `backend/src/modules/`) is in progress but **not yet applied to any file** beyond
dead-code removal. See, in order:

- `refactor/BASELINE.md` — pre-refactor build/lint/route state
- `refactor/MIGRATION-PLAN.md` — full file-by-file classification, evidence, and open decisions
- `refactor/DELETION-REPORT.md` — what was removed/relocated in the cleanup pass and why

The biggest structural finding from that plan: `app/student|faculty|dean|admin/` already don't
need to move — see Finding 1 there.
