import jsonwebtoken from 'jsonwebtoken';

import { UserModel } from '../schemas/user.schema.js';
import getError from '../lib/errorhandler.js';

export const getCurrentUser = async (req, res, next) => {
	res.status(501).json({ message: 'Not implemented' });
};

export const login = async (req, res, next) => {
	const user = await UserModel.findOne({username: req.body.username});

	// TODO: add guard clauses to validate data to user schema
	try {
		if(!user) return res.status(401).json({error: 'Incorrect username or password'});
		if(!user.authenticateUser(res.body.password)) return res.status(401).json({error: 'Incorrect username or password'});

		const token = jsonwebtoken.sign({
			id: user._id
		}, process.env.JWT_SECRET, {
			expiresIn: '1d'
		});

		res.cookie('authorization', token, {
			expire: new Date() + 86400,
			httpOnly: true,
			secure: true
		});

		res.status(200).json({
			message: 'Login successful',
			authentication: token,
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

	const user = new UserModel(
		req.body
	);

	user.save((err, res) => {
		if(err) return res.status(500).json({ error: getError(err) });
		res.status(201).json({ message: 'User created', user: res});
	});

};

export const logout = async (req, res, next) => {
	res.clearCookie('authorization');
	res.status(200).json({ message: 'Logged out' });
};
