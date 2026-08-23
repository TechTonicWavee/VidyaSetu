import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sections = await prisma.profileSectionEmbedding.findMany({
    where: { universityId: '202401100200243' },
    select: {
      sectionType: true,
      sourceId: true,
      content: true,
      updatedAt: true,
    }
  });

  console.log(JSON.stringify(sections, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
