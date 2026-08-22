import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().trim().min(1, 'name is required').max(100),
  description: z.string().trim().max(2000).optional(),
  domain: z.string().trim().max(100).optional(),
  maxMembers: z.coerce.number().int().min(2).max(20).default(4),
});

export const updateTeamSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(2000).optional(),
  domain: z.string().trim().max(100).optional(),
  maxMembers: z.coerce.number().int().min(2).max(20).optional(),
  leaderId: z.string().trim().min(1).optional(),
});

export const teamIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const teamMemberParamsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().trim().min(1),
});

export const createInviteSchema = z.object({
  receiverId: z.string().trim().min(1, 'receiverId is required'),
  message: z.string().trim().max(1000).optional(),
});

export const inviteIdParamsSchema = z.object({
  id: z.string().uuid(),
});
