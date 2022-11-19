import { Schema, model } from 'mongoose';

export const Image = new Schema({
	type: String,
	url: String,
	data: Buffer
});

export const ImageModel = model('Image', Image);
