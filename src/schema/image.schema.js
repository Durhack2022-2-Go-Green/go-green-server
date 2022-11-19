import { Schema } from 'mongoose';

export const Image = new Schema({
	type: String,
	url: String,
	data: Buffer
});
