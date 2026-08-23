import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.resumeVersion.deleteMany();
  await prisma.resumeRequest.deleteMany();
  console.log("Cleared resume cache!");
}

main().finally(() => prisma.$disconnect());
