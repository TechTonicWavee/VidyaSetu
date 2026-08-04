import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var __vidyasetuPrisma: PrismaClient | undefined
}

function makePrismaClient() {
  return new PrismaClient({
    log: [
      { emit: 'stdout', level: 'warn' },
      { emit: 'stdout', level: 'error' },
    ],
  })
}

export const prisma = globalThis.__vidyasetuPrisma ?? makePrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__vidyasetuPrisma = prisma
}