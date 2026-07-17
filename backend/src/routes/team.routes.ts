import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createInviteSchema,
  createTeamSchema,
  teamIdParamsSchema,
  teamMemberParamsSchema,
  updateTeamSchema,
} from '../validators/team.schema';
import * as teamController from '../controllers/team.controller';

export const teamRouter = Router();

teamRouter.use(authMiddleware);

teamRouter.post('/', validate({ body: createTeamSchema }), teamController.create);
teamRouter.get('/my', teamController.listMine);
teamRouter.get('/invites/sent', teamController.listSentInvites);
teamRouter.get('/invites/received', teamController.listReceivedInvites);
teamRouter.get('/:id', validate({ params: teamIdParamsSchema }), teamController.getOne);
teamRouter.patch('/:id', validate({ params: teamIdParamsSchema, body: updateTeamSchema }), teamController.update);
teamRouter.delete('/:id', validate({ params: teamIdParamsSchema }), teamController.remove);
teamRouter.post(
  '/:id/invites',
  validate({ params: teamIdParamsSchema, body: createInviteSchema }),
  teamController.invite,
);
teamRouter.delete(
  '/:id/members/:userId',
  validate({ params: teamMemberParamsSchema }),
  teamController.removeMember,
);
