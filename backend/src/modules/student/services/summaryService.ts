import { prisma } from '../../../shared/lib/prisma';
import { nvidiaClient, generationModel } from './nvidiaClient';

export class SummaryService {
  /**
   * Generates a compact JSON summary of a student's profile via LLM and upserts it into StudentSummary
   */
  static async generateSummary(universityId: string) {
    // 1. Fetch Student and relation counts/highlights
    const student = await prisma.student.findUnique({
      where: { universityId },
      include: {
        projects: { select: { title: true, techStack: true } },
        certifications: { select: { name: true, skills: true } },
        internships: { select: { company: true, role: true, techStack: true } },
        hackathons: { select: { name: true, position: true } },
        extracurriculars: { select: { role: true, society: true } },
        codingProfile: true
      }
    });

    if (!student) return;

    // 2. Prepare payload for LLM
    const promptData = {
      fullName: student.fullName,
      branch: student.branch,
      year: student.year,
      projects: student.projects,
      certifications: student.certifications,
      internships: student.internships,
      hackathons: student.hackathons,
      extracurriculars: student.extracurriculars,
      codingProfile: student.codingProfile
    };

    const schema = {
      type: "object",
      properties: {
        summaryText: { type: "string" },
        keyHighlights: { type: "array", items: { type: "string" } },
        primaryTechnologies: { type: "array", items: { type: "string" } }
      },
      required: ["summaryText", "keyHighlights", "primaryTechnologies"]
    };

    // 3. Call LLM
    const response = await nvidiaClient.chat.completions.create({
      model: generationModel(),
      messages: [
        { role: "system", content: "You are an AI summarizing a student's technical profile. Create a compact summary (a few sentences + key stats)." },
        { role: "user", content: `Student Data:\n${JSON.stringify(promptData)}` }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generate_summary",
            description: "Generate structured profile summary",
            parameters: schema as Record<string, unknown>
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "generate_summary" } }
    }, { timeout: 30000, maxRetries: 1 });

    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) return;

    let summaryJson;
    try {
      summaryJson = JSON.parse((toolCall as any).function.arguments);
    } catch (_err) {
      return;
    }

    // 4. Upsert StudentSummary
    await prisma.studentSummary.upsert({
      where: { universityId },
      create: {
        universityId,
        summaryJson
      },
      update: {
        summaryJson
      }
    });
  }
}
