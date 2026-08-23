import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { generateResume, clarifyResumeRequest } from '../controllers/advisor.controller';
import { syncProfile } from '../controllers/profileSync.controller';
import { authMiddleware, AuthedRequest } from '../../../shared/middleware/auth';

export const advisorRouter = express.Router();

const resumeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each user to 10 requests per `window` (here, per 15 minutes)
  keyGenerator: (req: Request) => {
    // Key by universityId, falling back to IP if not present (though authMiddleware ensures it is)
    return (req as AuthedRequest).user?.universityId || 'unknown';
  },
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      data: null,
      error: {
        code: 'rate_limited',
        message: 'Too many resume generation requests. Please try again later.'
      }
    });
  }
});

// Apply auth middleware to all routes
advisorRouter.use(authMiddleware);

// POST /api/advisor/resume
advisorRouter.post('/resume', resumeRateLimiter, generateResume);
advisorRouter.post('/resume/:requestId/clarify', clarifyResumeRequest);
advisorRouter.post('/sync-profile', syncProfile);

export default advisorRouter;
