import { Router } from 'express';
import * as PostsController from '../controllers/posts.controller.js';

const router = Router();

router.get('/', PostsController.getPosts);

export default router;
