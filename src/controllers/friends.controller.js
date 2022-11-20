import { UserModel } from '../schemas/user.schema.js';
import getError from '../lib/errorhandler.js';

export const addFriend = async (req, res, next) => {
	const { id } = req.params;

	if(!id) return res.status(400).json({ message: 'Bad request' });

	try {
		const target = await UserModel.findById(id);
		const user = await UserModel.findById(req.user.id);

		if(!user) return res.status(401).json({ message: 'Unauthorized' });
		if(!target) return res.status(404).json({ message: 'User not found' });
		
		if(target._id.equals(user._id)) return res.status(400).json({ message: 'You cannot add yourself as a friend' });
		if(user.friends.includes(target._id)) return res.status(400).json({ message: 'You are already friends with this user' });
		if(user.pendingRequests.includes(target._id)) return res.status(400).json({ message: 'You have already sent a friend request to this user' });
		
		if(target.blockedUsers.includes(user._id)) return res.status(400).json({ message: 'You have been blocked by this user' });

		if(target.pendingRequests.includes(user._id)) {
			user.friends.push(target._id);
			target.friends.push(user._id);
			target.pendingRequests = target.pendingRequests.filter(id => !id.equals(user._id));
			user.pendingInvites = user.pendingInvites.filter(id => !id.equals(target._id));
			await user.save();
			await target.save();
			return res.status(200).json({ 
				message: 'Friend Successfully added',
				user: {
					id: target._id,
					username: target.username
				}
			});
		}

		user.pendingRequests.push(target._id);
		target.pendingInvites.push(user._id);

		await user.save();
		await target.save();

		return res.status(200).json({
			message: 'Friend request sent successfully',
			user: {
				id: target._id,
				username: target.username
			}
		});
	} catch (err) {
		return res.status(500).json({ error: getError(err) });
	}
};

export const removeFriend = async (req, res, next) => {
	const { id } = req.params;

	if(!id) return res.status(400).json({ message: 'Bad request' });

	try {
		const target = await UserModel.findById(id);
		const user = await UserModel.findById(req.user.id);

		if(!user) return res.status(401).json({ message: 'Unauthorized' });
		if(!target) return res.status(404).json({ message: 'User not found' });

		if(user.pendingRequests.includes(target._id)) {
			user.pendingRequests = user.pendingRequests.filter(id => !id.equals(target._id));
			target.pendingInvites = target.pendingInvites.filter(id => !id.equals(user._id));

			await user.save();
			await target.save();

			return res.status(200).json({
				message: 'Friend request successfully removed',
				user: {
					id: target._id,
					username: target.username
				}
			});
		}

		if(user.pendingInvites.includes(target._id)) {
			user.pendingInvites = user.pendingInvites.filter(id => !id.equals(target._id));
			target.pendingRequests = target.pendingRequests.filter(id => !id.equals(user._id));
			await user.save();
			await target.save();
			return res.status(200).json({
				message: 'Friend request successfully removed',
				user: {
					id: target._id,
					username: target.username
				}
			});
		}

		if(!user.friends.includes(target._id)) return res.status(400).json({ message: 'You are not friends with this user' });

		user.friends = user.friends.filter(id => !id.equals(target._id));
		target.friends = target.friends.filter(id => !id.equals(user._id));

		await user.save();
		await target.save();

		return res.status(200).json({
			message: 'Friend successfully removed',
			user: {
				id: target._id,
				username: target.username
			}
		});
	} catch (err) {
		return res.status(500).json({ error: getError(err) });
	}
};

export const getRequests = async (req, res, next) => {
	try {
		const user = await UserModel.findById(req.user.id);

		if(!user) return res.status(401).json({ message: 'Unauthorized' });
		return res.status(200).json({
			message: 'Friend requests successfully retrieved',
			requests: user.pendingInvites
		});
	} catch (err) {
		return res.status(500).json({ error: getError(err) });
	}
};

export const getSentRequests = async (req, res, next) => {
	try {
		const user = await UserModel.findById(req.user.id);

		if(!user) return res.status(401).json({ message: 'Unauthorized' });
		return res.status(200).json({
			message: 'Sent requests successfully retrieved',
			requests: user.pendingRequests
		});
	} catch (err) {
		return res.status(500).json({ error: getError(err) });
	}
};

export const getFriends = async (req, res, next) => {
	try {
		const user = await UserModel.findById(req.user.id);

		if(!user) return res.status(401).json({ message: 'Unauthorized' });
		return res.status(200).json({
			message: 'Friends successfully retrieved',
			friends: user.friends
		});
	} catch (err) {
		return res.status(500).json({ error: getError(err) });
	}
};
