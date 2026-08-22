# Findings — bugs and smells noticed, deliberately not fixed

Per the refactor's ground rules: behaviour-preserving only, no bug fixes "while I was in there."
Everything below was found during the Stage 0–2 evidence-gathering and cleanup pass and written
down instead of touched. See `ARCHITECTURE.md` for the full system picture these fit into.

## Attendance feature

1. **No auth on the write endpoints.** `backend/src/routes/attendance.routes.ts`'s
   `POST /preview` and `POST /confirm` have no auth middleware at all — anyone who can reach the
   Express service can upload a file that overwrites `student.attendance` /
   `classesAttended` / `classesTotal` for arbitrary students. The route file even has a comment
   admitting this: `// We'll just assume there is a requireAuth middleware` (removed during the
   Stage 0 typecheck fix, since it imported a non-existent export and was never wired in either
   way — the lack of auth predates and is unrelated to that fix).
2. **Likely unreachable end-to-end by default.** There is no `frontend/app/api/attendance`
   route, so the faculty upload page's `apiFetch('/api/attendance/preview')` call can only reach
   the standalone Express backend, and only if `NEXT_PUBLIC_API_BASE_URL` is set —
   it isn't, in this repo's `.env` or `.env.example`. See `ARCHITECTURE.md` §2.
3. **Its real-time push goes nowhere.** `attendance.routes.ts`'s `/confirm` handler calls
   `getIO().to(studentId).emit('attendance:updated', ...)` via the backend's Socket.IO server.
   The frontend abandoned Socket.IO for Supabase Realtime (see `frontend/lib/socket/
   SocketProvider.tsx`'s own comment: *"There's no standalone backend/Socket.IO server
   anymore..."*). Nothing subscribes to this backend's socket server.
4. **Read and write sides aren't connected even conceptually.** The student attendance page
   (`app/student/attendance/page.tsx`) reads from `lib/data/mock/attendance.ts` (static mock
   fixtures), not from anything the faculty upload writes. Both halves of the feature work in
   isolation from each other today.

## Routing / middleware

5. **Comment vs. implementation mismatch in `middleware.ts`.** The comment reads "Always block
   restricted role portals (admin / faculty / dean / parent)" but
   `frontend/lib/access.ts`'s `RESTRICTED_ROUTES` array only contains `/admin` and `/parent`.
   `/faculty` and `/dean` are not blocked despite the comment's claim.

## Pre-existing lint errors (present before this refactor touched anything)

6. `frontend/app/api/spi/recalculate/route.ts:114` — `'admissionYear' is never reassigned. Use
   'const' instead.` (`prefer-const`)
7. `frontend/app/dean/meetings/page.tsx:29` — `'filtered' is never reassigned. Use 'const'
   instead.` (`prefer-const`)

Both recorded in `refactor/BASELINE.md` as part of the pre-refactor baseline; neither is new.

## Open question, not a bug

8. **`frontend/lib/auth/DemoAuthProvider.tsx`** was added by a concurrent session during this
   task and has zero importers anywhere. Not classified as dead code (too recent to judge intent)
   and not fixed/wired up either — flagged in `refactor/MIGRATION-PLAN.md` as an open question
   for you to answer, not a bug for me to resolve.
