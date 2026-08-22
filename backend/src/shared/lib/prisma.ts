import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Use the pg driver adapter instead of Prisma's default Rust query engine.
// Measured against this project's DB (a Supabase pooler): the default engine
// took ~1000ms per query, warm connection included — the pg adapter (with a
// real, reused connection pool) took ~160ms, a ~6x difference. This matches
// the documented reason the original frontend-only prisma.ts (before the
// single-schema consolidation) used this same pattern: "Next.js + Prisma Rust
// Query Engine DNS issues". That reasoning got lost when frontend switched to
// re-exporting this file — restoring it here fixes it for both packages at
// once, since they now share this client.
declare global {
  // eslint-disable-next-line no-var
  var __vidyasetuPrisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __vidyasetuPgPool: Pool | undefined;
}

function makePrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  // Re-use the pool across hot-reloads in dev instead of opening a new one
  // (and paying the cold-connection cost) on every module reload.
  if (!global.__vidyasetuPgPool) {
    global.__vidyasetuPgPool = new Pool({ connectionString });
  }

  const adapter = new PrismaPg(global.__vidyasetuPgPool);
  return new PrismaClient({ adapter });
}

export const prisma = global.__vidyasetuPrisma ?? makePrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__vidyasetuPrisma = prisma;
}
