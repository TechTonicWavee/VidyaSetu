# Migration Plan — role-based modular architecture

Stage 1 deliverable. **No files have been moved.** This is the inventory, the import-graph
evidence behind each classification, and a set of decisions I'm flagging for your approval
before Stage 3/4 touch a single file.

Methodology: for `frontend/{app,components,lib,scripts}` I parsed every `import`/`require`/
`import()` statement in all 249 files, resolved `@/` and relative specifiers to actual files,
and built a real dependency graph — then did a reachability walk from each role's `app/{role}/**`
entry points to see which `components/`/`lib/`/`scripts/` files each role's pages actually
pull in, transitively. A file reached from only one role's entry points is single-role; reached
from two or more is shared; reached from none is a dead-code or CLI-script candidate (Stage 2).
For `backend/src` (no path aliases, no per-role folders to seed a BFS from) I traced ownership
from `app.ts`'s router registrations down through controllers → services → validators, and
cross-checked with `authMiddleware`'s role gating and what the frontend actually calls.
Everything below is grep/read-verified, not inferred from filenames — I checked every UNKNOWN
and every "0 references" claim by hand before writing it down (see spot-checks throughout).

**Read the "Findings that change the plan" section first — it matters more than the tables.**

---

## Findings that change the plan (read this before the tables)

### 1. `app/` needs no file moves at all — the four portals are already isolated

Each of `student`, `faculty`, `dean`, `admin` is **already** exactly one top-level `app/`
folder with its own `layout.tsx` (verified: all four exist). That's precisely what a `(role)`
route group would buy you — a shared layout/auth-guard/chrome point for a set of pages — and
Next.js already gives you that for free when the pages already live under one literal folder.
Wrapping `app/student/` in a `(student)` group would require keeping the literal `student/`
segment *inside* the group to preserve the `/student` URL (parens don't remove the need for the
segment, they just make it invisible in the URL when a group needs to span multiple existing
top-level segments) — so the honest version of "wrap student in a route group" is
`app/(student)/student/**`, which is strictly more nesting than what exists today for zero
functional gain. **My recommendation: leave `app/student/`, `app/faculty/`, `app/dean/`,
`app/admin/` exactly where they are.** Route groups earn their place only for the scattered
pages below that don't already share a folder.

### 2. `/login`, `/form`, `/demo`, `/demo-script`, `/integrations`, and root `/` don't belong to any of the 4 roles

These are real, working, top-level routes with no natural home in the four-portal model. This
is where a route group is actually useful — e.g. `app/(auth)/login`, `app/(auth)/form/**` could
share a layout — but I'm not doing this without your sign-off since it's optional, not required
for correctness. Flagged as **DECISION 1** below.

### 3. `/parent` is a fully-built 5th portal the task brief doesn't mention

`app/parent/` has its own `page.tsx` **and its own `layout.tsx`** — structurally identical to
the four named roles, not a stray page. `components/parent-communication` on the faculty side
and `lib/nav/parent.ts` also exist. The task says "four portals — student, faculty, dean,
admin." I have not assumed an answer. Flagged as **DECISION 2** below.

### 4. The standalone Express `backend/` is not in the live request path today

This is the single biggest thing I found, and it changes what "restructure the backend by role"
even means here. Evidence, in order:

- `frontend/lib/api/client.ts`'s `resolveApiUrl()`: when `NEXT_PUBLIC_API_BASE_URL` is unset,
  every `apiFetch()` call resolves **same-origin**, i.e. to `frontend/app/api/**`, not to the
  Express service in `backend/`. The var is unset in `frontend/.env` and absent even from
  `.env.example` — nothing in the repo turns it on.
- `frontend/app/api/auth/login/route.ts` contains the comment *"Ported from the standalone
  backend's POST /api/auth/login"* and calls `frontend/lib/server/authService.ts` — a parallel
  reimplementation of `backend/src/services/auth.service.ts`, not a proxy to it.
- `frontend/progress.md` (a Stage 2 deletion candidate — see below, I read it before judging it)
  confirms this in its own words: *"keep the already-working DB-backed pages on the local
  Postgres via the existing Next.js API routes... the standalone Express service in backend/ is
  fixed, synced and runnable alongside Next.js"* and *"the Express-backend switch is deferred to
  the end and gated behind an env var so it can never break the working same-origin pages."*
- The one exception is `/api/attendance/*` — there is no `frontend/app/api/attendance` route at
  all, so the faculty attendance-upload page's `apiFetch('/api/attendance/preview')` call can
  **only** reach the Express backend, and only if `NEXT_PUBLIC_API_BASE_URL` is set. It isn't,
  in this repo's `.env`. **This means the attendance upload feature I just made compile likely
  doesn't reach a server today in the default configuration.** Written up as a FINDINGS.md item,
  not fixed — flagging it here because it's the reason attendance's backend classification is
  genuinely ambiguous rather than obvious.

