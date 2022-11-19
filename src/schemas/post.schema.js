import { Schema, model, ObjectId } from 'mongoose';

import { Image } from './image.schema.js';
import { UserComment } from './usercomment.schema.js';

export const Post = new Schema({
	author: ObjectId,
	content: {
		type: String,
		required: true
	},
	points: [ObjectId],
	image: Image,
	comments: [UserComment]
}, {collection: 'posts'}, { timestamps: true });

export const PostModel = model('Post', Post);
