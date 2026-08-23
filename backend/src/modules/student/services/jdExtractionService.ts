import { nvidiaClient, extractionModel } from './nvidiaClient';

export class JdExtractionService {
  /**
   * LLM extraction of JD requirements via tool calling
   */
  static async extractRequirements(jdText: string) {
    const schema = {
      type: "object",
      properties: {
        role: { type: "string" },
        requiredSkills: { type: "array", items: { type: "string" } },
        preferredSkills: { type: "array", items: { type: "string" } },
        yearsExperience: { type: ["number", "null"] },
        responsibilities: { type: "array", items: { type: "string" } },
      },
      required: ["role", "requiredSkills", "preferredSkills", "yearsExperience", "responsibilities"]
    };

    const startTime = Date.now();
    const response = await nvidiaClient.chat.completions.create({
      model: extractionModel(),
      messages: [
        { role: "system", content: "You are an expert technical recruiter." },
        { role: "user", content: `Extract the structured requirements from this JD:\n\n${jdText}` }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "extract_requirements",
            description: "Extract structured requirements from a job description",
            parameters: schema as Record<string, unknown>
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "extract_requirements" } }
    }, { timeout: 45000, maxRetries: 1 });
    
    console.log(`[jdExtractionService] Extraction took ${Date.now() - startTime}ms`);

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("Model failed to return a tool call for extraction.");
    }

    try {
      const parsed = JSON.parse((toolCall as any).function.arguments);
      return parsed;
    } catch (_err) {
      throw new Error("Failed to parse the structured output from the model.");
    }
  }
}
