import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

declare global {
  // eslint-disable-next-line no-var
  var __vidyasetuPrisma: PrismaClient | undefined
  // eslint-disable-next-line no-var
  var __vidyasetuPgPool: Pool | undefined
}

function makePrismaClient() {
  // Use pg driver to avoid Next.js + Prisma Rust Query Engine DNS issues
  const connectionString = process.env.DATABASE_URL
  
  // Re-use the pool across hot-reloads
  if (!globalThis.__vidyasetuPgPool) {
    globalThis.__vidyasetuPgPool = new Pool({ connectionString })
  }
  
  const adapter = new PrismaPg(globalThis.__vidyasetuPgPool)
  
  return new PrismaClient({
    adapter,
    log: [
      { emit: 'stdout', level: 'warn' },
      { emit: 'stdout', level: 'error' },
    ],
  })
}

export const prisma =
  globalThis.__vidyasetuPrisma ??
  (console.log('INIT NEW PRISMA CLIENT WITH PG ADAPTER'), makePrismaClient())

if (process.env.NODE_ENV !== 'production') {
  globalThis.__vidyasetuPrisma = prisma
}