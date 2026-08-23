import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const projects = await prisma.project.findMany({ where: { universityId: '202401100200243' } });
  console.log('Projects:', projects);
}
main().finally(() => prisma.$disconnect());
