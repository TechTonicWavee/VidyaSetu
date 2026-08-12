import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __vidyasetuPrisma: PrismaClient | undefined;
}

export const prisma = global.__vidyasetuPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__vidyasetuPrisma = prisma;
}
