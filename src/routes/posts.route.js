import { Router } from 'express';
import * as PostsController from '../controllers/posts.controller.js';

const router = Router();

router.get('/', PostsController.getPosts);

router.get('/:id', PostsController.getPost);

router.post('/', PostsController.createPost);

export default router;
