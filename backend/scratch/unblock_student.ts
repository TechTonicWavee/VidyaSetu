import { prisma } from '../src/lib/prisma';
import { EmbeddingService } from '../src/services/embeddingService';
import { SummaryService } from '../src/services/summaryService';

const universityId = '202401100200178';

async function main() {
  console.log(`Manual unblock for ${universityId}...`);

  await prisma.profileSectionEmbedding.deleteMany({
    where: { universityId }
  });

  const [
    projects,
    certifications,
    hackathons,
    extracurriculars,
    internships,
    codingProfile
  ] = await Promise.all([
    prisma.project.findMany({ where: { universityId } }),
    prisma.certification.findMany({ where: { universityId } }),
    prisma.hackathon.findMany({ where: { universityId } }),
    prisma.extracurricular.findMany({ where: { universityId } }),
    prisma.internship.findMany({ where: { universityId } }),
    prisma.codingProfile.findUnique({ where: { universityId } })
  ]);

  for (const p of projects) {
    console.log(` Embedding Project: ${p.id}`);
    await EmbeddingService.embedProfileSection('project', p.id);
  }
  for (const c of certifications) {
    console.log(` Embedding Certification: ${c.id}`);
    await EmbeddingService.embedProfileSection('certification', c.id);
  }
  for (const h of hackathons) {
    console.log(` Embedding Hackathon: ${h.id}`);
    await EmbeddingService.embedProfileSection('hackathon', h.id);
  }
  for (const e of extracurriculars) {
    console.log(` Embedding Extracurricular: ${e.id}`);
    await EmbeddingService.embedProfileSection('extracurricular', e.id);
  }
  for (const i of internships) {
    console.log(` Embedding Internship: ${i.id}`);
    await EmbeddingService.embedProfileSection('internship', i.id);
  }
  if (codingProfile) {
    console.log(` Embedding CodingProfile: ${codingProfile.id}`);
    await EmbeddingService.embedProfileSection('codingProfile', codingProfile.id);
  }
  
  console.log(` Embedding Resume: ${universityId}`);
  await EmbeddingService.embedProfileSection('resume', universityId);

  console.log(` Generating Summary for ${universityId}...`);
  await SummaryService.generateSummary(universityId);

  console.log('Unblock complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
