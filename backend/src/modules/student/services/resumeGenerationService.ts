import { nvidiaClient, generationModel } from './nvidiaClient';

export class ResumeGenerationService {
  /**
   * Generate tailored resume via LLM
   */
  static async generateResume(context: { jdText: string, requirements: any, chunks: any[], summary?: any, clarificationAnswers?: any }) {
    const { jdText, requirements, chunks, summary, clarificationAnswers } = context;

    const schema = {
      type: "object",
      properties: {
        summary: { type: "string" },
        matchedSkills: { type: "array", items: { type: "string" } },
        projects: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              bullets: { type: "array", items: { type: "string" } },
              relevanceScore: { type: "number" }
            },
            required: ["title", "bullets", "relevanceScore"]
          }
        },
        experience: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              bullets: { type: "array", items: { type: "string" } }
            },
            required: ["title", "bullets"]
          }
        }
      },
      required: ["summary", "matchedSkills", "projects", "experience"]
    };

    const systemPrompt = `You are an expert resume writer. Generate a tailored resume based on the Job Description and the student's profile chunks.
CRITICAL RULES:
1. ONLY use information present in the provided chunks and summary. NEVER invent or hallucinate experience, skills, or projects.
2. Rank projects and experience by relevanceScore descending.
3. Incorporate clarificationAnswers where provided to prioritize certain ambiguous matches or included additional skills.`;

    const userPrompt = `Job Description:
${jdText}

Extracted Requirements:
${JSON.stringify(requirements, null, 2)}

Student Profile Chunks:
${JSON.stringify(chunks, null, 2)}

Student Summary:
${JSON.stringify(summary || {}, null, 2)}

Clarification Answers:
${JSON.stringify(clarificationAnswers || {}, null, 2)}

Please return ONLY a JSON object that perfectly matches the following schema:
${JSON.stringify(schema, null, 2)}
`;

    const startTime = Date.now();
    const response = await nvidiaClient.chat.completions.create({
      model: generationModel(),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    }, { timeout: 90000, maxRetries: 2 });
    
    console.log(`[resumeGenerationService] Generation took ${Date.now() - startTime}ms`);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Model failed to return content for resume generation.");
    }

    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (_err) {
      throw new Error("Failed to parse the structured JSON output from the model.");
    }
  }
}
