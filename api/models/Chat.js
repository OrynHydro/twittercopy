const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema(
	{
		members: [
			{
				type: String,
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Message',
			},
		],
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Chat', ChatSchema)
