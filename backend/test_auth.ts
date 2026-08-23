import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { prisma } from './src/lib/prisma';

import { createApp } from './src/app';
const app = createApp();
const PORT = 5555;
const server = app.listen(PORT);

const SECRET = process.env.JWT_ACCESS_SECRET || 'test_secret';

// Helper to mint a token
function mintToken(universityId: string) {
  return jwt.sign({ universityId, role: 'student' }, SECRET, { expiresIn: '1h' });
}

async function runTests() {
  console.log("=== Starting Auth & Rate Limiting Tests ===");

  const studentA = '202401100300265';
  const tokenA = mintToken(studentA);

  const studentB = 'studentB_999999';
  await prisma.student.upsert({
    where: { universityId: studentB },
    create: { universityId: studentB, fullName: 'Test Student B', email: 'testb@test.com' },
    update: {}
  });
  const tokenB = mintToken(studentB);

  const BASE_URL = `http://127.0.0.1:${PORT}/api/advisor`;

  // --- Test A: No Authorization header ---
  console.log("\n[Test A] No Authorization header on POST /resume");
  const resA = await fetch(`${BASE_URL}/resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jdText: 'Dummy JD' })
  });
  console.log(`Status: ${resA.status} (Expected: 401)`);
  console.log(`Response:`, await resA.json());

  // --- Test B: Wrong owner on clarify ---
  console.log("\n[Test B] Valid token for student A, but requestId belongs to student B");
  // Create a dummy request for Student B
  const reqB = await prisma.resumeRequest.create({
    data: {
      universityId: studentB,
      jdText: 'JD B',
      jdHash: 'hashB',
      status: 'pending_clarification'
    }
  });

  const resB = await fetch(`${BASE_URL}/resume/${reqB.id}/clarify`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({ answers: [] })
  });
  console.log(`Status: ${resB.status} (Expected: 403)`);
  console.log(`Response:`, await resB.json());

  // Cleanup reqB
  await prisma.resumeRequest.delete({ where: { id: reqB.id } });

  // --- Test C: Valid token for own data ---
  console.log("\n[Test C] Valid token, normal request for own data");
  // To avoid triggering the actual expensive LLM right now, we will send an empty jdText which should return a 400 Bad Request, proving it PASSED auth and reached the controller.
  const resC = await fetch(`${BASE_URL}/resume`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({}) // Empty to trigger 400 instead of a full LLM run for testing speed
  });
  console.log(`Status: ${resC.status} (Expected: 400 - jdText required)`);
  console.log(`Response:`, await resC.json());

  // --- Test D: Rate Limiting ---
  console.log("\n[Test D] Fire 11 requests to POST /resume within 15 mins");
  let lastStatus = 0;
  let lastBody = null;
  // Fire 11 requests
  for (let i = 1; i <= 11; i++) {
    const resD = await fetch(`${BASE_URL}/resume`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenA}`
      },
      body: JSON.stringify({}) // Again, we just want to trigger the rate limiter, so passing empty body is fine (it hits 400 normally, 429 when limited)
    });
    lastStatus = resD.status;
    lastBody = await resD.json();
    process.stdout.write(`Req ${i}: ${lastStatus} | `);
  }
  
  console.log(`\n\nFinal Request (11th) Status: ${lastStatus} (Expected: 429)`);
  console.log(`Final Response:`, lastBody);

  server.close();
}

runTests().catch(err => {
  console.error(err);
  server.close();
});
