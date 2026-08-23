import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const internships = await prisma.internship.findMany({ where: { universityId: '202401100200178' } });
  console.log("INTERNSHIPS (DB):");
  console.log(JSON.stringify(internships, null, 2));

  const resumeVersions = await prisma.resumeVersion.findMany({
    where: { resumeRequest: { universityId: '202401100200178' } },
    orderBy: { createdAt: 'desc' },
    take: 1
  });
  if (resumeVersions.length > 0) {
    console.log("\nAI GENERATED EXPERIENCE SECTION (from latest JD run):");
    console.log(JSON.stringify((resumeVersions[0].resumeJson as any).experience, null, 2));
  }
}
main().finally(() => prisma.$disconnect());
