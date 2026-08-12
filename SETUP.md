# SETUP — Krrish's modules (Auth, My Team, Domain Directory, Notifications, Profile)

This covers running the new backend alongside the existing Next.js frontend,
seeding demo data, and the environment variables you need to set yourself.

## 1. Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

## 2. Environment variables

Copy each `.env.example` to `.env` and fill it in.

**`frontend/.env`** (copy from `frontend/.env.example`):
- `DATABASE_URL`, `DIRECT_URL` — same Supabase Postgres the backend uses
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — existing, unrelated to my modules
- `NEXT_PUBLIC_BACKEND_URL` — where `backend/` runs, e.g. `http://localhost:4000`
- `JWT_ACCESS_SECRET` — **must be byte-for-byte identical** to `backend/.env`'s `JWT_ACCESS_SECRET` (both sides verify the same access tokens)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your Cloudinary account dashboard (Settings → API Keys). Required for Profile file uploads (avatar, resume, project screenshots, certificates); nothing else depends on these.
- `GITHUB_TOKEN` — optional, raises GitHub API rate limits when refreshing a student's public GitHub stats

**`backend/.env`** (copy from `backend/.env.example`):
- `DATABASE_URL`, `DIRECT_URL` — same values as the frontend
- `FRONTEND_ORIGIN` — where the frontend runs, e.g. `http://localhost:3001` (used for CORS + cookie scoping)
- `JWT_ACCESS_SECRET` — same value as frontend's
- `JWT_REFRESH_SECRET` — a second, different secret (only the backend ever sees refresh tokens)
- Generate both secrets with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## 3. Database

The Prisma schema lives at `frontend/prisma/schema.prisma` — that's the single
source of truth and owns all migrations. `backend/prisma/schema.prisma` is a
mirror kept only so the backend package can generate its own Prisma client;
if you change the schema, edit it in `frontend/`, run migrations from there,
then re-copy the file into `backend/prisma/` and run `npm run prisma:generate`
in `backend/`.

```bash
cd frontend
npx prisma migrate deploy   # applies any pending migrations
npx prisma generate
```

## 4. Seed demo data

```bash
cd backend
npm run seed
```

Creates ~8 demo students (university IDs `DEMO2026CSE001`–`008`, password
`Demo@1234`), a demo team ("Team Innovate"), and a pending team invite — so
My Team / Domain Directory / Notifications have real data to look at without
needing real student accounts. Safe to re-run any time; it upserts rather
than duplicating.

## 5. Run everything

```bash
# terminal 1
cd backend && npm run dev      # http://localhost:4000

# terminal 2
cd frontend && npm run dev     # http://localhost:3001 (or whatever port you use)
```

Log in at `/login` → Student portal, using a seeded `DEMO2026CSE0xx` ID and
`Demo@1234`, or a real student account that has already submitted the
onboarding form.

## 6. Quality gates

```bash
cd backend && npm run typecheck && npm run lint
cd frontend && npm run typecheck && npm run lint
```

Both must be clean (zero TypeScript errors) before merging.
