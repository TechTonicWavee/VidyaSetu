import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const universityId = '202401100200221';
const plainPassword = '12345678';

async function main() {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const updated = await prisma.student.update({
    where: { universityId },
    data: { password: hashedPassword },
    select: { universityId: true, fullName: true },
  });

  console.log(`✅ Password updated successfully for: ${updated.fullName} (${updated.universityId})`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
