import { Router } from 'express';

import FriendsRouter from './friends.route.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import * as UsersController from '../controllers/users.controller.js';

const router = Router();


router.use('/friends', AuthMiddleware, FriendsRouter);
router.get('/', AuthMiddleware, UsersController.getCurrentUser);
router.get('/notifications', AuthMiddleware, UsersController.getNotifications);
router.put('/dismiss-notification/:id', AuthMiddleware, UsersController.dismissNotification);
router.put('/update', AuthMiddleware, UsersController.updateUser);
router.get('/:id', UsersController.getUser);


export default router;
