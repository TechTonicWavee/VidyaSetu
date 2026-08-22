const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.student.update({
    where: { universityId: '202401100200178' },
    data: {
      resumeUrl: '/uploads/temp/resume/1786026644372-Krrish_Singhal_Web_Resume.pdf'
    }
  });
  console.log("Restored Krrish Singhal's resume URL");
}

main().catch(console.error).finally(() => prisma.$disconnect());
