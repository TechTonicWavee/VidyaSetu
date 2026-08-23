import { prisma } from '../src/lib/prisma';
import { EmbeddingService } from '../src/services/embeddingService';
import { SummaryService } from '../src/services/summaryService';
import fs from 'fs';
import path from 'path';

const STATE_FILE = path.join(__dirname, 'backfill_state.json');

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function withRetry<T>(fn: () => Promise<T>, retries = 3, backoff = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      if (err.name === 'AbortError' || (err.status && err.status === 429) || err.message?.includes('AbortError')) {
        if (i === retries - 1) throw err;
        console.warn(`    Rate limit/timeout hit. Retrying in ${backoff}ms...`);
        await delay(backoff);
        backoff *= 2;
      } else {
        throw err;
      }
    }
  }
  throw new Error('Unreachable');
}

async function backfill() {
  console.log("=== Starting Resilient Backfill for Embeddings & Summaries ===");

  let processedIds: string[] = [];
  if (fs.existsSync(STATE_FILE)) {
    try {
      processedIds = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      console.log(`Found ${processedIds.length} already processed students.`);
    } catch (e) {
      console.warn("Could not read state file, starting fresh.");
    }
  }

  const students = await prisma.student.findMany({
    select: { universityId: true }
  });

  for (const student of students) {
    const { universityId } = student;

    if (processedIds.includes(universityId)) {
      continue; // Skip already done
    }

    console.log(`\nProcessing student: ${universityId}`);

    // Clear old embeddings
    await prisma.profileSectionEmbedding.deleteMany({
      where: { universityId }
    });

    const [
      projects,
      certifications,
      hackathons,
      extracurriculars,
      internships,
      codingProfile
    ] = await Promise.all([
      prisma.project.findMany({ where: { universityId } }),
      prisma.certification.findMany({ where: { universityId } }),
      prisma.hackathon.findMany({ where: { universityId } }),
      prisma.extracurricular.findMany({ where: { universityId } }),
      prisma.internship.findMany({ where: { universityId } }),
      prisma.codingProfile.findUnique({ where: { universityId } })
    ]);

    try {
      // Embed all
      for (const p of projects) {
        console.log(` Embedding Project: ${p.id}`);
        await withRetry(() => EmbeddingService.embedProfileSection('project', p.id));
        await delay(300);
      }
      for (const c of certifications) {
        console.log(` Embedding Certification: ${c.id}`);
        await withRetry(() => EmbeddingService.embedProfileSection('certification', c.id));
        await delay(300);
      }
      for (const h of hackathons) {
        console.log(` Embedding Hackathon: ${h.id}`);
        await withRetry(() => EmbeddingService.embedProfileSection('hackathon', h.id));
        await delay(300);
      }
      for (const e of extracurriculars) {
        console.log(` Embedding Extracurricular: ${e.id}`);
        await withRetry(() => EmbeddingService.embedProfileSection('extracurricular', e.id));
        await delay(300);
      }
      for (const i of internships) {
        console.log(` Embedding Internship: ${i.id}`);
        await withRetry(() => EmbeddingService.embedProfileSection('internship', i.id));
        await delay(300);
      }
      if (codingProfile) {
        console.log(` Embedding CodingProfile: ${codingProfile.id}`);
        await withRetry(() => EmbeddingService.embedProfileSection('codingProfile', codingProfile.id));
        await delay(300);
      }

      console.log(` Embedding Resume: ${universityId}`);
      await withRetry(() => EmbeddingService.embedProfileSection('resume', universityId));
      await delay(300);

      // Generate summary
      console.log(` Generating Summary for ${universityId}...`);
      await withRetry(() => SummaryService.generateSummary(universityId));
      await delay(300);

      // Successfully processed, save state
      processedIds.push(universityId);
      fs.writeFileSync(STATE_FILE, JSON.stringify(processedIds, null, 2));

    } catch (err: any) {
      console.error(`\nFAILED processing student ${universityId}:`, err.message);
      console.log("Will resume from this student next run.");
      process.exit(1);
    }
  }

  console.log("\n=== Backfill Complete ===");
}

backfill()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
