import { prisma } from '../../../shared/lib/prisma';
import slugify from 'slugify';

export const SIMILARITY_THRESHOLD = 0.50;

export class GapScoringService {
  /**
   * Generates multiple-choice clarification questions based on gaps.
   */
  static generateQuestions(gaps: any[]) {
    return gaps.map(gap => {
      if (gap.reason === 'ambiguous') {
        return {
          requirement: gap.requirement,
          type: 'multiple_choice',
          question: `We found multiple matches for '${gap.requirement}' — which should we prioritize?`,
          options: gap.candidates.map((c: any) => c.content),
          allowSkip: true
        };
      } else {
        return {
          requirement: gap.requirement,
          type: 'multiple_choice',
          question: `We couldn't find profile experience matching '${gap.requirement}' — do you have relevant experience not yet on your profile, or should we skip it?`,
          options: ["I have relevant experience", "Skip this requirement"],
          allowSkip: true
        };
      }
    });
  }

  /**
   * Scores confidence and identifies gaps for clarification
   */
  static async scoreConfidence(universityId: string, requirements: any, chunks: any[]) {
    const gaps: any[] = [];
    const allRequirements = [
      ...(requirements.requiredSkills || []),
      ...(requirements.preferredSkills || [])
    ];

    for (const req of allRequirements) {
      const prefKey = slugify(req, { lower: true, strict: true });
      
      // Check for saved preference
      const pref = await prisma.resumeClarificationPreference.findFirst({
        where: { universityId, preferenceKey: prefKey }
      });
      
      if (pref) {
        // Automatically resolved by preference, skip gap
        continue;
      }

      // Keyword matching: chunk must contain the requirement string (case-insensitive)
      const reqLower = req.toLowerCase();
      const matchingChunks = chunks.filter(c => c.content.toLowerCase().includes(reqLower));
      
      if (matchingChunks.length === 0) {
        gaps.push({ requirement: req, reason: 'no_match', candidates: [] });
        continue;
      }

      // Sort matching chunks by similarity descending
      matchingChunks.sort((a: any, b: any) => b.similarity - a.similarity);
      
      const bestMatch = matchingChunks[0];
      if (bestMatch.similarity < SIMILARITY_THRESHOLD) {
        gaps.push({ requirement: req, reason: 'no_match', candidates: matchingChunks });
        continue;
      }

      // Check for ambiguous ties (within 0.03 of the best match)
      const tiedChunks = matchingChunks.filter((c: any) => Math.abs(bestMatch.similarity - c.similarity) <= 0.03);
      if (tiedChunks.length > 1) {
        gaps.push({ requirement: req, reason: 'ambiguous', candidates: tiedChunks });
        continue;
      }
    }

    const clarificationQuestions = this.generateQuestions(gaps);

    return {
      needsClarification: gaps.length > 0,
      gaps,
      clarificationQuestions
    };
  }
}
