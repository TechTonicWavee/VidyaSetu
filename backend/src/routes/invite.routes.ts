import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { inviteIdParamsSchema } from '../validators/team.schema';
import * as inviteController from '../controllers/invite.controller';

export const inviteRouter = Router();

inviteRouter.use(authMiddleware);

inviteRouter.post('/:id/accept', validate({ params: inviteIdParamsSchema }), inviteController.accept);
inviteRouter.post('/:id/decline', validate({ params: inviteIdParamsSchema }), inviteController.decline);
inviteRouter.delete('/:id', validate({ params: inviteIdParamsSchema }), inviteController.cancel);
