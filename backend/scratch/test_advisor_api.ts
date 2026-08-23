import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jdText = `Software Engineer Intern — Full Stack

We're looking for a Software Engineer Intern to join our product team.

Requirements:
- Proficiency in React for building responsive, component-based UIs
- Experience with Node.js for backend API development
- Working knowledge of PostgreSQL for relational data modeling
- Familiarity with payment integration (Stripe or similar)
- Understanding of RESTful API design principles
- Strong problem-solving skills and ability to work in an agile team

Nice to have:
- Experience deploying applications to cloud platforms
- Exposure to CI/CD pipelines

This is a 6-month internship with potential for full-time conversion based
on performance.`;

async function main() {
  const secret = process.env.JWT_ACCESS_SECRET || 'supersecret';
  console.log("Using JWT_SECRET:", secret.substring(0, 3) + "...");
  
  const token = jwt.sign(
    { id: "mock-id-if-needed", universityId: "202401100200178", role: "STUDENT" },
    secret,
    { expiresIn: '1d' }
  );

  console.log("Token generated, hitting /api/advisor/resume...");
  
  try {
    const res = await fetch('http://localhost:4000/api/advisor/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ jdText })
    });

    const data = await res.json();
    console.log("\n--- RESPONSE ---");
    console.log("Status:", res.status);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

main().catch(console.error);
