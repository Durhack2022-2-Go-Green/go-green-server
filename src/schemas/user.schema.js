import { Schema, model } from 'mongoose';
import { Image } from './image.schema.js';

import { hashPassword, comparePassword } from './lib/crypto.js';

export const User = new Schema({
	username: {
		type: String,
		required: true,
		require: 'Name is required',
		unique: 'Username already exists'
	},
	password: {
		type: String,
		required: true
	},
	dateCreated: {
		type: Date,
		required: true
	},
	profilePicture: Image,
	friends: {
		type: Array, 
		default: []
	},
	pendingInvites:{
		type: Array,
		default: []
	},
	pendingRequests:{
		type: Array,
		default: []
	},
	blockedUsers:{
		type: Array,
		default: []
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	desc:{
		type: String,
		default: '',
		max: 256
	},
	city:{
		type: String,
		default: '',
		max: 50
	},
	from:{
		type: String,
		default: '',
		max: 50
	}
}, {collection: 'users'}, { timestamps: true });

User.pre('save', async function(next) {
	let user = this;

	if (!user.isModified('password')) return next();

	user.password = await hashPassword(user.password);
	next();
});

User.methods = {
	authenticateUser: async function(plaintextPassword) {    //basic jw authentication
		return await comparePassword(plaintextPassword, this.password);
	}
};

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
