import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const universityId = '202401100200243';
  const student = await prisma.student.findUnique({
    where: { universityId },
    include: {
      codingProfile: true,
      certifications: true,
      extracurriculars: true,
      hackathons: true,
      internships: true,
      projects: true
    }
  });

  console.log(JSON.stringify(student, null, 2));
}

main().finally(() => prisma.$disconnect());
