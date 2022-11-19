import { Schema, ObjectId } from 'mongoose';

import { Image } from './image.schema.js';
import { UserComment } from './usercomment.schema.js';

export const Post = new Schema({
	author: ObjectId,
	content: {
		type: String,
		required: true
	},
	points: Number,
	image: Image,
	date: Date,
	comments: [UserComment]
});
