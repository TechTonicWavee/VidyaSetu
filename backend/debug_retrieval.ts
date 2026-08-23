import { PrismaClient } from '@prisma/client';
import { nvidiaClient, embedModel } from './src/services/nvidiaClient';

const prisma = new PrismaClient();
const universityId = '202401100200178';

async function main() {
  console.log("=== 1. RAW EMBEDDING INVENTORY ===");
  const embeddings = await prisma.profileSectionEmbedding.findMany({
    where: { universityId }
  });
  console.log(`Total count: ${embeddings.length}`);
  
  const breakdown: Record<string, number> = {};
  for (const emb of embeddings) {
    breakdown[emb.sectionType] = (breakdown[emb.sectionType] || 0) + 1;
    console.log(`- Type: ${emb.sectionType}, SourceId: ${emb.sourceId}, UpdatedAt: ${emb.updatedAt.toISOString()}\n  Content: ${emb.content}`);
  }
  console.log("Breakdown:", breakdown);

  console.log("\n=== 2. BACKFILL STATUS CHECK ===");
  if (embeddings.length === 0) {
    console.log("No embeddings found. Backfill did not process this student or they have no data.");
  } else {
    console.log(`Most recent update: ${new Date(Math.max(...embeddings.map(e => e.updatedAt.getTime()))).toISOString()}`);
  }

  console.log("\n=== 3. SOURCE DATA CHECK ===");
  const projects = await prisma.project.findMany({ where: { universityId } });
  console.log("Projects:", JSON.stringify(projects, null, 2));

  const certs = await prisma.certification.findMany({ where: { universityId } });
  console.log("Certifications:", JSON.stringify(certs, null, 2));

  const internships = await prisma.internship.findMany({ where: { universityId } });
  console.log("Internships:", JSON.stringify(internships, null, 2));

  const codingProfile = await prisma.codingProfile.findUnique({ where: { universityId } });
  console.log("CodingProfile:", JSON.stringify(codingProfile, null, 2));

  const student = await prisma.student.findUnique({ where: { universityId } });
  if (student) {
      console.log("Resume Parsed:", JSON.stringify(student.resumeParsed, null, 2));
  }

  console.log("\n=== 4. MANUAL RETRIEVAL QUERY ===");
  const requirements = "React, Node.js, PostgreSQL";
  console.log(`Querying for requirements: "${requirements}"`);

  // We need to run the raw query to get scores
  const response = await nvidiaClient.embeddings.create({
      input: [requirements],
      model: embedModel(),
      encoding_format: "float",
  });
  const queryEmbedding = response.data[0].embedding;
  const embeddingString = `[${queryEmbedding.join(',')}]`;

  // Get ALL chunks and their scores, ignoring threshold
  const matches = await prisma.$queryRaw<any[]>`
      SELECT "id", "sectionType", "content", 1 - ("embedding" <=> ${embeddingString}::vector) AS similarity
      FROM "profile_section_embeddings"
      WHERE "universityId" = ${universityId}
      ORDER BY similarity DESC
  `;

  console.log(`Total chunks scored: ${matches.length}`);
  for (const match of matches) {
      console.log(`- Type: ${match.sectionType} | Score: ${match.similarity}\n  Content: ${match.content}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
