import { Router } from 'express';

import AuthMiddleware from '../middlewares/auth.middleware.js';
import * as AuthController from '../controllers/auth.controller.js';

const router = Router();

router.post('/', AuthMiddleware, AuthController.login);

router.get('/', AuthController.getCurrentUser);

router.post('/register', AuthController.createUser);

router.get('/logout', AuthMiddleware, AuthController.logout);

export default router;
