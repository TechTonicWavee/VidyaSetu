import { z } from 'zod';

export const loginSchema = z.object({
  universityId: z.string().trim().min(1, 'universityId is required'),
  password: z.string().min(1, 'password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
