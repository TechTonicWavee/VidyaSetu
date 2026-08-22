const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.student.updateMany({
    where: {
      resumeUrl: { startsWith: '/uploads/' }
    },
    data: {
      resumeUrl: null
    }
  });
  console.log(`Cleared ${result.count} stale local resume URLs.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
