// One-off backfill: assign a domain to every student that has none, so the
// Domain Directory filter is populated. Distribution is deterministic (stable
// by universityId) across the master domain list. Only touches null/empty
// domains — never overwrites a domain a student already chose.
//
// Run from the frontend/ directory:  node --env-file=.env scripts/backfillDomains.mjs
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const DOMAINS = [
  'Web Development',
  'Mobile Development',
  'Artificial Intelligence / ML',
  'Generative AI',
  'Data Science',
  'Blockchain',
  'Cloud & DevOps',
  'Cybersecurity',
  'Internet of Things (IoT)',
  'Game Development',
  'AR / VR',
  'UI / UX Design',
  'Competitive Programming (DSA)',
  'Embedded Systems',
  'Robotics',
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const students = await prisma.student.findMany({
  where: { OR: [{ domain: null }, { domain: '' }] },
  select: { universityId: true },
});

console.log(`Students missing a domain: ${students.length}`);

// Group assignments by domain, then updateMany per domain (fewer round-trips).
const byDomain = new Map();
for (const s of students) {
  const domain = DOMAINS[hash(s.universityId) % DOMAINS.length];
  if (!byDomain.has(domain)) byDomain.set(domain, []);
  byDomain.get(domain).push(s.universityId);
}

let updated = 0;
for (const [domain, ids] of byDomain) {
  const res = await prisma.student.updateMany({
    where: { universityId: { in: ids } },
    data: { domain },
  });
  updated += res.count;
  console.log(`  ${domain}: ${res.count}`);
}

console.log(`Backfilled ${updated} students.`);
await prisma.$disconnect();
await pool.end();
