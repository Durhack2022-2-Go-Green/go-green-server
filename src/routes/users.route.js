import { Router } from 'express';

import FriendsRouter from './friends.route.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import * as UsersController from '../controllers/users.controller.js';

const router = Router();


router.use('/friends', AuthMiddleware, FriendsRouter);
router.get('/', AuthMiddleware, UsersController.getCurrentUser);
router.put('/update', AuthMiddleware, UsersController.updateUser);
router.post('/:id/block', AuthMiddleware, UsersController.blockUser);
router.get('/:id', UsersController.getUser);


export default router;
