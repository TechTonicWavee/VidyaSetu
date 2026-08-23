import { nvidiaClient } from '../src/modules/student/services/nvidiaClient';

async function main() {
  console.log("Testing generation model with tools...");
  const startTime = Date.now();
  
  try {
    const response = await nvidiaClient.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [{ role: "user", content: "Tell me a joke" }],
      tools: [
        {
          type: "function",
          function: {
            name: "tell_joke",
            description: "Tell a joke",
            parameters: { type: "object", properties: { setup: { type: "string" }, punchline: { type: "string" } }, required: ["setup", "punchline"] }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "tell_joke" } }
    });
    
    console.log(`Response in ${Date.now() - startTime}ms:`, JSON.stringify(response.choices[0], null, 2));
  } catch (err: any) {
    console.error(`Failed after ${Date.now() - startTime}ms:`, err.message);
  }
}

main();
