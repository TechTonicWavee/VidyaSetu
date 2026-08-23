import { prisma } from '../../../shared/lib/prisma';
import { nvidiaClient, embedModel } from './nvidiaClient';

export class RetrievalService {
  /**
   * Embeds the keywords, then queries pgvector using cosine distance <=>
   * Returns matching chunks with similarity (1 - distance).
   */
  static async retrieveRelevantChunks(universityId: string, keywords: string, topK: number) {
    if (!keywords || keywords.trim() === '') return [];

    // 1. Embed the keywords string
    const response = await nvidiaClient.embeddings.create({
      input: [keywords],
      model: embedModel(),
      encoding_format: "float",
    });
    
    const embedding = response.data[0]!.embedding;
    const embeddingString = `[${embedding.join(',')}]`;

    // 2. Query against ProfileSectionEmbedding
    // Cosine distance <=> operator in pgvector. Distance 0 means identical, 2 means completely opposite.
    // We order by distance ASC and calculate similarity = 1 - distance.
    const results = await prisma.$queryRaw<
      { sectionType: string; sourceId: string; content: string; similarity: number }[]
    >`
      SELECT 
        "sectionType", 
        "sourceId", 
        "content", 
        1 - ("embedding" <=> ${embeddingString}::vector) AS similarity
      FROM "profile_section_embeddings"
      WHERE "universityId" = ${universityId}
      ORDER BY "embedding" <=> ${embeddingString}::vector ASC
      LIMIT ${topK};
    `;

    return results;
  }
}
