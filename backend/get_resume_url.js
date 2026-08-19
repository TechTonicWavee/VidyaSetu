const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const student = await prisma.student.findFirst({
    where: { fullName: 'Krrish Singhal' },
    select: { resumeUrl: true }
  });
  console.log("Resume URL:", student.resumeUrl);
}

main().catch(console.error).finally(() => prisma.$disconnect());
