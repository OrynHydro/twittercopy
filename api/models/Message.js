const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema(
	{
		chatId: {
			type: String,
			required: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		text: { type: String, default: '' },
		img: { type: String, default: '' },
		originalMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Message',
			default: null,
		},
		perused: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Message', MessageSchema)