Net effect: `backend/src` is a real, maintained, but currently-inactive-by-default parallel
implementation of the student portal's server side, plus one bolted-on attendance module that
may not be reachable at all right now. I'm restructuring it as asked (Stage 4), but you should
know going in that "make the API contract match exactly" is being verified against code that
isn't what's actually serving requests today unless that env var gets set somewhere I can't see
(a hosting platform's dashboard, etc.). Flagged as **DECISION 3** below.

### 5. The backend has no faculty/dean/admin code — it's 100% student, by its own type system

`backend/src/middleware/auth.ts`'s `AuthedRequest` types `user.role` as the literal `'student'`
— not a union. Every route except `attendance` calls `router.use(authMiddleware)`, so
auth/team/invite/directory/notification are all, by the type system itself, student-only.
`modules/faculty/`, `modules/dean/`, `modules/admin/` would start **empty**. Flagged as
**DECISION 4** below — do you want empty placeholder folders scaffolded now, or created only
when real backend work for those roles begins?

### 6. Attendance is the cross-role case the task brief told me to flag, not decide

`backend/src/routes/attendance.routes.ts` has **no auth middleware at all** (that's also why
the `requireAuth` import I removed in the Stage-0 fix commit was silently unused — it was never
wired in). By current call-graph evidence, only `frontend/app/faculty/attendance/page.tsx`
calls these two endpoints (`/preview`, `/confirm`); the student attendance page
(`app/student/attendance/page.tsx`) reads from `lib/data/mock/attendance.ts` — mock data, not
this backend at all. So by strict single-caller evidence, attendance is faculty-only today. But
the data these endpoints write (`student.attendance`, `classesAttended`, `classesTotal`) exists
specifically so students can eventually see it — this is the textbook "written by faculty, read
by students" case the brief pre-flagged. **My recommendation:** treat it as shared
(`backend/src/modules/shared/attendance/`) rather than faculty-only, because filing it under
faculty today only to re-move it the moment the student read-side gets wired up is pure churn.
Flagged as **DECISION 5** below — both options are legitimate, this is your call.

### 7. A second, dead SPI computation pipeline sits next to the one that's actually used

`frontend/app/api/spi/recalculate/route.ts` uses `lib/spi/sources/{githubScore,leetcodeScore,
resume,certifications,internships}.js` + `lib/spi/evaluators/certificateEvaluators.js` +
`lib/spi/orchestrator/calculateSPI.js` — confirmed by reading `calculateSPI.js`, which takes
pre-computed `{github,leetcode,resume,...}.score` numbers and just weights/combines them; it has
no imports of its own. Separately, `lib/spi/dimensions/*` (6 files), `lib/spi/evaluators/
{activitiesEvaluator,extracurricularEvaluator,resumeEvaluators}.js`, `lib/spi/sources/
{academics,activities,extracurriculars,hackathons}.js`, `lib/spi/config/{dimensionMappings,
weight}.js`, `lib/spi/breakdown.js`, and `lib/spi/orchestrator/persistSPI.js` are a **complete,
separate, more elaborate SPI model with zero importers anywhere in the repo.** This reads like
an earlier or parallel design that was superseded. Full list and the grep evidence for each is
in the dead-code section below — this is Stage 2's call, not Stage 1's, but I'm surfacing it now
since it's a large, high-confidence finding from the same graph work.

### 8. The old pre-redesign sidebar components are already orphaned — this explains `remove-sidebars.ts`

`components/CollapsibleSidebar.tsx`, `components/student/{StudentSidebar,StudentTopbar}.tsx`,
`components/dean/{DeanSidebar,DeanStatsRow,StatCard,UpcomingDates}.tsx` all have **zero**
importers anywhere (verified with precise import-path grep, not just filename grep — filename
grep on "StatCard" is misleading because `components/ui/StatCard.tsx` is a different, live,
shared component of the same name). `frontend/progress.md` §5 documents the replacement: a new
`components/ui/AppShell.tsx`-based shell + per-role `layout.tsx`. `remove-sidebars.ts` (a Stage
2 candidate) was evidently the codemod that ripped the `<aside>` usages out of pages — it just
didn't delete the now-unused component files themselves. Stage 2 material, surfaced here because
it's the same evidence pass.
---

## Decisions I need from you before Stage 3/4

| # | Question | My recommendation |
|---|---|---|
| 1 | Group `login`/`form`/`demo`/`demo-script`/`integrations`/root under an `(auth)`/`(public)` route group, or leave them as scattered top-level pages? | Leave as-is for this refactor (lower risk); revisit separately if you want the grouping |
| 2 | Is `/parent` a 5th portal in scope for this refactor (gets `frontend/{app,components,lib}/parent/`), explicitly out of scope (left untouched, undocumented), or something else? | Treat it like the 4 named roles structurally (it already has its own layout) but call it out in the README as a 5th, unspecified-in-the-brief portal |
| 3 | `backend/src` isn't in the live request path by default (see Finding 4) — restructure it anyway per Stage 4, or pause on backend restructuring until you confirm whether some deployment actually sets `NEXT_PUBLIC_API_BASE_URL`? | I'd restructure it anyway — it's real, synced code and the task asked for it — but wanted this on record before investing the effort |
| 4 | Backend `modules/faculty/`, `modules/dean/`, `modules/admin/` would be empty (Finding 5) — scaffold empty folders now, or only create a role's module folder when it first gets real content? | Don't scaffold empty folders — an empty folder implies parity that doesn't exist and is one more thing to explain later |
| 5 | Attendance backend module (Finding 6): `modules/faculty/` (matches today's only caller) or `modules/shared/` (matches its cross-role intent)? | `modules/shared/attendance/` — avoids a near-certain second move later |

### The "api-only cluster" (31 frontend/lib files)

These files — `lib/server/*`, `lib/prisma.ts`, `lib/auth/verifyAccessToken.ts`,
`lib/resume/*`, `lib/certificate/*`, and the *live* half of `lib/spi/*` (`sources/`,
`orchestrator/calculateSPI.js`, `evaluators/certificateEvaluators.js`) — are reached **only**
through `app/api/**`, never directly by any of the 4 role app-trees. Since `app/api` itself
isn't being role-partitioned (Stage 3 says leave it alone, and Finding 1 already established the
4 roles need no `app/` moves), splitting this server-only layer by "which role's data does this
conceptually serve" would mean guessing from route names (`/api/spi/*` "feels" student-domain,
`/api/directory` too) rather than evidence — exactly what the brief says not to do. **My
recommendation: put the whole cluster in `frontend/lib/shared/`,** consistent with the brief's
own example that auth/error-handling/Prisma/response-helpers are "almost certainly shared." This
is reflected in the table below; flag if you'd rather split it by domain guesswork instead.

### The "public_or_root" single-role files (`components/DemoContext.tsx`,
`components/KeyboardShortcuts.tsx`, `lib/nav/parent.ts`)

These are reached only from the non-role pages in Finding 2/3. Proposed path depends on Decision
1/2 above (whether those pages get their own group/folder) — provisionally placed in
`frontend/{components,lib}/shared/` in the table below since they don't belong to any of the 4
roles either.

### `backend/src/seed/{seed.ts,bulkStudents.ts}`

