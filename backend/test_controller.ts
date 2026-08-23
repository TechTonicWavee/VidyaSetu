import { generateResume, clarifyResumeRequest } from './src/controllers/advisor.controller';

async function test() {
  console.log("=== Testing generateResume ===");
  
  // Mock req and res
  const req = {
    body: {
      jdText: "We are looking for a backend engineer with 2 years of experience in Node.js, Express, and PostgreSQL. Must have experience with Redis and Docker. Familiarity with AWS is a plus."
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

  if (jsonResult?.needsClarification) {
    console.log("\n=== Testing clarifyResumeRequest ===");
    const clarifyReq = {
      params: { requestId: jsonResult.data.requestId },
      body: {
        answers: [
          { requirement: "Redis", preferenceKey: "redis", answer: "I used Redis in my personal project" },
          { requirement: "Docker", preferenceKey: "docker", answer: "I have experience containerizing Node apps with Docker" },
          { requirement: "AWS", preferenceKey: "aws", answer: "Skip this requirement" }
        ]
      },
      user: {
        universityId: '202401100300265'
      }
    } as any;
    
    let clarifyResult: any = null;
    const clarifyRes = {
      status: (code: number) => clarifyRes,
      json: (data: any) => {
        clarifyResult = data;
      }
    } as any;

    await clarifyResumeRequest(clarifyReq, clarifyRes);
    console.log("Clarify response:");
    console.log(JSON.stringify(clarifyResult, null, 2));
  }
}

test().catch(console.error);
