import { nvidiaClient } from '../src/modules/student/services/nvidiaClient';

async function main() {
  console.log("Testing generation model...");
  const startTime = Date.now();
  
  try {
    const response = await nvidiaClient.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [{ role: "user", content: "Say hello!" }],
    });
    
    console.log(`Response in ${Date.now() - startTime}ms:`, response.choices[0].message.content);
  } catch (err) {
    console.error(`Failed after ${Date.now() - startTime}ms:`, err);
  }
}

main();