Content is student-domain (seeds demo students/teams/directory data — confirmed by reading
`seed.ts`'s own header comment), but it's operational tooling invoked manually
(`npm run seed`), not part of any request path. **Recommendation: leave at
`backend/src/seed/` unchanged** rather than nest under `modules/student/`, matching how the task
treats dev scripts as their own category elsewhere. Flag if you'd rather it live under the
student module for consistency.

---

## Full file tables

### `frontend/app/**` (102 files) — proposed: no moves (see Finding 1/2/3)
| current path | proposed path | classification | evidence |
|---|---|---|---|
| frontend/app/admin/configuration/page.tsx | frontend/app/admin/configuration/page.tsx  (UNCHANGED — see finding) | admin | top-level app/ segment = admin, already its own URL namespace |
| frontend/app/admin/institution/page.tsx | frontend/app/admin/institution/page.tsx  (UNCHANGED — see finding) | admin | top-level app/ segment = admin, already its own URL namespace |
| frontend/app/admin/layout.tsx | frontend/app/admin/layout.tsx  (UNCHANGED — see finding) | admin | top-level app/ segment = admin, already its own URL namespace |
| frontend/app/admin/page.tsx | frontend/app/admin/page.tsx  (UNCHANGED — see finding) | admin | top-level app/ segment = admin, already its own URL namespace |
| frontend/app/admin/spi-config/page.tsx | frontend/app/admin/spi-config/page.tsx  (UNCHANGED — see finding) | admin | top-level app/ segment = admin, already its own URL namespace |
| frontend/app/api/ai/context/route.ts | frontend/app/api/ai/context/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/auth/form-login/route.ts | frontend/app/api/auth/form-login/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/auth/login/route.ts | frontend/app/api/auth/login/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/auth/logout/route.ts | frontend/app/api/auth/logout/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/auth/refresh/route.ts | frontend/app/api/auth/refresh/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/auth/reset-password/route.ts | frontend/app/api/auth/reset-password/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/auth/set-password/route.ts | frontend/app/api/auth/set-password/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/auth/verify-dob/route.ts | frontend/app/api/auth/verify-dob/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/coding-profile/fetch/route.ts | frontend/app/api/coding-profile/fetch/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/directory/domains/route.ts | frontend/app/api/directory/domains/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/directory/route.ts | frontend/app/api/directory/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/directory/[universityId]/route.ts | frontend/app/api/directory/[universityId]/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/form/submit/route.ts | frontend/app/api/form/submit/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/invites/[id]/accept/route.ts | frontend/app/api/invites/[id]/accept/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/invites/[id]/decline/route.ts | frontend/app/api/invites/[id]/decline/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/invites/[id]/route.ts | frontend/app/api/invites/[id]/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/notifications/[id]/read/route.ts | frontend/app/api/notifications/[id]/read/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/notifications/read-all/route.ts | frontend/app/api/notifications/read-all/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/notifications/route.ts | frontend/app/api/notifications/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/notifications/unread-count/route.ts | frontend/app/api/notifications/unread-count/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/spi/recalculate/route.ts | frontend/app/api/spi/recalculate/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/student/profile/route.ts | frontend/app/api/student/profile/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/student/rankings/route.ts | frontend/app/api/student/rankings/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/student/resume-pdf/route.ts | frontend/app/api/student/resume-pdf/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/student/update/route.ts | frontend/app/api/student/update/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/teams/[id]/invites/route.ts | frontend/app/api/teams/[id]/invites/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/teams/[id]/join-requests/route.ts | frontend/app/api/teams/[id]/join-requests/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/teams/[id]/members/[userId]/route.ts | frontend/app/api/teams/[id]/members/[userId]/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/teams/[id]/route.ts | frontend/app/api/teams/[id]/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/teams/invites/received/route.ts | frontend/app/api/teams/invites/received/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/teams/invites/sent/route.ts | frontend/app/api/teams/invites/sent/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/teams/my/route.ts | frontend/app/api/teams/my/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/teams/open/route.ts | frontend/app/api/teams/open/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/teams/route.ts | frontend/app/api/teams/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/upload/route.ts | frontend/app/api/upload/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/uploads/delete/route.ts | frontend/app/api/uploads/delete/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/api/uploads/signature/route.ts | frontend/app/api/uploads/signature/route.ts  (UNCHANGED per Stage 3 instructions) | api (route handler, not role-partitioned) | top-level app/ segment = api, already its own URL namespace |
| frontend/app/dean/agent/page.tsx | frontend/app/dean/agent/page.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/_context/DeanContext.tsx | frontend/app/dean/_context/DeanContext.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/cross-branch/page.tsx | frontend/app/dean/cross-branch/page.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/curriculum/page.tsx | frontend/app/dean/curriculum/page.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/_data/mockData.ts | frontend/app/dean/_data/mockData.ts  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/department/page.tsx | frontend/app/dean/department/page.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/faculty-performance/page.tsx | frontend/app/dean/faculty-performance/page.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/forecasting/page.tsx | frontend/app/dean/forecasting/page.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/layout.tsx | frontend/app/dean/layout.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/meetings/page.tsx | frontend/app/dean/meetings/page.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/notifications/page.tsx | frontend/app/dean/notifications/page.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/page.tsx | frontend/app/dean/page.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/policy-simulation/page.tsx | frontend/app/dean/policy-simulation/page.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/reports/page.tsx | frontend/app/dean/reports/page.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/schedule/page.tsx | frontend/app/dean/schedule/page.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/dean/student-intelligence/page.tsx | frontend/app/dean/student-intelligence/page.tsx  (UNCHANGED — see finding) | dean | top-level app/ segment = dean, already its own URL namespace |
| frontend/app/demo/DemoStarter.tsx | frontend/app/demo/DemoStarter.tsx  (UNCHANGED, or optional (auth)/(public) group) | public_or_root | top-level app/ segment = demo, already its own URL namespace |
| frontend/app/demo/page.tsx | frontend/app/demo/page.tsx  (UNCHANGED, or optional (auth)/(public) group) | public_or_root | top-level app/ segment = demo, already its own URL namespace |
| frontend/app/demo-script/page.tsx | frontend/app/demo-script/page.tsx  (UNCHANGED, or optional (auth)/(public) group) | public_or_root | top-level app/ segment = demo-script, already its own URL namespace |
| frontend/app/demo-script/PrintButton.tsx | frontend/app/demo-script/PrintButton.tsx  (UNCHANGED, or optional (auth)/(public) group) | public_or_root | top-level app/ segment = demo-script, already its own URL namespace |
| frontend/app/faculty/alerts/page.tsx | frontend/app/faculty/alerts/page.tsx  (UNCHANGED — see finding) | faculty | top-level app/ segment = faculty, already its own URL namespace |
| frontend/app/faculty/analytics/page.tsx | frontend/app/faculty/analytics/page.tsx  (UNCHANGED — see finding) | faculty | top-level app/ segment = faculty, already its own URL namespace |
| frontend/app/faculty/attendance/page.tsx | frontend/app/faculty/attendance/page.tsx  (UNCHANGED — see finding) | faculty | top-level app/ segment = faculty, already its own URL namespace |
| frontend/app/faculty/co-attainment/page.tsx | frontend/app/faculty/co-attainment/page.tsx  (UNCHANGED — see finding) | faculty | top-level app/ segment = faculty, already its own URL namespace |
| frontend/app/faculty/layout.tsx | frontend/app/faculty/layout.tsx  (UNCHANGED — see finding) | faculty | top-level app/ segment = faculty, already its own URL namespace |
| frontend/app/faculty/my-classes/page.tsx | frontend/app/faculty/my-classes/page.tsx  (UNCHANGED — see finding) | faculty | top-level app/ segment = faculty, already its own URL namespace |
| frontend/app/faculty/page.tsx | frontend/app/faculty/page.tsx  (UNCHANGED — see finding) | faculty | top-level app/ segment = faculty, already its own URL namespace |
| frontend/app/faculty/parent-communication/page.tsx | frontend/app/faculty/parent-communication/page.tsx  (UNCHANGED — see finding) | faculty | top-level app/ segment = faculty, already its own URL namespace |
| frontend/app/faculty/parent-visit/page.tsx | frontend/app/faculty/parent-visit/page.tsx  (UNCHANGED — see finding) | faculty | top-level app/ segment = faculty, already its own URL namespace |
| frontend/app/faculty/reports/page.tsx | frontend/app/faculty/reports/page.tsx  (UNCHANGED — see finding) | faculty | top-level app/ segment = faculty, already its own URL namespace |
| frontend/app/faculty/student-intelligence/page.tsx | frontend/app/faculty/student-intelligence/page.tsx  (UNCHANGED — see finding) | faculty | top-level app/ segment = faculty, already its own URL namespace |
| frontend/app/faculty/student/profile/page.tsx | frontend/app/faculty/student/profile/page.tsx  (UNCHANGED — see finding) | faculty | top-level app/ segment = faculty, already its own URL namespace |
| frontend/app/form/login/page.tsx | frontend/app/form/login/page.tsx  (UNCHANGED, or optional (auth)/(public) group) | public_or_root | top-level app/ segment = form, already its own URL namespace |
| frontend/app/form/page.tsx | frontend/app/form/page.tsx  (UNCHANGED, or optional (auth)/(public) group) | public_or_root | top-level app/ segment = form, already its own URL namespace |
| frontend/app/integrations/page.tsx | frontend/app/integrations/page.tsx  (UNCHANGED, or optional (auth)/(public) group) | public_or_root | top-level app/ segment = integrations, already its own URL namespace |
| frontend/app/layout.tsx | frontend/app/layout.tsx  (UNCHANGED, or optional (auth)/(public) group) | public_or_root | top-level app/ segment = layout.tsx, already its own URL namespace |
| frontend/app/login/page.tsx | frontend/app/login/page.tsx  (UNCHANGED, or optional (auth)/(public) group) | public_or_root | top-level app/ segment = login, already its own URL namespace |
| frontend/app/page.tsx | frontend/app/page.tsx  (UNCHANGED, or optional (auth)/(public) group) | public_or_root | top-level app/ segment = page.tsx, already its own URL namespace |
| frontend/app/parent/layout.tsx | frontend/app/parent/layout.tsx  (UNCHANGED — flagged) | parent (undefined 5th role — flag) | top-level app/ segment = parent, already its own URL namespace |
| frontend/app/parent/page.tsx | frontend/app/parent/page.tsx  (UNCHANGED — flagged) | parent (undefined 5th role — flag) | top-level app/ segment = parent, already its own URL namespace |
| frontend/app/student/action-plan/page.tsx | frontend/app/student/action-plan/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/ai-advisor/page.tsx | frontend/app/student/ai-advisor/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/assignments/page.tsx | frontend/app/student/assignments/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/attendance/page.tsx | frontend/app/student/attendance/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/directory/page.tsx | frontend/app/student/directory/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/extracurricular/page.tsx | frontend/app/student/extracurricular/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/layout.tsx | frontend/app/student/layout.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/my-team/page.tsx | frontend/app/student/my-team/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/my-team/[teamId]/page.tsx | frontend/app/student/my-team/[teamId]/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/notifications/page.tsx | frontend/app/student/notifications/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/page.tsx | frontend/app/student/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/placement/page.tsx | frontend/app/student/placement/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/potential-gap/page.tsx | frontend/app/student/potential-gap/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/profile/edit/page.tsx | frontend/app/student/profile/edit/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/profile/page.tsx | frontend/app/student/profile/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/rankings/page.tsx | frontend/app/student/rankings/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/resume/page.tsx | frontend/app/student/resume/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/skill-radar/page.tsx | frontend/app/student/skill-radar/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/spi/page.tsx | frontend/app/student/spi/page.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |
| frontend/app/student/SpiProgressionChart.tsx | frontend/app/student/SpiProgressionChart.tsx  (UNCHANGED — see finding) | student | top-level app/ segment = student, already its own URL namespace |

---

### `backend/src/**` (37 files)

| current path | proposed path | classification | evidence |
|---|---|---|---|
| backend/src/app.ts | backend/src/app.ts (unchanged) | shared (bootstrap) | mounts every router; not domain-specific |
| backend/src/index.ts | backend/src/index.ts (unchanged) | shared (bootstrap) | process entrypoint |
| backend/src/config/env.ts | backend/src/shared/config/env.ts | shared | imported by app.ts and services across all domains |
| backend/src/middleware/auth.ts | backend/src/shared/middleware/auth.ts | shared | `authMiddleware`/`AuthedRequest` imported by team/invite/directory/notification routes |
| backend/src/middleware/errorHandler.ts | backend/src/shared/middleware/errorHandler.ts | shared | imported by app.ts (notFoundHandler/errorHandler), used globally |
| backend/src/middleware/requestLogger.ts | backend/src/shared/middleware/requestLogger.ts | shared | imported by app.ts globally |
| backend/src/middleware/validate.ts | backend/src/shared/middleware/validate.ts | shared | zod-validation wrapper, imported by multiple routes/validators |
| backend/src/utils/appError.ts | backend/src/shared/utils/appError.ts | shared | imported by middleware/auth.ts, errorHandler.ts, and every service |
| backend/src/utils/asyncHandler.ts | backend/src/shared/utils/asyncHandler.ts | shared | imported by every controller |
| backend/src/utils/jwt.ts | backend/src/shared/utils/jwt.ts | shared | imported by middleware/auth.ts and auth.service.ts |
| backend/src/utils/response.ts | backend/src/shared/utils/response.ts | shared | imported by every controller (`ok(...)` helper) |
| backend/src/lib/prisma.ts | backend/src/shared/lib/prisma.ts | shared | imported by every service + attendance.routes.ts directly |
| backend/src/sockets/index.ts | backend/src/shared/sockets/index.ts | shared | `getIO()` imported by attendance.routes.ts; registered in index.ts (server bootstrap) |
| backend/src/routes/auth.routes.ts | backend/src/modules/student/routes/auth.routes.ts | student | `AuthedRequest.user.role` is typed `'student'` only; ported into frontend/lib/server/authService.ts as "loginStudent" |
| backend/src/controllers/auth.controller.ts | backend/src/modules/student/controllers/auth.controller.ts | student | imported only by auth.routes.ts |
| backend/src/services/auth.service.ts | backend/src/modules/student/services/auth.service.ts | student | imported only by auth.controller.ts |
| backend/src/validators/auth.schema.ts | backend/src/modules/student/validators/auth.schema.ts | student | imported only by auth.routes.ts/controller |
| backend/src/routes/team.routes.ts | backend/src/modules/student/routes/team.routes.ts | student | gated by `authMiddleware` (student-only role type); consumed by `frontend/lib/api/teams.ts`, which my frontend graph shows is reached only from student-bucket pages |
| backend/src/controllers/team.controller.ts | backend/src/modules/student/controllers/team.controller.ts | student | imported only by team.routes.ts |
| backend/src/services/team.service.ts | backend/src/modules/student/services/team.service.ts | student | imported by team.controller.ts and invite.controller.ts |
| backend/src/validators/team.schema.ts | backend/src/modules/student/validators/team.schema.ts | student | imported only by team.routes.ts/controller |
| backend/src/routes/invite.routes.ts | backend/src/modules/student/routes/invite.routes.ts | student | gated by `authMiddleware`; invites are a sub-feature of the team domain |
| backend/src/controllers/invite.controller.ts | backend/src/modules/student/controllers/invite.controller.ts | student | imports team.service.ts directly, no separate invite service exists |
| backend/src/routes/directory.routes.ts | backend/src/modules/student/routes/directory.routes.ts | student | gated by `authMiddleware`; consumed by `frontend/lib/api/directory.ts`, reached only from student-bucket pages |
| backend/src/controllers/directory.controller.ts | backend/src/modules/student/controllers/directory.controller.ts | student | imported only by directory.routes.ts |
| backend/src/services/directory.service.ts | backend/src/modules/student/services/directory.service.ts | student | imported only by directory.controller.ts |
| backend/src/validators/directory.schema.ts | backend/src/modules/student/validators/directory.schema.ts | student | imported only by directory.routes.ts/controller |
| backend/src/lib/publicStudent.ts | backend/src/modules/student/lib/publicStudent.ts | student | imported by directory.service.ts and team.service.ts only |
| backend/src/routes/notification.routes.ts | backend/src/modules/student/routes/notification.routes.ts | student | gated by `authMiddleware`; consumed by `frontend/lib/api/notifications.ts`, reached only from student-bucket pages |
| backend/src/controllers/notification.controller.ts | backend/src/modules/student/controllers/notification.controller.ts | student | imported only by notification.routes.ts |
| backend/src/services/notification.service.ts | backend/src/modules/student/services/notification.service.ts | student | imported only by notification.controller.ts |
| backend/src/validators/notification.schema.ts | backend/src/modules/student/validators/notification.schema.ts | student | imported only by notification.routes.ts/controller |
| backend/src/routes/attendance.routes.ts | **FLAGGED — see cross-role note** | cross-role (faculty writes, student meant to read) | see "Attendance" flag below |
| backend/src/services/attendance.service.ts | **FLAGGED — see cross-role note** | cross-role | see "Attendance" flag below |
| backend/src/services/attendance.service.test.ts | next to attendance.service.ts, wherever it lands | test (Stage 4 rule: tests sit beside their source) | co-located with the file it tests |
| backend/src/seed/seed.ts | **FLAGGED — see "seed/" note** | student-domain content, but operational tooling | seeds student/team/directory/notification demo data only |
| backend/src/seed/bulkStudents.ts | **FLAGGED — see "seed/" note** | student-domain content, but operational tooling | imported only by seed.ts |

### `frontend/components/**`, `frontend/lib/**`, `frontend/scripts/**` (147 files)

| current path | proposed path | classification | evidence |
|---|---|---|---|
| frontend/components/CollapsibleSidebar.tsx | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/components/dean/AgentChat.tsx | frontend/components/dean/AgentChat.tsx | dean | reached via import graph from app/{dean}/** entry points |
| frontend/components/dean/DeanSidebar.tsx | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/components/dean/DeanStatsRow.tsx | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/components/dean/MeetingCard.tsx | frontend/components/dean/MeetingCard.tsx | dean | reached via import graph from app/{dean}/** entry points |
| frontend/components/dean/NotificationBanner.tsx | frontend/components/dean/NotificationBanner.tsx | dean | reached via import graph from app/{dean}/** entry points |
| frontend/components/dean/StatCard.tsx | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/components/dean/UpcomingDates.tsx | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/components/DemoContext.tsx | frontend/components/shared/DemoContext.tsx  (flagged — see "public/root" note) | public_or_root | reached via import graph from app/{public_or_root}/** entry points |
| frontend/components/directory/InviteToTeamModal.tsx | frontend/components/student/directory/InviteToTeamModal.tsx | student | reached via import graph from app/{student}/** entry points |
| frontend/components/directory/StudentProfileModal.tsx | frontend/components/student/directory/StudentProfileModal.tsx | student | reached via import graph from app/{student}/** entry points |
| frontend/components/EmptyState.tsx | frontend/components/shared/EmptyState.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ErrorBoundary.tsx | frontend/components/shared/ErrorBoundary.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/KeyboardShortcuts.tsx | frontend/components/shared/KeyboardShortcuts.tsx  (flagged — see "public/root" note) | public_or_root | reached via import graph from app/{public_or_root}/** entry points |
| frontend/components/PilotAnnouncementModal.tsx | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/components/profile/FileUploadField.tsx | frontend/components/student/profile/FileUploadField.tsx | student | reached via import graph from app/{student}/** entry points |
| frontend/components/resume/LatexEditor.tsx | frontend/components/student/resume/LatexEditor.tsx | student | reached via import graph from app/{student}/** entry points |
| frontend/components/resume/PdfPreview.tsx | frontend/components/student/resume/PdfPreview.tsx | student | reached via import graph from app/{student}/** entry points |
| frontend/components/resume/templates/jake.ts | frontend/components/student/resume/templates/jake.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/components/Skeleton.tsx | frontend/components/shared/Skeleton.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/student/StudentSidebar.tsx | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/components/student/StudentTopbar.tsx | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/components/team/CreateTeamModal.tsx | frontend/components/student/team/CreateTeamModal.tsx | student | reached via import graph from app/{student}/** entry points |
| frontend/components/team/InviteMemberModal.tsx | frontend/components/student/team/InviteMemberModal.tsx | student | reached via import graph from app/{student}/** entry points |
| frontend/components/ThemeProvider.tsx | frontend/components/shared/ThemeProvider.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ToastContext.tsx | frontend/components/shared/ToastContext.tsx | public_or_root+student | reached via import graph from app/{public_or_root,student}/** entry points |
| frontend/components/ui/AppShell.tsx | frontend/components/shared/ui/AppShell.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/AppSidebar.tsx | frontend/components/shared/ui/AppSidebar.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/AppTopbar.tsx | frontend/components/shared/ui/AppTopbar.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/Avatar.tsx | frontend/components/shared/ui/Avatar.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/Badge.tsx | frontend/components/shared/ui/Badge.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/Button.tsx | frontend/components/shared/ui/Button.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/Card.tsx | frontend/components/shared/ui/Card.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/ChartCard.tsx | frontend/components/shared/ui/ChartCard.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/ChartTooltip.tsx | frontend/components/shared/ui/ChartTooltip.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/ErrorState.tsx | frontend/components/shared/ui/ErrorState.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/index.ts | frontend/components/shared/ui/index.ts | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/Input.tsx | frontend/components/shared/ui/Input.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/Modal.tsx | frontend/components/shared/ui/Modal.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/PageHeader.tsx | frontend/components/shared/ui/PageHeader.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/ProgressBar.tsx | frontend/components/shared/ui/ProgressBar.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/ProgressRing.tsx | frontend/components/shared/ui/ProgressRing.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/SectionTitle.tsx | frontend/components/shared/ui/SectionTitle.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/StatCard.tsx | frontend/components/shared/ui/StatCard.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/components/ui/Tabs.tsx | frontend/components/shared/ui/Tabs.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/lib/access.ts | frontend/lib/student/access.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/announcement.ts | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/api/client.ts | frontend/lib/shared/api/client.ts | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/lib/api/config.ts | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/api/directory.ts | frontend/lib/student/api/directory.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/api/notifications.ts | frontend/lib/student/api/notifications.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/api/sameOriginFetch.ts | frontend/lib/shared/api/sameOriginFetch.ts | public_or_root+student | reached via import graph from app/{public_or_root,student}/** entry points |
| frontend/lib/api/teams.ts | frontend/lib/student/api/teams.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/auth/AuthProvider.tsx | frontend/lib/shared/auth/AuthProvider.tsx | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/lib/auth/DemoAuthProvider.tsx | (not moved in Stage 3 — see Stage 2) | UNKNOWN — ask | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/auth/tokenStore.ts | frontend/lib/shared/auth/tokenStore.ts | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/lib/auth/verifyAccessToken.ts | frontend/lib/shared/auth/verifyAccessToken.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/certificate/parseCertificateName.ts | frontend/lib/shared/certificate/parseCertificateName.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/constants/domains.ts | frontend/lib/shared/constants/domains.ts | api+student | reached via import graph from app/{api,student}/** entry points |
| frontend/lib/data/index.ts | frontend/lib/student/data/index.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/data/mock/actionPlan.ts | frontend/lib/student/data/mock/actionPlan.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/data/mock/assignments.ts | frontend/lib/student/data/mock/assignments.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/data/mock/attendance.ts | frontend/lib/student/data/mock/attendance.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/data/mock/career.ts | frontend/lib/student/data/mock/career.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/data/mock/dashboard.ts | frontend/lib/student/data/mock/dashboard.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/data/mock/extracurricular.ts | frontend/lib/student/data/mock/extracurricular.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/data/mock/placement.ts | frontend/lib/student/data/mock/placement.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/data/mock/potentialGap.ts | frontend/lib/student/data/mock/potentialGap.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/data/mock/skillRadar.ts | frontend/lib/student/data/mock/skillRadar.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/data/types.ts | frontend/lib/student/data/types.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/dean/intelligence/analyzer.ts | frontend/lib/dean/intelligence/analyzer.ts | dean | reached via import graph from app/{dean}/** entry points |
| frontend/lib/dean/mock-data.ts | frontend/lib/dean/mock-data.ts | dean | reached via import graph from app/{dean}/** entry points |
| frontend/lib/faculty/mock-data.ts | frontend/lib/faculty/mock-data.ts | faculty | reached via import graph from app/{faculty}/** entry points |
| frontend/lib/format/relativeTime.ts | frontend/lib/student/format/relativeTime.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/getInitials.ts | frontend/lib/shared/getInitials.ts | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/lib/hooks/useAsyncData.ts | frontend/lib/student/hooks/useAsyncData.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/nav/admin.ts | frontend/lib/admin/nav.ts | admin | reached via import graph from app/{admin}/** entry points |
| frontend/lib/nav/dean.ts | frontend/lib/dean/nav.ts | dean | reached via import graph from app/{dean}/** entry points |
| frontend/lib/nav/faculty.ts | frontend/lib/faculty/nav.ts | faculty | reached via import graph from app/{faculty}/** entry points |
| frontend/lib/nav/parent.ts | frontend/lib/shared/nav/parent.ts  (flagged — see "public/root" note) | public_or_root | reached via import graph from app/{public_or_root}/** entry points |
| frontend/lib/nav/student.ts | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/notifications/NotificationsProvider.tsx | frontend/lib/student/notifications/NotificationsProvider.tsx | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/prisma.ts | frontend/lib/shared/prisma.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/resume/extractSections.ts | frontend/lib/shared/resume/extractSections.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/resume/fetchResume.ts | frontend/lib/shared/resume/fetchResume.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/resume/normalizeResume.ts | frontend/lib/shared/resume/normalizeResume.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/resume/parsePdf.ts | frontend/lib/shared/resume/parsePdf.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/resume/parser.ts | frontend/lib/shared/resume/parser.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/server/appError.ts | frontend/lib/shared/server/appError.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/server/authService.ts | frontend/lib/shared/server/authService.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/server/cloudinary.ts | frontend/lib/shared/server/cloudinary.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/server/cookies.ts | frontend/lib/shared/server/cookies.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/server/directoryService.ts | frontend/lib/shared/server/directoryService.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/server/http.ts | frontend/lib/shared/server/http.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/server/jwt.ts | frontend/lib/shared/server/jwt.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/server/notificationService.ts | frontend/lib/shared/server/notificationService.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/server/publicStudent.ts | frontend/lib/shared/server/publicStudent.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/server/rankingsService.ts | frontend/lib/shared/server/rankingsService.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/server/teamService.ts | frontend/lib/shared/server/teamService.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/server/validate.ts | frontend/lib/shared/server/validate.ts  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/socket/SocketProvider.tsx | frontend/lib/student/socket/SocketProvider.tsx | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/spi/breakdown.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/config/dimensionMappings.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/config/targets.js | frontend/lib/shared/spi/config/targets.js  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/spi/config/weight.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/dimensions/creativity.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/dimensions/initiative.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/dimensions/interpersonal.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/dimensions/kinesthetic.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/dimensions/logicalReasoning.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/dimensions/technicalDepth.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/evaluators/activitiesEvaluator.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/evaluators/certificateEvaluators.js | frontend/lib/shared/spi/evaluators/certificateEvaluators.js  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/spi/evaluators/extracurricularEvaluator.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/evaluators/resumeEvaluators.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/orchestrator/calculateSPI.js | frontend/lib/shared/spi/orchestrator/calculateSPI.js  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/spi/orchestrator/persistSPI.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/sources/academics.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/sources/activities.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/sources/certifications.js | frontend/lib/shared/spi/sources/certifications.js  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/spi/sources/extracurriculars.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/sources/githubScore.js | frontend/lib/shared/spi/sources/githubScore.js  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/spi/sources/hackathons.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/sources/internships.js | frontend/lib/shared/spi/sources/internships.js  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/spi/sources/leetcodeScore.js | frontend/lib/shared/spi/sources/leetcodeScore.js  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/spi/sources/resume.js | frontend/lib/shared/spi/sources/resume.js  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/spi/testResume.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/testTemp.js | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/spi/utils/clamp.js | frontend/lib/shared/spi/utils/clamp.js  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/spi/utils/helpers.js | frontend/lib/shared/spi/utils/helpers.js  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/spi/utils/normalize.js | frontend/lib/shared/spi/utils/normalize.js  (flagged — see "api-only cluster" note) | api | reached only via app/api/** route handlers (server-only), not by any of the 4 portal app trees |
| frontend/lib/supabase.ts | frontend/lib/student/supabase.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/lib/upload/cloudinaryClient.ts | frontend/lib/shared/upload/cloudinaryClient.ts | public_or_root+student | reached via import graph from app/{public_or_root,student}/** entry points |
| frontend/lib/utils/academicCalendar.ts | (not moved in Stage 3 — see Stage 2) | DEAD-CODE CANDIDATE (Stage 2) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/lib/utils/cn.ts | frontend/lib/shared/utils/cn.ts | admin+dean+public_or_root+faculty+student | reached via import graph from app/{admin,dean,public_or_root,faculty,student}/** entry points |
| frontend/lib/utils/lucide.ts | frontend/lib/student/utils/lucide.ts | student | reached via import graph from app/{student}/** entry points |
| frontend/scripts/backfillAdmissionYear.ts | (not moved in Stage 3 — see Stage 2) | CLI SCRIPT (Stage 2 evidence check) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/scripts/checkScore.ts | (not moved in Stage 3 — see Stage 2) | CLI SCRIPT (Stage 2 evidence check) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/scripts/checkStudent.ts | (not moved in Stage 3 — see Stage 2) | CLI SCRIPT (Stage 2 evidence check) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/scripts/checkStudentSPI.ts | (not moved in Stage 3 — see Stage 2) | CLI SCRIPT (Stage 2 evidence check) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/scripts/getCerts.ts | (not moved in Stage 3 — see Stage 2) | CLI SCRIPT (Stage 2 evidence check) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/scripts/reparseResume.ts | (not moved in Stage 3 — see Stage 2) | CLI SCRIPT (Stage 2 evidence check) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/scripts/testCertEngine.ts | (not moved in Stage 3 — see Stage 2) | CLI SCRIPT (Stage 2 evidence check) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/scripts/testFullSPI.ts | (not moved in Stage 3 — see Stage 2) | CLI SCRIPT (Stage 2 evidence check) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/scripts/testInternshipsEngine.ts | (not moved in Stage 3 — see Stage 2) | CLI SCRIPT (Stage 2 evidence check) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/scripts/testResumePipeline.ts | (not moved in Stage 3 — see Stage 2) | CLI SCRIPT (Stage 2 evidence check) | no static importer found anywhere in frontend/ (see dead-code section) |
| frontend/scripts/verifyReparse.ts | (not moved in Stage 3 — see Stage 2) | CLI SCRIPT (Stage 2 evidence check) | no static importer found anywhere in frontend/ (see dead-code section) |

---

## UNKNOWN — cannot determine, not guessing

| file | why it's unknown |
|---|---|
| `frontend/lib/auth/DemoAuthProvider.tsx` | Added moments ago by the concurrent session (per your confirmation, legitimate finished work), zero importers anywhere in the repo yet. Could be scaffolding for imminent wiring, or an abandoned experiment. I'm not classifying or moving it, and not listing it as a Stage 2 deletion candidate either — it's too fresh to judge either way. Please tell me: keep as-is (untouched, unmoved) for now, or is it actually meant to replace `AuthProvider.tsx` somewhere? |

## Dead-code / CLI-script findings surfaced during this pass (Stage 2 will formally evidence-check these)

Not touching any of these in Stage 1 or 3 — listed here because they fell out of the same import
graph and it would be wasteful to re-derive this in Stage 2. Each still needs the full Stage 2
checklist (package.json scripts, CI/docs references, `git log -1 --format=%ai`) before deletion.

**Orphaned components (zero importers, precise import-path grep verified):**
`components/CollapsibleSidebar.tsx`, `components/PilotAnnouncementModal.tsx` (+ the
`lib/announcement.ts` it alone imports), `components/dean/DeanSidebar.tsx`,
`components/dean/DeanStatsRow.tsx`, `components/dean/StatCard.tsx` (distinct from the live,
shared `components/ui/StatCard.tsx` — verified these are two different files),
`components/dean/UpcomingDates.tsx`, `components/student/StudentSidebar.tsx`,
`components/student/StudentTopbar.tsx` — all superseded by `components/ui/AppShell.tsx` per
`progress.md` §5 (Finding 8).

**The dead SPI pipeline (Finding 7), zero importers:** `lib/spi/breakdown.js`,
`lib/spi/config/dimensionMappings.js`, `lib/spi/config/weight.js`,
`lib/spi/dimensions/{creativity,initiative,interpersonal,kinesthetic,logicalReasoning,
technicalDepth}.js`, `lib/spi/evaluators/{activitiesEvaluator,extracurricularEvaluator,
resumeEvaluators}.js`, `lib/spi/orchestrator/persistSPI.js`,
`lib/spi/sources/{academics,activities,extracurriculars,hackathons}.js`,
`lib/spi/testResume.js`, `lib/spi/testTemp.js` (last two look like ad-hoc scratch scripts, not
even part of the dead pipeline's own module graph — probably manual test runs).

**Other zero-importer files:** `lib/api/config.ts`, `lib/nav/student.ts` (confirmed:
`app/student/layout.tsx` defines its own inline `NAV_GROUPS`, never imports `STUDENT_NAV`),
`lib/utils/academicCalendar.ts`.

**CLI scripts (`frontend/scripts/*.ts`, 11 files) — never imported by design, need the Stage 2
checklist rather than the "zero importers" test:** `backfillAdmissionYear.ts`, `checkScore.ts`,
`checkStudent.ts`, `checkStudentSPI.ts`, `getCerts.ts`, `reparseResume.ts`, `testCertEngine.ts`,
`testFullSPI.ts`, `testInternshipsEngine.ts`, `testResumePipeline.ts`, `verifyReparse.ts`.

**On `frontend/progress.md` specifically** (a named Stage 2 candidate): I read it in full — it's
a structured, recently-updated (2026-08-05) project log that documents real architectural
decisions (the same-origin-vs-Express-backend split in Finding 4 came from here). This is not a
one-off scratch file. My recommendation when Stage 2 runs: **keep, likely moved into `docs/`**,
not deleted.

---

## `prisma/` in both packages (repeated from `BASELINE.md` per your instruction not to touch either)

- `backend/prisma/schema.prisma` — real schema backing the Express service's own `@prisma/client`.
- `frontend/prisma/schema.prisma` — a second, separate Prisma client generated for and used
  directly by `frontend/app/api/**` + `frontend/lib/shared/prisma.ts` (Finding 4: this is the
  one actually in the live request path by default).

Not merged, not deleted, not otherwise touched.

---

## What I'm asking you to approve

1. **The 5 decisions above** (route-group scope, `/parent`, backend restructuring given Finding
   4, empty role folders, attendance placement).
2. **The overall shape**: most of `frontend/app/**` doesn't move at all; `components/`, `lib/`,
   `scripts/` get sorted into role folders + `shared/` per the tables; `backend/src` gets
   `modules/student/**` + `modules/shared/attendance/**` + `shared/` infra, with
   `modules/{faculty,dean,admin}/` deferred (Decision 4).
3. **`DemoAuthProvider.tsx`** — what should happen to it.

Once approved, Stage 2 (dead-code deletion, evidence-checked per file) runs first, then Stage 3/4
moves files with `git mv` + a codemod for import fixing, never by hand.
