import { Schema, model } from 'mongoose';
import { ImageSchema } from './image.schema.js';

import { hashPassword, comparePassword } from '../lib/crypto.js';

export const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		require: 'Name is required',
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	forename: {
		type: String,
		required: true,
	},
	surname: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true
	},
	profilePicture: ImageSchema,
	bannerPicture: ImageSchema,
	points: {
		type: Number,
		default: 0
	},
	friends: {
		type: Array, 
		default: []
	},
	pendingInvites: {
		type: Array,
		default: []
	},
	pendingRequests: {
		type: Array,
		default: []
	},
	blockedUsers: {
		type: Array,
		default: []
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	desc: {
		type: String,
		default: '',
		max: 256
	},
	from: {
		type: String,
		default: '',
		max: 50
	},
	country: {
		type: String,
		default: '',
		max: 64
	}
}, {collection: 'users'}, { timestamps: true });

UserSchema.pre('save', async function(next) {
	let user = this;

	if (!user.isModified('password')) return next();

	user.password = await hashPassword(user.password);
	next();
});

UserSchema.methods = {
	authenticateUser: async function(plaintextPassword) {    //basic jw authentication
		return await comparePassword(plaintextPassword, this.password);
	}
};

export const UserModel = model('User', UserSchema);
