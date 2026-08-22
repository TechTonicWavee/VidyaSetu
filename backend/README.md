# VidyaSetu Backend

Node.js + Express + TypeScript service, organized by role module: JWT auth, My Team,
Domain Directory, and Notifications (REST + Socket.IO) — all student-domain today.
`prisma/schema.prisma` here is the **only** Prisma schema in the repo; `frontend/` shares this
same client (see the root `README.md`).

See the root `README.md` for how this fits together with `frontend/` and where new code goes.

## Scripts

- `npm run dev` — start with hot reload
- `npm run build` — compile to `dist/` and regenerate the Prisma client
- `npm start` — run the compiled build
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint
- `npm run seed` — idempotent seed script (Team/Directory/Notifications sample data)

## Layout

- `src/modules/student/{routes,controllers,services,validators}` — auth, team, invite,
  directory, notification (all gated by `authMiddleware`, whose role type is literally
  `'student'` — see root `ARCHITECTURE.md` §4)
- `src/modules/shared/attendance/` — cross-role (faculty writes, student meant to read);
  no auth middleware yet, see `refactor/FINDINGS.md`
- `src/modules/faculty/`, `dean/`, `admin/` — scaffolded, empty; no backend logic exists for
  these roles yet
- `src/shared/` — `config/env`, `middleware` (`authMiddleware`, Zod `validate`, central
  `errorHandler`), `utils` (`appError`, `jwt`, `response`, `asyncHandler`), `lib/prisma`,
  `sockets` (Socket.IO server, JWT handshake auth, per-user rooms `user:{universityId}`)
- `src/seed/` — `seed.ts`/`bulkStudents.ts`/`seed_cgpa.js`, run manually, not part of any module
- `scripts/oneoff/` — one-off data-repair scripts, not part of the app; see the README there
