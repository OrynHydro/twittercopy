// importing mongoose library - helps in binding MongoDB cluster and exact server

const mongoose = require('mongoose')

// MongoDB model for posts

const PostSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			max: 500,
			default: '',
		},
		img: [
			{
				type: String,
			},
		],
		likes: {
			type: Array,
			default: [],
		},
		replies: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
		retweets: {
			type: Array,
			default: [],
		},
		views: {
			type: Number,
			default: 0,
		},
		shares: {
			type: Array,
			default: [],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		originalPost: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
			default: null,
		},
	},
	{ timestamps: true }
)

// export posts model

module.exports = mongoose.model('Post', PostSchema)
