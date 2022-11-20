import { UserModel } from '../schemas/user.schema.js';

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
