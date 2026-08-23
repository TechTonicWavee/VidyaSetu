// Self-contained Prisma client for the Next.js frontend.
// Previously this re-exported from ../../../backend/src/shared/lib/prisma, but
// cross-package imports of native pg bindings crash under Next.js RSC webpack
// bundling ("Cannot read properties of undefined (reading 'bind')").
// The sync-prisma-client.mjs script already copies the generated Prisma client
// into frontend/node_modules/.prisma/client, so we can instantiate it here
// using the frontend's own pg and @prisma/client without any cross-package path.
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  // eslint-disable-next-line no-var
  var __vidyasetuPrisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __vidyasetuPgPool: Pool | undefined;
}

function makePrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  // Re-use the pool across hot-reloads in dev to avoid cold-connection cost.
  if (!global.__vidyasetuPgPool) {
    global.__vidyasetuPgPool = new Pool({ connectionString, max: 20 });
  }

  const adapter = new PrismaPg(global.__vidyasetuPgPool);
  return new PrismaClient({ adapter });
}

export const prisma = global.__vidyasetuPrisma ?? makePrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__vidyasetuPrisma = prisma;
}