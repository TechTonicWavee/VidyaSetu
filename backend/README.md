# VidyaSetu Backend

Node.js + Express + TypeScript service for Krrish's modules: JWT auth, My Team,
Domain Directory, and Notifications (REST + Socket.IO). Talks to the same
Supabase Postgres database as `frontend/`, via its own Prisma client.

See the root `SETUP.md` for how to configure and run this alongside the frontend.

## Scripts

- `npm run dev` — start with hot reload
- `npm run build` — compile to `dist/` and regenerate the Prisma client
- `npm start` — run the compiled build
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint
- `npm run seed` — idempotent seed script (Team/Directory/Notifications sample data)

## Layout

- `src/routes`, `src/controllers`, `src/services` — one set per module (`auth`, `team`, `invite`, `directory`, `notification`)
- `src/middleware` — `authMiddleware` (JWT verification), Zod `validate`, central `errorHandler`
- `src/sockets` — Socket.IO server, JWT handshake auth, per-user rooms (`user:{universityId}`)
- `prisma/schema.prisma` — mirror of `frontend/prisma/schema.prisma` (see the comment at the top of that file for the sync process)
