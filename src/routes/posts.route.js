import { Router } from 'express';

import AuthMiddleware from '../middlewares/auth.middleware.js';
import * as PostsController from '../controllers/posts.controller.js';

const router = Router();

router.get('/', PostsController.getPosts);

router.get('/:id', PostsController.getPost);

router.post('/', AuthMiddleware, PostsController.createPost);

export default router;
