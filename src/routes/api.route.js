import { Router } from 'express';

import PostsRouter from './posts.route.js';
import AuthRouter from './auth.route.js';

const router = Router();

router.use('/posts', PostsRouter);
router.use('/auth', AuthRouter);

export default router;
