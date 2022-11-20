import { Router } from 'express';

import AuthMiddleware from '../middlewares/auth.middleware.js';
import * as PostsController from '../controllers/posts.controller.js';

const router = Router();

router.get('/', PostsController.getPosts);

router.get('/:id', PostsController.getPost);

router.post('/:id/add_comment', AuthMiddleware, PostsController.addComment);

router.post('/:id/like', AuthMiddleware, PostsController.likePost);

router.post('/', AuthMiddleware, PostsController.createPost);

export default router;
