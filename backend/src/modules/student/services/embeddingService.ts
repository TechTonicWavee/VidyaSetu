import { prisma } from '../../../shared/lib/prisma';
import { nvidiaClient, embedModel } from './nvidiaClient';

export class EmbeddingService {
  /**
   * Embeds ONE row only, upserts into ProfileSectionEmbedding.
   * TODO: Call this from the controllers/services where Project, Certification,
   * Hackathon, Extracurricular, Internship, or CodingProfile are created/updated.
   */
  static async embedProfileSection(sectionType: string, sourceId: string) {
    let content = '';
    let universityId = '';

    // 1. Look up the actual row based on sectionType + sourceId
    switch (sectionType) {
      case 'project': {
        const row = await prisma.project.findUnique({ where: { id: sourceId } });
        if (!row) throw new Error(`Project ${sourceId} not found`);
        universityId = row.universityId;
        const roleStr = row.role ? `Role: ${row.role}` : '';
        const typeStr = row.type ? `Type: ${row.type}` : '';
        const statusStr = row.status ? `Status: ${row.status}` : '';
        const meta = [roleStr, typeStr, statusStr].filter(Boolean).join(', ');
        content = `Project: ${row.title} ${meta ? `(${meta})` : ''}. ${row.description || ''}. Tech: ${(row.techStack || []).join(', ')}`;
        break;
      }
      case 'certification': {
        const row = await prisma.certification.findUnique({ where: { id: sourceId } });
        if (!row) throw new Error(`Certification ${sourceId} not found`);
        universityId = row.universityId;
        const scoreStr = row.score ? `Score: ${row.score}` : '';
        const tierStr = row.tier ? `Tier: ${row.tier}` : '';
        const meta = [scoreStr, tierStr].filter(Boolean).join(', ');
        content = `Certification: ${row.name} from ${row.platform || ''} ${meta ? `(${meta})` : ''}. Skills: ${(row.skills || []).join(', ')}`;
        break;
      }
      case 'hackathon': {
        const row = await prisma.hackathon.findUnique({ where: { id: sourceId } });
        if (!row) throw new Error(`Hackathon ${sourceId} not found`);
        universityId = row.universityId;
        const orgStr = row.organizer ? `organized by ${row.organizer}` : '';
        const posStr = row.position ? `Position: ${row.position}` : '';
        const teamStr = row.teamSize ? `Team Size: ${row.teamSize}` : '';
        const meta = [posStr, teamStr].filter(Boolean).join(', ');
        content = `Hackathon: ${row.name} ${orgStr} ${meta ? `(${meta})` : ''}. Problem: ${row.problemStatement || ''}. Solution: ${row.solution || ''}`;
        break;
      }
      case 'extracurricular': {
        const row = await prisma.extracurricular.findUnique({ where: { id: sourceId } });
        if (!row) throw new Error(`Extracurricular ${sourceId} not found`);
        universityId = row.universityId;
        content = `Extracurricular: ${row.role} at ${row.society} ${row.year ? `(Year: ${row.year})` : ''}. Achievement: ${row.achievement || ''}`;
        break;
      }
      case 'internship': {
        const row = await prisma.internship.findUnique({ where: { id: sourceId } });
        if (!row) throw new Error(`Internship ${sourceId} not found`);
        universityId = row.universityId;
        const paidStr = row.isPaid ? '(Paid)' : '';
        content = `Internship: ${row.role} at ${row.company} ${paidStr}. ${row.description || ''}. Tech: ${(row.techStack || []).join(', ')}`;
        break;
      }
      case 'codingProfile': {
        const row = await prisma.codingProfile.findUnique({ where: { id: sourceId } });
        if (!row) throw new Error(`CodingProfile ${sourceId} not found`);
        universityId = row.universityId;
        
        let githubStr = `GitHub: ${row.githubRepos || 0} repos`;
        const gs = row.githubStats as any;
        if (gs) {
          const contribs = gs.totalContributions ? `, ${gs.totalContributions} total contributions` : '';
          const stars = gs.totalStars ? `, and ${gs.totalStars} stars` : '';
          const langs = (gs.languages && gs.languages.length > 0) ? `. Top languages used: ${gs.languages.join(', ')}` : '';
          githubStr = `Active developer on GitHub with ${row.githubRepos || gs.publicRepos || 0} repositories${contribs}${stars}${langs}`;
        }

        let lcStr = `LeetCode: ${row.leetcodeSolved || 0} problems solved`;
        const lcs = row.leetcodeStats as any;
        if (lcs) {
          const breakdowns = [];
          if (lcs.easySolved) breakdowns.push(`Easy: ${lcs.easySolved}`);
          if (lcs.mediumSolved) breakdowns.push(`Medium: ${lcs.mediumSolved}`);
          if (lcs.hardSolved) breakdowns.push(`Hard: ${lcs.hardSolved}`);
          const breakdownStr = breakdowns.length > 0 ? ` (${breakdowns.join(', ')})` : '';
          lcStr = `LeetCode: ${row.leetcodeSolved || lcs.totalSolved || 0} problems solved${breakdownStr}`;
        }

        content = `Coding Profile: ${githubStr}. ${lcStr}. CodeChef Rating: ${row.codechefRating || 0}.`;
        break;
      }
      case 'resume': {
        const row = await prisma.student.findUnique({ where: { universityId: sourceId } });
        if (!row) throw new Error(`Student ${sourceId} not found`);
        universityId = row.universityId;
        if (!row.resumeParsed) {
           content = 'Resume: (No parsed data available)';
        } else {
           const rp = row.resumeParsed as any;
           const sections = [];
           if (rp.summary) sections.push(`Summary: ${rp.summary}`);
           if (rp.skills && rp.skills.length > 0) sections.push(`Skills: ${rp.skills.join(', ')}`);
           if (rp.experience && rp.experience.length > 0) {
             const exps = rp.experience.map((e: any) => typeof e === 'string' ? e : `${e.title || ''}: ${(e.bullets || []).join(' ')}`);
             sections.push(`Experience: ${exps.join(' | ')}`);
           }
           if (rp.projects && rp.projects.length > 0) {
             const projs = rp.projects.map((p: any) => typeof p === 'string' ? p : `${p.title || ''}: ${(p.bullets || []).join(' ')}`);
             sections.push(`Projects: ${projs.join(' | ')}`);
           }
           content = `Resume: ${sections.join('. ')}`;
        }
        break;
      }
      default:
        throw new Error(`Unsupported sectionType: ${sectionType}`);
    }

    // 2. Call nvidiaClient's embed model on that text
    const response = await nvidiaClient.embeddings.create({
      input: [content],
      model: embedModel(),
      encoding_format: "float",
    });
    
    const embedding = response.data[0]!.embedding;

    // 3. Upsert into ProfileSectionEmbedding using pgvector literal format
    const embeddingString = `[${embedding.join(',')}]`;

    // Note: We use executeRaw because Prisma can't directly write Unsupported("vector") types
    // using its standard query builder payload.
    // We match on (universityId, sectionType, sourceId).
    // Let's do a lookup to see if it exists first, then update by id, or insert.
    const existing = await prisma.$queryRaw<{ id: string }[]>`
      SELECT "id" FROM "profile_section_embeddings"
      WHERE "universityId" = ${universityId} 
        AND "sectionType" = ${sectionType} 
        AND "sourceId" = ${sourceId}
      LIMIT 1;
    `;

    if (existing.length > 0) {
      const existingId = existing[0]!.id;
      await prisma.$executeRaw`
        UPDATE "profile_section_embeddings"
        SET "content" = ${content},
            "embedding" = ${embeddingString}::vector,
            "updatedAt" = NOW()
        WHERE "id" = ${existingId}
      `;
    } else {
      await prisma.$executeRaw`
        INSERT INTO "profile_section_embeddings" ("id", "universityId", "sectionType", "sourceId", "content", "embedding", "updatedAt")
        VALUES (gen_random_uuid(), ${universityId}, ${sectionType}, ${sourceId}, ${content}, ${embeddingString}::vector, NOW())
      `;
    }

    return true;
  }
}
