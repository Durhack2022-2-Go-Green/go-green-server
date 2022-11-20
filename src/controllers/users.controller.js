import { UserModel } from '../schemas/user.schema.js';

import getError from '../lib/errorhandler.js';
import { NotificationModel } from '../schemas/notification.schema.js';

export const getCurrentUser = async (req, res, next) => {
	const user = await UserModel.findById(req.user.id);

	if(!user) return res.status(401).json({ message: 'Unauthorized' });

	res.status(200).json({ 
		message: 'User retrieved Successfully',
		user: {
			id: user._id,
			username: user.username
		}
	});
};

export const getUser = async (req, res, next) => {
	const { id } = req.params;

	if(!id) return res.status(400).json({ message: 'Bad request' });
	
	try {
		const user = await UserModel.findById(id);
		if(!user) throw new Error('User not found');

		return res.status(200).json({ 
			message: 'User retrieved Successfully',
			user: {
				id: user._id,
				username: user.username
			}
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
