import { Schema, model } from 'mongoose';

export const NotificationSchema = new Schema({
	type: {
		type: String,
		enum: ['friend-request', 'friend-accept', 'new-likes', 'new-comments', 'new-messages'],
		required: true
	},
	user: Schema.Types.ObjectId,
	target: Schema.Types.ObjectId,
	viewed: {
		type: Boolean,
		default: false
	}
}, { collection: 'notifications' }, { timestamps: true });

export const NotificationModel = model('Notification', NotificationSchema);
