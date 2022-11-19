import { Schema, model, ObjectId } from 'mongoose';

export const UserComment = new Schema({
	author: ObjectId,
	content: {
		type: String,
		required: true
	},
	dateCreated: Date,
	comments: [UserComment]
}, {collection: 'comments'});

export const UserCommentModel = model('UserComment', UserComment);
