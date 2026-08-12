import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { directoryQuerySchema, directoryUserParamsSchema } from '../validators/directory.schema';
import * as directoryController from '../controllers/directory.controller';

export const directoryRouter = Router();

directoryRouter.use(authMiddleware);

directoryRouter.get('/', validate({ query: directoryQuerySchema }), directoryController.list);
directoryRouter.get('/domains', directoryController.domains);
directoryRouter.get('/:universityId', validate({ params: directoryUserParamsSchema }), directoryController.getOne);
