import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`ALTER TABLE "profile_section_embeddings" ALTER COLUMN "embedding" TYPE vector(2048);`);
  console.log('Altered column to vector(2048)');
}
main().catch(console.error);
