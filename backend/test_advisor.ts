const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { EmbeddingService } = require('./src/services/embeddingService');

async function test() {
  // 1. Find a student
  const student = await prisma.student.findFirst();
  if (!student) {
    console.log("No student found");
    return;
  }
  console.log(`Found student: ${student.universityId}`);

  // 2. Find or create a project
  let project = await prisma.project.findFirst({ where: { universityId: student.universityId } });
  if (!project) {
    project = await prisma.project.create({
      data: {
        universityId: student.universityId,
        title: "Fullstack E-Commerce App",
        description: "Built a highly scalable e-commerce platform using React, Node.js, and PostgreSQL. Implemented payment gateway and user authentication.",
        techStack: ["React", "Node.js", "PostgreSQL", "Stripe"],
      }
    });
    console.log("Created test project");
  } else {
    console.log("Found existing project:", project.title);
  }

  // 3. Embed it
  console.log("Embedding project...");
  await EmbeddingService.embedProfileSection('project', project.id);
  console.log("Embedded successfully");

  // 4. Test retrieval directly or via HTTP
  const { RetrievalService } = require('./src/services/retrievalService');
  const chunks = await RetrievalService.retrieveRelevantChunks(student.universityId, "React Node.js frontend backend", 5);
  console.log("Retrieved chunks directly:", chunks);

  // 5. Test JD extraction
  const { JdExtractionService } = require('./src/services/jdExtractionService');
  console.log("Testing JD extraction...");
  const jdText = "We are looking for a Fullstack Developer with 2+ years of experience in React, Node.js, and PostgreSQL. Preferred skills include Stripe and AWS. Responsibilities include building scalable APIs and integrating payment gateways.";
  const extracted = await JdExtractionService.extractRequirements(jdText);
  console.log("Extracted JD:", JSON.stringify(extracted, null, 2));
  
  process.exit(0);
}

test().catch(console.error);
