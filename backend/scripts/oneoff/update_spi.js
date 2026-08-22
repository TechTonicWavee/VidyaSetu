const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.student.update({
    where: { universityId: '202401100200178' },
    data: { spiScore: 68.5 }
  });
  console.log("Updated SPI to 68.5");
}

main().catch(console.error).finally(() => prisma.$disconnect());
