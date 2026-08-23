import { PrismaClient } from '@prisma/client';
import { EmbeddingService } from '../src/modules/student/services/embeddingService';
import { SummaryService } from '../src/modules/student/services/summaryService';

const prisma = new PrismaClient();

async function main() {
  const universityId = '202401100200243';
  console.log("Restoring vectors for", universityId);

  // Clear existing (if any)
  await prisma.profileSectionEmbedding.deleteMany({
    where: { universityId }
  });

  const [projects, certifications, hackathons, extracurriculars, internships, codingProfile] = await Promise.all([
    prisma.project.findMany({ where: { universityId } }),
    prisma.certification.findMany({ where: { universityId } }),
    prisma.hackathon.findMany({ where: { universityId } }),
    prisma.extracurricular.findMany({ where: { universityId } }),
    prisma.internship.findMany({ where: { universityId } }),
    prisma.codingProfile.findUnique({ where: { universityId } })
  ]);

  for (const p of projects) await EmbeddingService.embedProfileSection('project', p.id);
  for (const c of certifications) await EmbeddingService.embedProfileSection('certification', c.id);
  for (const h of hackathons) await EmbeddingService.embedProfileSection('hackathon', h.id);
  for (const e of extracurriculars) await EmbeddingService.embedProfileSection('extracurricular', e.id);
  for (const i of internships) await EmbeddingService.embedProfileSection('internship', i.id);
  if (codingProfile) await EmbeddingService.embedProfileSection('codingProfile', codingProfile.id);

  console.log("Embedding Resume...");
  await EmbeddingService.embedProfileSection('resume', universityId);

  console.log("Generating Summary...");
  await SummaryService.generateSummary(universityId);

  console.log("Done!");
}

main().finally(() => prisma.$disconnect());
