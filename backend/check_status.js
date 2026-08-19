const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const counts = await prisma.student.groupBy({
    by: ['formStatus'],
    _count: true
  });
  console.log("Counts by formStatus:", counts);
}

main().catch(console.error).finally(() => prisma.$disconnect());
