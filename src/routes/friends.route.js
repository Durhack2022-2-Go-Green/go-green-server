import { Router } from 'express';

import * as FriendsController from '../controllers/friends.controller.js';

const router = Router();

router.get('/', FriendsController.getFriends);

router.post('/:id', FriendsController.addFriend);
router.delete('/:id', FriendsController.removeFriend);

router.get('/requests', FriendsController.getRequests);
router.get('/requests/sent', FriendsController.getSentRequests);

export default router;
