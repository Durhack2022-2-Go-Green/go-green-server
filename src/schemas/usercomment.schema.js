import { Schema, model, ObjectId } from 'mongoose';

export const UserComment = new Schema({
	author: ObjectId,
	content: {
		type: String,
		required: true
	},
	comments: [UserComment]
}, {collection: 'comments'}, { timestamps: true });

export const UserCommentModel = model('UserComment', UserComment);
