import { Schema, model } from 'mongoose';

export const ImageSchema = new Schema({
	type: String,
	url: String,
	data: Buffer
});

export const ImageModel = model('Image', ImageSchema);
