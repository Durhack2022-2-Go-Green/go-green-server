import { Schema, model } from 'mongoose';

export const User = new Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	dateCreated: {
		type: Date,
		required: true
	}
});

const UserModel = model('User', User);

export function addUser(username, plaintextPassword) {
	const user = new UserModel({
		username,
		password: plaintextPassword,
		dateCreated: new Date()
	});
	return user.save();
}

export function getUser(username) {
	return UserModel.findOne({ username });
}
