import { Router } from 'express';

import PostsRouter from './posts.route.js';
import AuthRouter from './auth.route.js';
import UsersRouter from './users.route.js';

const router = Router();

router.use('/posts', PostsRouter);
router.use('/auth', AuthRouter);
router.use('/users', UsersRouter);

export default router;
