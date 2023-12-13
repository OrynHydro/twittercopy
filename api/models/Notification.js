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
			enum: ['login', 'follow', 'like', 'reply', 'retweet'],
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

NotificationSchema.index(
	{ createdAt: 1 },
	{ expireAfterSeconds: 7 * 24 * 60 * 60 }
)

module.exports = mongoose.model('Notification', NotificationSchema)
