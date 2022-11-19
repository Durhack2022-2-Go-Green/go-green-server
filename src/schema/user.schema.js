import { Schema } from 'mongoose';

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
