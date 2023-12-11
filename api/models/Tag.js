const mongoose = require('mongoose')

const TagSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		max: 50,
		unique: true,
	},
	users: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},
	],
	lists: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'List',
		},
	],
})

module.exports = mongoose.model('Tag', TagSchema)
