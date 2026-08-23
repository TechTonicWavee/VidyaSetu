import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const universityId = '202401100200243';
  const student = await prisma.student.findUnique({
    where: { universityId },
    select: { resumeParsed: true }
  });
  
  const rp = student?.resumeParsed as any;
  const sections = [];
  if (rp.projects && rp.projects.length > 0) {
    const projs = rp.projects.map((p: any) => typeof p === 'string' ? p : `${p.title}: ${(p.bullets || []).join(' ')}`);
    sections.push(`Projects: ${projs.join(' | ')}`);
  }
  
  console.log(sections[0]);
}

main().finally(() => prisma.$disconnect());
