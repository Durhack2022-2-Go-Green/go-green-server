import { UserModel } from '../schemas/user.schema.js';

import getError from '../lib/errorhandler.js';

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

export const updateUser = async (req, res, next) => {
	const user = UserModel.findById(req.user.id);

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
