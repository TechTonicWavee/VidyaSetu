import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const universityId = '202401100200178';

async function main() {
  const student = await prisma.student.findUnique({
    where: { universityId },
    include: {
      codingProfile: true,
      certifications: true,
      internships: true,
    },
  });

  if (!student) {
    console.log("Student not found.");
    return;
  }

  const rawData = {
    // 1. Core Academics
    year: student.year,
    admissionYear: (student as any).admissionYear,
    cgpa: student.cgpa,
    semester: student.semester,

    // 2. Resume Data
    resumeParsed: student.resumeParsed,

    // 3. Coding Profile
    githubStats: student.codingProfile?.githubStats,
    leetcodeStats: student.codingProfile?.leetcodeStats,

    // 4. Certifications
    certifications: student.certifications,

    // 5. Internships
    internships: student.internships,
  };

  console.log(JSON.stringify(rawData, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
