// One-off: fixes the scrambled roll-number assignment for the ~24-student
// lateral-entry batch (202501200200XXX / 2025D0021... roll numbers), discovered
// while reconciling studentsSeed.json. See conversation for full investigation:
// DB roll numbers for this batch were assigned in June in a different order than
// the authoritative roster, and 3 duplicate rows were created by the roster seed
// script for students whose correct roll uses the special 2025D... format.
//
// All rows touched here have zero dependent records and have never logged in
// (isFirstLogin: true, password: null) — confirmed before writing this script.
// Priyanshu Nigam / Vinayak Gupta are intentionally left alone: their correct
// slot is occupied by Raman Bhargav, who isn't in the roster at all.

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Stale duplicate rows: the correct data already exists under the new
// special-format id (created by the roster seed run), so these old
// placeholder rows are just deleted.
const STALE_DUPLICATE_IDS = ['202501200200006', '202501200200008', '202501200200012'];

// [from, to] pairs forming the permutation cycle. Applied as a two-phase
// rename (from -> temp -> to) so no intermediate step collides with a
// unique-constraint violation, regardless of cycle order.
const MOVES = [
  ['202501200200001', '202501200200005'], // Aastha Verma
  ['202501200200002', '202501200200018'], // Abhishek Tiwari
  ['202501200200003', '202501200200008'], // Aman Pathak
  ['202501200200004', '202501200200006'], // Ansh Pandey
  ['202501200200005', '202501200200007'], // Deepak Azad
  ['202501200200007', '202501200200003'], // Dev Singh
  ['202501200200009', '202501200200002'], // Diya
  ['202501200200010', '202501200200013'], // Gauri Tyagi
  ['202501200200011', '202501200200016'], // Granth Chauhan
  ['202501200200013', '202501200200017'], // Khushi Verma
  ['202501200200014', '202501200200011'], // Kishan Suchindra Pandey
  ['202501200200015', '202501200200010'], // Krishna Nand Yadav
  ['202501200200016', '202501200200009'], // Niraj Kumar Kushwaha
  ['202501200200017', '202501200200014'], // Pankaj Bhargav
  ['202501200200018', '202501200200020'], // Pankaj Chaudhary
  ['202501200200019', '202501200200004'], // Prachi
  ['202501200200020', '202501200200019'], // Prakhar Upadhyay
  ['202501200200025', '202501200200012'], // Vanshika Garg
];

async function main() {
  console.log('--- Deleting stale duplicate rows ---');
  for (const id of STALE_DUPLICATE_IDS) {
    const row = await prisma.student.findUnique({ where: { universityId: id } });
    if (!row) {
      console.log(`  ${id}: already gone, skipping`);
      continue;
    }
    const deps = await Promise.all([
      prisma.certification.count({ where: { universityId: id } }),
      prisma.project.count({ where: { universityId: id } }),
      prisma.codingProfile.count({ where: { universityId: id } }),
      prisma.teamMember.count({ where: { universityId: id } }),
      prisma.notification.count({ where: { universityId: id } }),
      prisma.hackathon.count({ where: { universityId: id } }),
      prisma.internship.count({ where: { universityId: id } }),
      prisma.extracurricular.count({ where: { universityId: id } }),
    ]);
    const depTotal = deps.reduce((a, b) => a + b, 0);
    if (depTotal > 0 || row.password) {
      console.error(`  ABORTING: ${id} (${row.fullName}) has ${depTotal} dependent rows or a password set — not safe to delete.`);
      process.exitCode = 1;
      return;
    }
    await prisma.student.delete({ where: { universityId: id } });
    console.log(`  Deleted ${id} (${row.fullName}) — duplicate of a correctly-seeded row.`);
  }

  console.log('\n--- Phase 1: renaming to temp ids ---');
  for (const [from] of MOVES) {
    const row = await prisma.student.findUnique({ where: { universityId: from } });
    if (!row) {
      console.error(`  ABORTING: expected row ${from} not found.`);
      process.exitCode = 1;
      return;
    }
    if (row.password) {
      console.error(`  ABORTING: ${from} (${row.fullName}) has a password set — not safe to rename.`);
      process.exitCode = 1;
      return;
    }
    await prisma.student.update({ where: { universityId: from }, data: { universityId: `__TMP__${from}` } });
  }
  console.log(`  Renamed ${MOVES.length} rows to temp ids.`);

  console.log('\n--- Phase 2: renaming temp ids to final ids ---');
  for (const [from, to] of MOVES) {
    await prisma.student.update({ where: { universityId: `__TMP__${from}` }, data: { universityId: to } });
    console.log(`  ${from} -> ${to}`);
  }

  console.log('\nRoll number correction complete.');
}

main()
  .catch((err) => {
    console.error('Fix failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
