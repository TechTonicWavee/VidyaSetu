import { Request, Response } from 'express';
import { prisma } from '../../../shared/lib/prisma';
import crypto from 'crypto';
import { JdExtractionService } from '../services/jdExtractionService';
import { RetrievalService } from '../services/retrievalService';
import { GapScoringService } from '../services/gapScoringService';
import { ResumeGenerationService } from '../services/resumeGenerationService';
import { AuthedRequest } from '../../../shared/middleware/auth';
import slugify from 'slugify';

function hashText(text: string) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

export const generateResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const jdText = req.body.jdText;
    const bodyUniversityId = req.body.universityId;
    const authedReq = req as AuthedRequest;
    const universityId = authedReq.user!.universityId;
    
    if (bodyUniversityId && bodyUniversityId !== universityId) {
      res.status(403).json({ success: false, data: null, error: { code: 'forbidden', message: 'You can only generate resumes for your own profile.' } });
      return;
    }

    if (!jdText) {
      res.status(400).json({ success: false, data: null, error: { code: 'VALIDATION_ERROR', message: 'Please provide a Job Description to generate a tailored resume.' } });
      return;
    }

    const jdHash = hashText(jdText);

    // Check if ResumeVersion already exists for this jdHash + universityId
    const existingVersion = await prisma.resumeVersion.findFirst({
      where: {
        resumeRequest: { universityId, jdHash }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (existingVersion && existingVersion.resumeJson) {
      console.log(`[Advisor] Returning cached resume for student ${universityId}`);
      res.json({
        success: true,
        data: { requestId: existingVersion.resumeRequestId, resumeJson: existingVersion.resumeJson, cached: true }
      });
      return;
    }

    // 1. Extract requirements
    console.log(`\n[Advisor] Extracting JD requirements for student ${universityId}...`);
    const requirements = await JdExtractionService.extractRequirements(jdText);
    
    // 2. Retrieve relevant chunks
    console.log(`\n[Advisor] Retrieving relevant profile chunks...`);
    const searchKeywords = [...(requirements.requiredSkills || []), ...(requirements.preferredSkills || [])].join(' ');
    const chunks = await RetrievalService.retrieveRelevantChunks(universityId, searchKeywords || requirements.role || jdText, 10);
    
    // 3. Score confidence
    const { needsClarification, gaps, clarificationQuestions } = await GapScoringService.scoreConfidence(universityId, requirements, chunks);
    
    // 4. Clarification Branch
    if (needsClarification) {
      // Create ResumeRequest row
      const request = await prisma.resumeRequest.create({
        data: {
          universityId,
          jdText,
          jdHash,
          extractedRequirements: requirements,
          status: 'pending_clarification'
        }
      });

      res.json({
        success: true,
        data: {
          needsClarification: true,
          requestId: request.id,
          clarificationQuestions
        }
      });
      return;
    }
    
    // Create ResumeRequest as fulfilled
    const request = await prisma.resumeRequest.create({
      data: {
        universityId,
        jdText,
        jdHash,
        extractedRequirements: requirements,
        status: 'fulfilled'
      }
    });

    // 5. Generate resume
    console.log(`\n[Advisor] Generating resume...`);
    const studentSummary = await prisma.studentSummary.findUnique({ where: { universityId } });
    let resumeJson;
    try {
      resumeJson = await ResumeGenerationService.generateResume({ 
        jdText, 
        requirements, 
        chunks,
        summary: studentSummary?.summaryJson 
      });
    } catch (err: any) {
      if (err.name === 'APIConnectionTimeoutError' || err.message?.toLowerCase().includes('timeout') || err.message?.toLowerCase().includes('abort')) {
        res.status(504).json({ success: false, data: null, error: { code: 'generation_timeout', message: 'The AI took too long to respond. Please try again.' } });
        return;
      }
      throw err;
    }
    
    // Save version
    await prisma.resumeVersion.create({
      data: {
        resumeRequestId: request.id,
        resumeJson
      }
    });

    res.json({ 
      success: true, 
      data: { requestId: request.id, resumeJson } 
    });
  } catch (error: any) {
    console.error('Error generating resume:', error);
    res.status(500).json({ success: false, data: null, error: { code: 'INTERNAL_ERROR', message: error.message || 'Failed to generate resume' } });
  }
};

export const clarifyResumeRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;
    const { answers } = req.body; // array of { requirement, preferenceKey, answer }
    
    const authedReq = req as AuthedRequest;
    const universityId = authedReq.user!.universityId; 

    const request = await prisma.resumeRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) {
      res.status(404).json({ success: false, data: null, error: { code: 'NOT_FOUND', message: 'Resume request not found' } });
      return;
    }

    if (request.universityId !== universityId) {
      res.status(403).json({ success: false, error: 'forbidden', message: 'You do not have permission to clarify this resume request.' });
      return;
    }

    // 1. Store preferences and update request
    const answersObj: Record<string, string> = {};

    for (const ans of answers) {
      answersObj[ans.requirement] = ans.answer;
      const prefKey = slugify(ans.requirement, { lower: true, strict: true });

      // Upsert into preference
      const existingPref = await prisma.resumeClarificationPreference.findFirst({
        where: { universityId, preferenceKey: prefKey }
      });
      
      if (existingPref) {
        await prisma.resumeClarificationPreference.update({
          where: { id: existingPref.id },
          data: { preferenceValue: ans.answer }
        });
      } else {
        await prisma.resumeClarificationPreference.create({
          data: {
            universityId,
            preferenceKey: prefKey,
            preferenceValue: ans.answer
          }
        });
      }
    }

    await prisma.resumeRequest.update({
      where: { id: requestId },
      data: {
        clarificationAnswers: answersObj,
        status: 'fulfilled'
      }
    });

    // 2. Re-retrieve chunks (or use cached ones if stored, but we can just re-retrieve)
    const requirements = request.extractedRequirements as any;
    const searchKeywords = [...(requirements.requiredSkills || []), ...(requirements.preferredSkills || [])].join(' ');
    const chunks = await RetrievalService.retrieveRelevantChunks(universityId, searchKeywords || requirements.role || request.jdText, 10);
    
    // 3. Generate resume
    console.log(`\n[Advisor] Generating resume after clarification...`);
    const studentSummary = await prisma.studentSummary.findUnique({ where: { universityId } });
    let resumeJson;
    try {
      resumeJson = await ResumeGenerationService.generateResume({
        jdText: request.jdText,
        requirements,
        chunks,
        summary: studentSummary?.summaryJson,
        clarificationAnswers: answersObj
      });
    } catch (err: any) {
      if (err.name === 'APIConnectionTimeoutError' || err.message?.toLowerCase().includes('timeout') || err.message?.toLowerCase().includes('abort')) {
        res.status(504).json({ success: false, data: null, error: { code: 'generation_timeout', message: 'The AI took too long to respond. Please try again.' } });
        return;
      }
      throw err;
    }
    
    // Save version
    await prisma.resumeVersion.create({
      data: {
        resumeRequestId: request.id,
        resumeJson
      }
    });

    res.json({ 
      success: true, 
      data: { requestId: request.id, resumeJson } 
    });
  } catch (error: any) {
    console.error('Error in clarification branch:', error);
    res.status(500).json({ success: false, data: null, error: { code: 'INTERNAL_ERROR', message: error.message || 'Failed to process clarification' } });
  }
};
