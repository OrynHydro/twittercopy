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
			type: String,
			default: '',
		},
		pinnedLists: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'List',
			},
		],
		pinnedChats: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Chat',
				},
			],
			validate: {
				validator: function (array) {
					return array.length <= 5
				},
				message: 'Max amount of pinned chats - 5.',
			},
		},
		bookmarks: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Post',
			},
		],
		notifications: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Notification',
			},
		],
	},
	{ timestamps: true }
)

// export users model

module.exports = mongoose.model('User', UserSchema)
