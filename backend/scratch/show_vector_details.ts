import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const universityId = '202401100200243';
  
  // We use raw query because Prisma Client extensions might abstract the vector
  const result = await prisma.$queryRaw`
    SELECT id, "universityId", "sectionType", content, embedding::text
    FROM "ProfileSectionEmbedding"
    WHERE "universityId" = ${universityId}
    LIMIT 1;
  `;

  console.log(JSON.stringify(result, null, 2));
}

main().finally(() => prisma.$disconnect());
