# Findings — bugs and smells noticed, deliberately not fixed

Per the refactor's ground rules: behaviour-preserving only, no bug fixes "while I was in there,"
with one explicit exception — issues that blocked the restructure itself from reaching zero
build/type errors were fixed (see `ARCHITECTURE.md` §1 and §8 for what those were and why).
Everything below is a *smell*, not a build break: it was found during evidence-gathering and
written down instead of touched. See `ARCHITECTURE.md` for the full system picture these fit
into.

## Attendance feature

1. **No auth on the write endpoints, on either implementation.**
   `backend/src/modules/shared/attendance/routes/attendance.routes.ts` and
   `frontend/app/api/attendance/{preview,confirm}/route.ts` both have no auth check at all —
   anyone who can reach either one can upload a file that overwrites `student.attendance` /
   `classesAttended` / `classesTotal` for arbitrary students.
2. **Two independent, duplicate implementations of the same parsing logic.** Since this
   session's restructure work began, a same-origin `frontend/app/api/attendance/**` route
   appeared (calling `frontend/lib/shared/server/attendanceService.ts`), separate from
   `backend/src/modules/shared/attendance/services/attendance.service.ts`. They parse the same
   Excel format independently — a bug fixed in one (or a format change handled in one) won't
   apply to the other unless someone remembers to fix both. Candidate for consolidating into one
   shared implementation later, but that's a functional change, not a file move, so left alone
   here.
3. **The Express copy's real-time push goes nowhere.** Its `/confirm` handler calls
   `getIO().to(studentId).emit('attendance:updated', ...)` via the backend's Socket.IO server.
   The frontend abandoned Socket.IO for Supabase Realtime (see `frontend/lib/student/socket/
   SocketProvider.tsx`'s own comment: *"There's no standalone backend/Socket.IO server
   anymore..."*). Nothing subscribes to this backend's socket server.
4. **Read and write sides aren't connected even conceptually.** The student attendance page
   (`app/student/attendance/page.tsx`) reads from `lib/student/data/mock/attendance.ts` (static
   mock fixtures), not from anything either upload endpoint writes.

## Routing / middleware

5. **Comment vs. implementation mismatch in `middleware.ts`.** The comment reads "Always block
   restricted role portals (admin / faculty / dean / parent)" but
   `frontend/lib/student/access.ts`'s `RESTRICTED_ROUTES` array only contains `/admin` and
   `/parent`. `/faculty` and `/dean` are not blocked despite the comment's claim.

## Pre-existing lint errors (present before this refactor touched anything)

6. `frontend/app/api/spi/recalculate/route.ts` — `'admissionYear' is never reassigned. Use
   'const' instead.` (`prefer-const`)
7. `frontend/app/dean/meetings/page.tsx` — `'filtered' is never reassigned. Use 'const'
   instead.` (`prefer-const`)

Both recorded in `refactor/BASELINE.md` as part of the pre-refactor baseline; neither is new.

## Resolved during the restructure (not "leave alone" — these blocked zero-errors)

8. **`frontend/lib/auth/DemoAuthProvider.tsx`** — flagged in Stage 1 as an open question (added
   by a concurrent session, zero importers). Still zero importers days later across further
   sessions of work; deleted in Stage 3 as genuinely unused.
9. **Stale frontend Prisma client.** Frontend has had no `prisma/schema.prisma` of its own since
   an earlier "Database migrated" commit consolidated onto backend's single schema (see
   `ARCHITECTURE.md` §1) — but frontend's `package.json` build script was never updated to
   regenerate its own `node_modules/@prisma/client` from that schema, so it silently went stale
   the moment the schema changed again (missing `Student.spiHistory`, added after the
   consolidation). This surfaced as ~30 unrelated-looking type errors during the restructure.
   Fixed with `frontend/scripts/sync-prisma-client.mjs`, wired into `dev`/`build`/`typecheck`.
10. **Prisma using the default engine instead of the `pg` adapter — the actual cause of the
    "stuck" loading spinners reported after the restructure.** Diagnosed by measuring raw query
    latency directly against the live DB (a Supabase pooler): ~1000ms per query with a bare
    `new PrismaClient()`, even warm; ~150-235ms with `@prisma/adapter-pg` over a real connection
    pool — about 6x. The original frontend-only `prisma.ts` (before the schema consolidation)
    used the adapter specifically to avoid this ("Next.js + Prisma Rust Query Engine DNS
    issues" per its own comment); that got dropped when frontend switched to re-exporting
    backend's plain client. Fixed in `backend/src/shared/lib/prisma.ts` (shared by both
    packages now), plus parallelizing/de-blocking a couple of sequential queries in the auth
    refresh flow specifically. See `ARCHITECTURE.md` §1.
