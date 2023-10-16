// importing mongoose library - helps in binding MongoDB cluster and exact server

const mongoose = require('mongoose')

// MongoDB model for posts

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			max: 50,
			unique: true,
		},
		userId: {
			type: String,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			max: 50,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			min: 8,
		},
		profilePicture: {
			type: String,
			default: '',
		},
		coverPicture: {
			type: String,
			default: '',
		},
		followers: {
			type: Array,
			default: [],
		},
		following: {
			type: Array,
			default: [],
		},
		bio: {
			type: String,
			max: 160,
		},
		website: {
			type: String,
			max: 100,
		},
		location: {
			type: String,
			max: 30,
		},
		birth: {
			type: String,
		},
		token: {
			type: String,
			required: true,
		},
		pinnedPost: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},
		pinnedLists: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'List',
			},
		],
	},
	{ timestamps: true }
)

// export users model

module.exports = mongoose.model('User', UserSchema)
