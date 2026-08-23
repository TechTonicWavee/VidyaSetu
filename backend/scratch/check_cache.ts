import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const versions = await prisma.resumeVersion.findMany({
    where: { resumeRequest: { universityId: '202401100200243' } },
    orderBy: { createdAt: 'desc' },
    include: { resumeRequest: true },
    take: 5
  });

  console.log(JSON.stringify(versions, null, 2));
}

main().finally(() => prisma.$disconnect());
