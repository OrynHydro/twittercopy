const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			default: null,
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		type: {
			type: String,
			enum: [
				'login',
				'mention',
				'message',
				'follow',
				'like',
				'reply',
				'retweet',
				'quote',
			],
			required: true,
		},
		perused: {
			type: Boolean,
			default: false,
		},
		location: {
			type: String,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
			default: null,
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Notification', NotificationSchema)
