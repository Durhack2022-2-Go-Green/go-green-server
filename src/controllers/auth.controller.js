import jsonwebtoken from 'jsonwebtoken';

import { UserModel } from '../schemas/user.schema.js';
import getError from '../lib/errorhandler.js';

export const login = async (req, res, next) => {
	const user = await UserModel.findOne({username: req.body.username});
	try {
		if(!(req.body.password && user)) return res.status(401).json({message: 'Incorrect username or password'});
		if(!(await user.authenticateUser(req.body.password))) return res.status(401).json({message: 'Incorrect username or password'});

		const token = jsonwebtoken.sign({
			id: user._id
		}, process.env.JWT_SECRET, {
			expiresIn: '1d'
		});

		res.cookie('authorization', token, {
			expire: new Date() + 86400,
			httpOnly: true,
			secure: false
		});

		res.status(200).json({
			message: 'Login successful',
			//authentication: token,
			user: {
				id: user._id,
				username: user.username,
			}
		});
	} catch (error) {
		return  res.status(500).json({error: getError(error)});
	}

};

export const createUser = async (req, res, next) => {
	// not sure if mongoose handles data validation
	// TODO: validate data if not already done by mongoose

	const user = new UserModel({
		username: req.body.username,
		password: req.body.password,
	});

	user.save((err, dat) => {
		if(err) return res.status(400).json({ error: getError(err) });
		res.status(201).json({ message: 'User created', user: dat});
	});

};

export const logout = async (req, res, next) => {
	res.clearCookie('authorization');
	res.status(200).json({ message: 'Logged out' });
};
