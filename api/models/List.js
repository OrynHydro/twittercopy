// importing mongoose library - helps in binding MongoDB cluster and exact server

const mongoose = require('mongoose')

// MongoDB model for posts

const ListSchema = new mongoose.Schema(
	{
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		followers: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		name: {
			type: String,
			maxLength: 25,
			required: true,
		},
		desc: {
			type: String,
			maxLength: 100,
			default: '',
		},
		isPrivate: {
			type: Boolean,
			default: false,
		},
		coverPicture: {
			type: String,
			default: 'defaultListCover.png',
		},
	},
	{ timestamps: true }
)

// export posts model

module.exports = mongoose.model('List', ListSchema)
