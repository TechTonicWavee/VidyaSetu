import { generateResume } from './src/controllers/advisor.controller';
import { JdExtractionService } from './src/services/jdExtractionService';

// Mock extraction to prevent hallucinated extra skills for this specific test
JdExtractionService.extractRequirements = async () => ({
  role: "Backend Engineer",
  requiredSkills: ["React", "Node.js", "PostgreSQL"],
  preferredSkills: ["Stripe"],
  yearsExperience: null,
  responsibilities: []
});

async function test() {
  console.log("=== Testing generateResume (No Clarification Path) ===");
  
  // Mock req and res
  // Student profile chunk: 'Fullstack E-Commerce App. Built a highly scalable e-commerce platform using React, Node.js, and PostgreSQL. Implemented payment gateway and user authentication.. Tech: React, Node.js, PostgreSQL, Stripe'
  // I will use words that closely match.
  const req = {
    body: {
      jdText: "Fullstack E-Commerce App React Node.js PostgreSQL Stripe"
    },
    user: {
      universityId: '202401100300265'
    }
  } as any;
  
  let jsonResult: any = null;
  const res = {
    status: (code: number) => res,
    json: (data: any) => {
      jsonResult = data;
    }
  } as any;
  
  await generateResume(req, res);
  
  console.log("Controller response:");
  console.log(JSON.stringify(jsonResult, null, 2));
}

test().catch(console.error);
