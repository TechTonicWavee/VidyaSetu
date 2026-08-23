import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const universityId = '202401100200243';
  
  const embeddings = await prisma.$queryRaw`
    SELECT "sectionType", "sourceId", "content", "updatedAt"
    FROM "profile_section_embeddings"
    WHERE "universityId" = ${universityId}
    ORDER BY "sectionType" ASC;
  `;

  console.log(`Found ${(embeddings as any[]).length} embedded sections for student ${universityId}:\n`);
  
  (embeddings as any[]).forEach((row, i) => {
    console.log(`[${i + 1}] Type: ${row.sectionType} | Source ID: ${row.sourceId}`);
    console.log(`Content:\n${row.content}\n`);
    console.log('---');
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
