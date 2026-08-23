import { PrismaClient } from '@prisma/client';
import { EmbeddingService } from '../src/modules/student/services/embeddingService';

const prisma = new PrismaClient();

async function main() {
  const universityId = '202401100200243';
  
  // Delete the existing resume embedding
  await prisma.profileSectionEmbedding.deleteMany({
    where: { universityId, sectionType: 'resume' }
  });
  
  // Re-embed it
  await EmbeddingService.embedProfileSection('resume', universityId);
  
  // Verify it
  const newRow = await prisma.profileSectionEmbedding.findFirst({
    where: { universityId, sectionType: 'resume' }
  });
  
  console.log("New embedded content:");
  console.log(newRow?.content);
}

main().finally(() => prisma.$disconnect());
