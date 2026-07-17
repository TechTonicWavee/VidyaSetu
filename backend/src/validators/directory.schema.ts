import { z } from 'zod';

export const directoryQuerySchema = z.object({
  domain: z.string().trim().optional(),
  search: z.string().trim().optional(),
  year: z.coerce.number().int().optional(),
  section: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const directoryUserParamsSchema = z.object({
  universityId: z.string().trim().min(1),
});
