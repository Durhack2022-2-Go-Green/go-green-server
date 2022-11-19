import { Schema, model } from 'mongoose';

import { ImageSchema } from './image.schema.js';
import { CommentSchema } from './comment.schema.js';

export const PostSchema = new Schema({
	authorId: {
		type: Schema.Types.ObjectId,
		ref: 'users',
	},
	content: {
		type: String,
		required: true
	},
	points: {
		type: Array,
		default: []
	},
	image: ImageSchema,
	comments: [CommentSchema]
}, {collection: 'posts'}, { timestamps: true });

export const PostModel = model('Post', PostSchema);
