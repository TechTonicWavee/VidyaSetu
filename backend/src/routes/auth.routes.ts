import { Router } from 'express';
import { validate } from '../middleware/validate';
import { loginSchema } from '../validators/auth.schema';
import * as authController from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/login', validate({ body: loginSchema }), authController.login);
authRouter.post('/form-login', validate({ body: loginSchema }), authController.formLogin);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
