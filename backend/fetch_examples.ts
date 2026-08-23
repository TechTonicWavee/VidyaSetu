import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- CODING PROFILE ---');
  let cp = await prisma.codingProfile.findFirst({ where: { githubStats: { not: Prisma.JsonNull } } });
  if (!cp) cp = await prisma.codingProfile.findFirst();
  if (cp) {
    console.log("githubStats:", JSON.stringify(cp.githubStats, null, 2));
    console.log("leetcodeStats:", JSON.stringify(cp.leetcodeStats, null, 2));
    console.log(`CURRENT EMBED: Coding Profile: Github Repos: ${cp.githubRepos || 0}, Leetcode Solved: ${cp.leetcodeSolved || 0}, Codechef Rating: ${cp.codechefRating || 0}`);
  }

  console.log('--- PROJECT ---');
  const p = await prisma.project.findFirst();
  if (p) {
    console.log(`CURRENT EMBED: ${p.title}. ${p.description || ''}. Tech: ${(p.techStack || []).join(', ')}`);
  }

  console.log('--- CERTIFICATION ---');
  const c = await prisma.certification.findFirst();
  if (c) {
    console.log(`CURRENT EMBED: ${c.name} from ${c.platform || ''}. Skills: ${(c.skills || []).join(', ')}`);
  }

  console.log('--- HACKATHON ---');
  const h = await prisma.hackathon.findFirst();
  if (h) {
    console.log(`CURRENT EMBED: Hackathon: ${h.name}. ${h.problemStatement || ''}. ${h.solution || ''}`);
  }

  console.log('--- EXTRACURRICULAR ---');
  const e = await prisma.extracurricular.findFirst();
  if (e) {
    console.log(`CURRENT EMBED: ${e.role} at ${e.society}. ${e.achievement || ''}`);
  }

  console.log('--- INTERNSHIP ---');
  const i = await prisma.internship.findFirst();
  if (i) {
    console.log(`CURRENT EMBED: ${i.role} at ${i.company}. ${i.description || ''}. Tech: ${(i.techStack || []).join(', ')}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
