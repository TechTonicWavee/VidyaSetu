# Baseline — pre-refactor build state

Captured: 2026-08-22, on branch `refactor/role-based-architecture`, immediately after
committing pre-existing uncommitted work as `4ae3ee1` ("Add attendance module and demo auth
provider") on `main`. No refactor changes have been made yet.

Toolchain: Node v24.13.0, npm 11.6.2. `node_modules` present in both packages; `.env` files
present in both (not committed).

## Frontend (`frontend/`)

### `npx tsc --noEmit`
**PASS** — zero errors.

### `npm run build` (`prisma generate && next build`)
**PASS** — builds successfully. Full route list below.

### `npm run lint` (`next lint`)
**FAIL — exit 1** — but only 2 are real errors, the rest (402) are warnings that do not fail
the build:

- **Errors (2, both pre-existing, unrelated to any refactor):**
  - `app/api/spi/recalculate/route.ts:114:9` — `'admissionYear' is never reassigned. Use 'const' instead.` (prefer-const)
  - `app/dean/meetings/page.tsx:29:7` — `'filtered' is never reassigned. Use 'const' instead.` (prefer-const)
- **Warnings (402):** overwhelmingly `@typescript-eslint/no-unused-vars` (unused lucide-react
  icon imports, unused destructured vars) and `@typescript-eslint/no-explicit-any`, plus one
  `react-hooks/exhaustive-deps` in `components/ui/AppSidebar.tsx`. Full list in
  `refactor/` scratch logs if needed — not reproduced here as none of it blocks the build.

**Baseline for Stage 6 comparison: exactly these 2 errors and this warning count/set. Any new
lint error introduced by the refactor is a regression; the 2 pre-existing errors and 402
warnings are not mine to fix (ground rules: behaviour-preserving only).**

### Route list (Next.js build output, `Route (app)` table, verbatim)

91 entries. `○` = static, `ƒ` = dynamic/server-rendered.

```
├ ○ /_not-found
├ ○ /admin
├ ○ /admin/configuration
├ ○ /admin/institution
├ ○ /admin/spi-config
├ ƒ /api/ai/context
├ ƒ /api/auth/form-login
├ ƒ /api/auth/login
├ ƒ /api/auth/logout
├ ƒ /api/auth/refresh
├ ƒ /api/auth/reset-password
├ ƒ /api/auth/set-password
├ ƒ /api/auth/verify-dob
├ ƒ /api/coding-profile/fetch
├ ƒ /api/directory
├ ƒ /api/directory/[universityId]
├ ƒ /api/directory/domains
├ ƒ /api/form/submit
├ ƒ /api/invites/[id]
├ ƒ /api/invites/[id]/accept
├ ƒ /api/invites/[id]/decline
├ ƒ /api/notifications
├ ƒ /api/notifications/[id]/read
├ ƒ /api/notifications/read-all
├ ƒ /api/notifications/unread-count
├ ƒ /api/spi/recalculate
├ ƒ /api/student/profile
├ ƒ /api/student/rankings
├ ƒ /api/student/resume-pdf
├ ƒ /api/student/update
├ ƒ /api/teams
├ ƒ /api/teams/[id]
├ ƒ /api/teams/[id]/invites
├ ƒ /api/teams/[id]/join-requests
├ ƒ /api/teams/[id]/members/[userId]
├ ƒ /api/teams/invites/received
├ ƒ /api/teams/invites/sent
├ ƒ /api/teams/my
├ ƒ /api/teams/open
├ ƒ /api/upload
├ ƒ /api/uploads/delete
├ ƒ /api/uploads/signature
├ ○ /dean
├ ○ /dean/agent
├ ○ /dean/cross-branch
├ ○ /dean/curriculum
├ ○ /dean/department
├ ○ /dean/faculty-performance
├ ○ /dean/forecasting
├ ○ /dean/meetings
├ ○ /dean/notifications
├ ○ /dean/policy-simulation
├ ○ /dean/reports
├ ○ /dean/schedule
├ ○ /dean/student-intelligence
├ ○ /demo
├ ○ /demo-script
├ ○ /faculty
├ ○ /faculty/alerts
├ ○ /faculty/analytics
├ ○ /faculty/attendance
├ ○ /faculty/co-attainment
├ ○ /faculty/my-classes
├ ○ /faculty/parent-communication
├ ○ /faculty/parent-visit
├ ○ /faculty/reports
├ ○ /faculty/student-intelligence
├ ○ /faculty/student/profile
├ ○ /form
├ ○ /form/login
├ ○ /integrations
├ ○ /login
├ ○ /parent
├ ○ /student
├ ○ /student/action-plan
├ ○ /student/ai-advisor
├ ○ /student/assignments
├ ○ /student/attendance
├ ○ /student/directory
├ ○ /student/extracurricular
├ ○ /student/my-team
├ ƒ /student/my-team/[teamId]
├ ○ /student/notifications
├ ○ /student/placement
├ ○ /student/potential-gap
├ ○ /student/profile
├ ○ /student/profile/edit
├ ○ /student/rankings
├ ○ /student/resume
├ ○ /student/skill-radar
└ ○ /student/spi
```

**Note for Stage 1/3:** the route list has pages that don't map to the four named portals
(student/faculty/dean/admin): `/parent`, `/login`, `/form`, `/form/login`, `/demo`,
`/demo-script`, `/integrations`, `/_not-found`. These need explicit homes in the migration plan
(e.g. a `(public)` or `(auth)` route group) — flagging now so Stage 1 doesn't silently drop them.

## Backend (`backend/`)

### `npx tsc --noEmit`
**FAIL — exit 2, pre-existing.** 9 errors, all inside the attendance module that was just
committed in `4ae3ee1` (uncommitted work that existed before this refactor task began):

```
src/routes/attendance.routes.ts(6,10): error TS2305: Module '"../middleware/auth"' has no exported member 'requireAuth'.
src/services/attendance.service.ts(24,35): error TS2538: Type 'undefined' cannot be used as an index type.
src/services/attendance.service.ts(36,22): error TS2532: Object is possibly 'undefined'.
src/services/attendance.service.ts(75,18): error TS18048: 'headerRow' is possibly 'undefined'.
src/services/attendance.service.ts(76,11): error TS18048: 'headerRow' is possibly 'undefined'.
src/services/attendance.service.ts(105,11): error TS2532: Object is possibly 'undefined'.
src/services/attendance.service.ts(118,31): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
src/services/attendance.service.ts(119,31): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
src/services/attendance.service.ts(151,27): error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
```

Root cause of the first error: `backend/src/middleware/auth.ts` does not export a member named
`requireAuth` — `attendance.routes.ts` imports something that doesn't exist. The other 8 are
`strict`/`strictNullChecks`-driven undefined-narrowing issues inside the new
`attendance.service.ts` (unguarded array/object indexing and `string | undefined` passed where
`string` is required).

### `npm run build` (`tsc -p tsconfig.json && prisma generate`)
**FAIL** — same 9 errors as above (`tsc` step fails before `prisma generate` runs).

### `npm run lint` (`eslint src --ext .ts`)
**PASS — exit 0**, but with 5 warnings (0 errors):
```
src/routes/attendance.routes.ts
  6:10  warning  'requireAuth' is defined but never used   @typescript-eslint/no-unused-vars
  74:19  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  148:19  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
src/services/attendance.service.test.ts
  5:38  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  63:15  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
```
(ESLint doesn't do the cross-module type resolution that `tsc` does, so it doesn't catch the
missing `requireAuth` export as an error — only flags it as an unused import.)

## `prisma/` in both packages — what each is for

- **`backend/prisma/schema.prisma`** — the actual application database schema (Postgres),
  source of truth for `@prisma/client` used throughout `backend/src`. This is the real schema
  Express/the API layer reads and writes against.
- **`frontend/prisma/schema.prisma`** — a **second, separate Prisma client** used directly by
  Next.js API routes (`frontend/app/api/**/route.ts`) and `frontend/lib/prisma.ts`, which talk
  to the same database directly from the frontend server side (not through the Express backend).
  `frontend/package.json`'s `build` script runs `prisma generate` before `next build` for this
  reason — the generated client is a build dependency of the Next app itself.

Per the task instructions, these are **not merged or deleted** — this is flagged only as
"report what each is for," which is done above. Whether the two schemas are in sync with each
other is out of scope for this refactor and not evaluated here.

---

## Stage 0 gate result: **FAILED — backend build/typecheck already broken pre-refactor**

Per the task instructions ("If the build is already failing before you touch anything, stop and
report it"), I'm stopping here rather than proceeding into Stage 1.

**This is not new breakage.** It comes from the attendance feature that was mid-flight,
uncommitted, in the working tree before this task started (now committed as `4ae3ee1` per your
instruction to commit it first). The frontend is fully green. The backend has 9 pre-existing
`tsc` errors, all confined to the new attendance module.
