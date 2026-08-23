import { Response } from 'express';
import { prisma } from '../../../shared/lib/prisma';
import { EmbeddingService } from '../services/embeddingService';
import { SummaryService } from '../services/summaryService';
import { AuthedRequest } from '../../../shared/middleware/auth';

export const syncProfile = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const universityId = req.user!.universityId;

    // Acknowledge the request immediately since this is a fire-and-forget background task
    res.json({ success: true, message: 'Sync started' });

    // 1. Fetch all items from the 6 models
    const [
      projects,
      certifications,
      hackathons,
      extracurriculars,
      internships,
      codingProfile
    ] = await Promise.all([
      prisma.project.findMany({ where: { universityId } }),
      prisma.certification.findMany({ where: { universityId } }),
      prisma.hackathon.findMany({ where: { universityId } }),
      prisma.extracurricular.findMany({ where: { universityId } }),
      prisma.internship.findMany({ where: { universityId } }),
      prisma.codingProfile.findUnique({ where: { universityId } })
    ]);

    // 2. Clear old embeddings for this student to prevent orphaned embeddings
    await prisma.profileSectionEmbedding.deleteMany({
      where: { universityId }
    });

    // 3. Re-embed all active sections
    for (const p of projects) {
      await EmbeddingService.embedProfileSection('project', p.id).catch(err => 
        console.error(`[syncProfile] Failed to embed project ${p.id}:`, err)
      );
    }
    for (const c of certifications) {
      await EmbeddingService.embedProfileSection('certification', c.id).catch(err => 
        console.error(`[syncProfile] Failed to embed certification ${c.id}:`, err)
      );
    }
    for (const h of hackathons) {
      await EmbeddingService.embedProfileSection('hackathon', h.id).catch(err => 
        console.error(`[syncProfile] Failed to embed hackathon ${h.id}:`, err)
      );
    }
    for (const e of extracurriculars) {
      await EmbeddingService.embedProfileSection('extracurricular', e.id).catch(err => 
        console.error(`[syncProfile] Failed to embed extracurricular ${e.id}:`, err)
      );
    }
    for (const i of internships) {
      await EmbeddingService.embedProfileSection('internship', i.id).catch(err => 
        console.error(`[syncProfile] Failed to embed internship ${i.id}:`, err)
      );
    }
    if (codingProfile) {
      await EmbeddingService.embedProfileSection('codingProfile', codingProfile.id).catch(err => 
        console.error(`[syncProfile] Failed to embed codingProfile ${codingProfile.id}:`, err)
      );
    }
    
    // Resume section
    await EmbeddingService.embedProfileSection('resume', universityId).catch(err => 
      console.error(`[syncProfile] Failed to embed resume ${universityId}:`, err)
    );

    // 4. Update Summary
    await SummaryService.generateSummary(universityId).catch(err => 
      console.error(`[syncProfile] Failed to generate summary for ${universityId}:`, err)
    );

    console.log(`[syncProfile] Completed sync for ${universityId}`);

  } catch (err: any) {
    console.error(`[syncProfile] Error starting sync:`, err.message);
  }
};
