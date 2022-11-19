import { Schema, model } from 'mongoose';

export const CommentSchema = new Schema({
	authorId: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	replies: [{type: Schema.Types.ObjectId, ref: 'comments'}]
}, {collection: 'comments'}, { timestamps: true });

export const CommentModel = model('Comment', CommentSchema);
