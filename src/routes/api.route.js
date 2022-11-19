import { Router } from 'express';

import PostsRouter from './posts.route.js';

const router = Router();

router.use('/posts', PostsRouter);

export default router;
