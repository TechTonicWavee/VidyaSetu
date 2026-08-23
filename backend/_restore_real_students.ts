import 'dotenv/config';
import { prisma } from '../frontend/lib/shared/prisma';
import backup from '/tmp/claude-1000/-home-krrish-Desktop-TechTonicWavee/9276a154-e992-499b-9163-5eec9624db1d/scratchpad/nonroster-final-backup.json';

const RESTORE_IDS = ['202401100300265', '202401100600161', '202401100300015']; // Tushar, Shivanshu, Aditya
// Deliberately excluded: 202401100300071 "Krrish kutta" — confirmed junk test data.

async function run() {
  const students = backup.students.filter((s: any) => RESTORE_IDS.includes(s.universityId));
  console.log('restoring', students.length, 'students:', students.map((s: any) => s.fullName));

  for (const s of students) {
    const { id, ...data } = s as any;
    await prisma.student.create({ data });
  }

  for (const key of ['internships', 'extracurriculars', 'codingProfiles'] as const) {
    const rows = (backup as any)[key].filter((r: any) => RESTORE_IDS.includes(r.universityId));
    for (const row of rows) {
      const { id, ...data } = row;
      const model = key === 'internships' ? prisma.internship : key === 'extracurriculars' ? prisma.extracurricular : prisma.codingProfile;
      await (model as any).create({ data });
    }
    console.log('restored', rows.length, key);
  }

  process.exit(0);
}
run().catch((e) => { console.error('ERROR:', e.message, e.stack); process.exit(1); });
