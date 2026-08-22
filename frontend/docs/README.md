# Vidyasetu

A student/faculty/dean/admin portal monorepo. Next.js frontend, standalone Express backend,
one shared Postgres schema.

For the full picture of how the system actually works — the dual API paths, auth, real-time,
SPI computation, known gaps — read **`ARCHITECTURE.md`**. This file is the shorter, practical
"where do I put my code" guide.

## Running it

```bash
cd frontend && npm install && npm run dev    # http://localhost:3000
cd backend  && npm install && npm run dev    # http://localhost:4000 (optional — see ARCHITECTURE.md §2)
```

Frontend needs `frontend/.env` (see `.env.example`); backend needs `backend/.env` with a matching
`DATABASE_URL` and JWT secrets. Both quality gates:

```bash
cd frontend && npm run typecheck && npm run lint && npm run build
cd backend  && npm run typecheck && npm run lint && npm run build
```

## Where new code goes

Both `frontend/` and `backend/` are organized by the four portals — **student, faculty, dean,
admin** — with genuinely shared code pulled out into `shared/`. Before writing a new file, ask:
*which role(s) actually use this?*

- **Used by exactly one role** → that role's folder.
- **Used by two or more roles** → `shared/`. Never copy a file into two role folders — if you
  find yourself about to, it belongs in `shared/` instead.
- **A feature one role writes and another reads** (attendance is the existing example: faculty
  uploads it, students are meant to view it) → treat it as shared, filed under a
  feature-specific folder, not under either role.

### Frontend (`frontend/`)

```
app/
├── student/  faculty/  dean/  admin/    each already its own layout.tsx + auth guard
├── api/                                 route handlers — same-origin backend (see ARCHITECTURE.md §2)
└── (ungrouped: login, form, demo, integrations, parent — not part of the 4-role model)

components/
├── student/  dean/                      role-exclusive components (faculty/admin have none yet)
└── shared/                              design system (components/shared/ui/*) + cross-role UI

lib/
├── student/  faculty/  dean/  admin/    data layer, nav config, role-specific API clients
└── shared/                              auth, the shared api client, the Prisma re-export,
                                          server-only code used by app/api/** (resume parsing,
                                          the live SPI pipeline, cloudinary, etc.)
```

Adding a page for an existing role: drop it under `app/<role>/`, it picks up that role's
`layout.tsx` automatically. Adding a whole new top-level section: give it its own `app/<name>/`
folder with a `layout.tsx` if it needs role-specific chrome — don't nest it inside an existing
role's folder unless it genuinely belongs to that role.

Import with the `@/` alias (`@/lib/student/...`, `@/components/shared/ui`), never `../../..` —
if a relative import needs more than one `../`, it should be a `@/` import instead.

### Backend (`backend/`)

```
src/modules/
├── student/    routes/ controllers/ services/ validators/
├── faculty/    dean/    admin/       scaffolded, currently empty — see the README in each
└── shared/<feature>/    cross-role features (e.g. attendance)

src/shared/     config, middleware, utils, lib/prisma, sockets — used by every module
src/seed/       operational seeding scripts, not part of any module
```

New endpoint for an existing role: add to that role's `modules/<role>/`, following the existing
`routes → controllers → services → validators` layering (see any file in `modules/student/` for
the pattern). New role logic where the module is currently empty: same layout, it's ready.
Backend imports stay relative (not `@/`-aliased) — see `ARCHITECTURE.md` §4 for why.

## Prisma

There's one schema now: `backend/prisma/schema.prisma`. Frontend re-exports backend's client
(`frontend/lib/shared/prisma.ts`) rather than generating its own. If you change the schema, run
`cd backend && npx prisma generate`, then `cd frontend && npm run typecheck` (which runs
`frontend/scripts/sync-prisma-client.mjs` first) to keep frontend's type-checking in sync —
skipping this produces confusing type errors that look unrelated to whatever field you actually
changed.

## More context

- `ARCHITECTURE.md` — full system architecture, verified against the actual code
- `refactor/MIGRATION-PLAN.md` — the file-by-file reasoning behind this structure
- `refactor/FINDINGS.md` — known bugs/gaps, documented rather than fixed
- `refactor/BASELINE.md`, `refactor/DELETION-REPORT.md` — history of the cleanup that preceded
  the restructure
