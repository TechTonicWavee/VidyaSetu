import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  // Use raw query to get the embedding vector which is Unsupported("vector(2048)") in Prisma
  const sections = await prisma.$queryRaw`
    SELECT id, "universityId", "sectionType", "sourceId", "content", "updatedAt", embedding::text 
    FROM profile_section_embeddings 
    WHERE "universityId" = '202401100200243'
  `;

  const outputPath = path.join(__dirname, 'full_vectors.json');
  fs.writeFileSync(outputPath, JSON.stringify(sections, null, 2));
  console.log(`Saved full vectors to ${outputPath}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
