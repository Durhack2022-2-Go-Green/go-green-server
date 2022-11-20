import { UserModel } from '../schemas/user.schema.js';

import getError from '../lib/errorhandler.js';
import { NotificationModel } from '../schemas/notification.schema.js';

export const getCurrentUser = async (req, res, next) => {
	const user = await UserModel.findById(req.user.id, { password: 0, __v: 0 });

	if(!user) return res.status(401).json({ message: 'Unauthorized' });

	res.status(200).json({ 
		message: 'User retrieved Successfully',
		user: user
	});
};

export const getUser = async (req, res, next) => {
	const { id } = req.params;

	if(!id) return res.status(400).json({ message: 'Bad request' });
	
	try {
		const user = await UserModel.findById(id, { password: 0, __v: 0, isAdmin: 0, pendingInvites: 0, pendingRequests: 0, blockedUsers: 0});
		if(!user) throw new Error('User not found');

		return res.status(200).json({ 
			message: 'User retrieved Successfully',
			user: user
		});
	} catch (err) {
		return res.status(404).json({ message: 'User not found' });
	}	
};

export const getNotifications = async (req, res, next) => {
	const notifications = await NotificationModel.find({ user: req.user.id }).sort({ updatedAt: -1 });

	const offset = parseInt(req.query.offset) || 0;
	const limit = parseInt(req.query.limit) || 20;

	const paginatedNotifications = notifications.slice(offset, offset + limit);

	res.status(200).json({
		notifications: paginatedNotifications,
	});
};

export const dismissNotification = async (req, res, next) => {
	const { id } = req.params;

	if(!id) return res.status(400).json({ message: 'Bad request' });

	const notification = await NotificationModel.findById(id);
	if (notification === undefined) {
		res.status(404).json({ message: 'Notification not found' });
	} else {
		notification.viewed = true;
		notification.save((err, dat) => {
			if(err) return res.status(400).json({ error: getError(err) });
			res.status(201).json({ message: 'Notification dismissed', notification: dat});
		});
	}
};

export const blockUser = async (req, res, next) => {
	const { id } = req.params;
	if(!id) return res.status(400).json({ message: 'Bad request' });

	try {
		const target = await UserModel.findById(id);
		const user = await UserModel.findById(req.user.id);

		if(!user) return res.status(401).json({ message: 'Unauthorized' });
		if(!target) return res.status(404).json({ message: 'User not found' });

		if(user.blockedUsers.includes(target._id)) {
			user.blockedUsers = user.blockedUsers.filter(id => !id.equals(target._id));
			user.save();

			return res.status(200).json({
				message: 'User successfully unblocked',
				user: {
					id: target._id,
					username: target.username
				}
			});
		}

		if(user.friends.includes(target._id)) {
			user.friends = user.friends.filter(id => !id.equals(target._id));
			target.friends = target.friends.filter(id => !id.equals(user._id));
		}
		if(user.pendingRequests.includes(target._id) || user.pendingInvites.includes(target._id)) {
			user.pendingRequests = user.pendingRequests.filter(id => !id.equals(target._id));
			user.pendingInvites = user.pendingInvites.filter(id => !id.equals(target._id));
			target.pendingRequests = target.pendingRequests.filter(id => !id.equals(user._id));
			target.pendingInvites = target.pendingInvites.filter(id => !id.equals(user._id));
		}

		user.blockedUsers.push(target._id);
		await user.save();
		await target.save();

		return res.status(200).json({
			message: 'User blocked successfully',
			user: {
				id: target._id,
				username: target.username
			}
		});
	} catch (err) {
		return res.status(500).json({ error: getError(err) });
	}
};

export const updateUser = async (req, res, next) => {
	const user = await UserModel.findById(req.user.id);

	if (!user) return res.status(404).json({ message: 'User not found' });

	for (const updatedEntry of req.body.update) {
		switch (updatedEntry.key) {
		case 'country':
			user.country = updatedEntry.value;
			break;
		case 'desc':
			user.desc = updatedEntry.value;
			break;
		case 'from':
			user.from = updatedEntry.value;
			break;
		case 'bannerPicture':
			user.bannerPicture = updatedEntry.value;
			break;
		case 'profilePicture':
			user.profilePicture = updatedEntry.value;
			break;
		case 'password':
			user.password = updatedEntry.value;
			break;
		default:
			break;
		}
	}

	user.save((err, dat) => {
		if(err) return res.status(400).json({ error: getError(err) });
		res.status(201).json({ message: 'User updated', user: dat});
	});
};
