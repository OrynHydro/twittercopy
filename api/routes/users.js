// importing router using ExpressJS, users and posts model, and bcrypt

const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')
const Chat = require('../models/Chat')
const Message = require('../models/Message')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

// update user
router.put('/:userId/update', async (req, res) => {
	if (req.body.password) {
		try {
			const salt = await bcrypt.genSalt(10)
			req.body.password = await bcrypt.hash(req.body.password, salt)
		} catch (err) {
			res.status(500).json(err)
		}
	}
	console.log(req.body)
	try {
		await User.findOneAndUpdate(
			{ userId: req.params.userId },
			{
				$set: req.body,
			}
		)
		res.status(200).json('Account has been updated')
	} catch (err) {
		res.status(500).json(err)
	}
})

// get user by token
router.get('/findByToken/:token', async (req, res) => {
	try {
		const user = await User.findOne({ token: req.params.token })
			.populate({
				path: 'pinnedLists',
				populate: { path: 'creator' },
			})
			.populate({
				path: 'pinnedChats',
				populate: { path: 'members' },
			})
			.populate({
				path: 'pinnedChats',
				populate: { path: 'messages' },
			})
			.populate('notifications')
			.populate({
				path: 'notifications',
				populate: { path: 'post' },
			})
			.populate({
				path: 'notifications',
				populate: { path: 'post', populate: { path: 'user' } },
			})
			.populate({
				path: 'notifications',
				populate: { path: 'sender' },
			})

		const { password, updatedAt, ...other } = user?._doc
		res.status(200).json(other)
	} catch (err) {
		res.status(500).json(err)
	}
})

// get user by email

router.get('/findByEmail/:email', async (req, res) => {
	try {
		const user = await User.find({ email: req.params.email }).populate(
			'notifications'
		)
		res.status(200).json(user)
	} catch (err) {
		res.status(500).json(err)
	}
})

// get user by userId

router.get('/findById/:userId', async (req, res) => {
	try {
		const user = await User.findOne({ userId: req.params.userId })
		const { password, updatedAt, ...other } = user?._doc
		res.status(200).json(other)
	} catch (err) {
		res.status(500).json(err)
	}
})

// delete user

router.delete('/:id', async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			await User.findByIdAndDelete(req.params.id)
			res.status(200).json('Account has been deleted')
		} catch (err) {
			res.status(500).json(err)
		}
	} else {
		res.status(403).json('You can delete only your account!')
	}
})

// get user by db id

router.get('/findByDbId/:id', async (req, res) => {
	const userId = req.params.id
	try {
		const user = await User.findById(userId)
		const { password, updatedAt, ...other } = user._doc
		res.status(200).json(other)
	} catch (err) {
		res.status(500).json(err)
	}
})

// find user by email

router.get('/findByEmail/:email', async (req, res) => {
	try {
		const user = await User.find({ email: req.params.email })
		res.status(200).json(user)
	} catch (err) {
		res.status(500).json(err)
	}
})

// follow user

router.put('/:id/follow', async (req, res) => {
	const userId = req.body.userId
	const targetUserId = req.params.id

	if (userId === targetUserId) {
		return res.status(403).json("You can't follow yourself")
	}

	try {
		const user = await User.findById(targetUserId)
		const currentUser = await User.findById(userId)

		if (
			!user.followers.includes(userId) &&
			!currentUser.following.includes(targetUserId)
		) {
			await Promise.all([
				user.updateOne({ $push: { followers: userId } }),
				currentUser.updateOne({ $push: { following: targetUserId } }),
			])

			return res.status(200).json('User has been followed')
		} else {
			return res.status(403).json('You already follow this user')
		}
	} catch (err) {
		return res.status(500).json(err)
	}
})

// unfollow user

router.put('/:id/unfollow', async (req, res) => {
	const userId = req.body.userId
	const targetUserId = req.params.id

	if (userId === targetUserId) {
		return res.status(403).json("You can't unfollow yourself")
	}

	try {
		const user = await User.findById(targetUserId)
		const currentUser = await User.findById(userId)

		if (
			user.followers.includes(userId) &&
			currentUser.following.includes(targetUserId)
		) {
			await Promise.all([
				user.updateOne({ $pull: { followers: userId } }),
				currentUser.updateOne({ $pull: { following: targetUserId } }),
			])

			return res.status(200).json('User has been unfollowed')
		} else {
			return res.status(403).json('You have already unfollowed this user')
		}
	} catch (err) {
		return res.status(500).json(err)
	}
})

// get followings
router.get('/followings/:userId', async (req, res) => {
	try {
		const user = await User.findById(req.params.userId)
		const following = await User.find(
			{ _id: { $in: user.following } },
			{
				_id: 1,
				username: 1,
				profilePicture: 1,
				followers: 1,
				following: 1,
				userId: 1,
				bio: 1,
			}
		)
		res.status(200).json(following)
	} catch (err) {
		res.status(500).json(err)
	}
})

// get followers
router.get('/followers/:userId', async (req, res) => {
	try {
		const user = await User.findById(req.params.userId)
		const followers = await User.find(
			{ _id: { $in: user.followers } },
			{
				_id: 1,
				username: 1,
				profilePicture: 1,
				followers: 1,
				following: 1,
				userId: 1,
				bio: 1,
			}
		)
		res.status(200).json(followers)
	} catch (err) {
		res.status(500).json(err)
	}
})

// get user's liked posts
router.get('/userLikedPosts/:userDbId', async (req, res) => {
	const userId = req.params.userDbId
	try {
		const likedPostsWithAuthors = await Post.find({
			likes: { $in: userId },
		})
			.sort({ createdAt: -1 })
			.populate('user')

		const user = await User.findById(req.params.userDbId)
		if (user.pinnedPost.length > 0) {
			const pinnedPost = await Post.findById(user.pinnedPost)
			pinnedPost.user = user
			likedPostsWithAuthors.unshift(pinnedPost)
		}

		res.status(200).json(likedPostsWithAuthors)
	} catch (err) {
		res.status(500).json(err)
	}
})

// get user's replies with original posts
router.get('/userReplies/:userId', async (req, res) => {
	const userId = new mongoose.Types.ObjectId(req.params.userId)
	try {
		const postsWithUserReplies = await Post.find({
			replies: {
				$in: await Post.find({ userId }).distinct('_id'),
			},
		}).populate('user')

		for (const post of postsWithUserReplies) {
			await post.populate({ path: 'replies', populate: { path: 'user' } })
		}

		res.status(200).json(postsWithUserReplies)
	} catch (error) {
		res.status(500).json(error)
	}
})

// get user posts with media
router.get(`/media/:userDbId`, async (req, res) => {
	try {
		const postsWithMedia = await Post.find({
			userId: req.params.userDbId,
			img: { $ne: [] },
			originalPost: null,
		}).populate('user')
		const user = await User.findById(req.params.userDbId)
		if (user.pinnedPost.length > 0) {
			const pinnedPost = await Post.findById(user.pinnedPost)
			pinnedPost.user = user
			postsWithMedia.unshift(pinnedPost)
		}

		res.status(200).json(postsWithMedia)
	} catch (err) {
		res.status(500).json(err)
	}
})

// pin post
router.put('/pinPost/:userDbId', async (req, res) => {
	try {
		const user = await User.findById(req.params.userDbId)
		if (user.pinnedPost !== req.body.postId) {
			await user.updateOne({
				pinnedPost: req.body.postId,
			})
			res.status(200).json('Pinned')
		} else {
			await user.updateOne({
				pinnedPost: null,
			})
			res.status(200).json('Unpinned')
		}
	} catch (err) {
		res.status(500).json(err)
	}
})

// pin list
router.put('/pinList/:userDbId', async (req, res) => {
	try {
		const user = await User.findById(req.params.userDbId)
		if (!user.pinnedLists.includes(req.body.listId)) {
			await user.updateOne({
				$push: { pinnedLists: req.body.listId },
			})
			res.status(200).json('Pinned')
		} else {
			await user.updateOne({
				$pull: { pinnedLists: req.body.listId },
			})
			res.status(200).json('Unpinned')
		}
	} catch (err) {
		res.status(500).json(err)
	}
})

// find users by text
router.get('/findByText/:userDbId', async (req, res) => {
	const searchText = req.query.text
	const userDbId = req.params.userDbId

	const foundUsers = await User.find({
		username: { $regex: new RegExp(searchText, 'i') },
		_id: { $ne: userDbId },
	}).exec()

	if (foundUsers.length === 0) {
		return res.status(200).json('No matches')
	}

	// for (const user of foundUsers) {
	// 	await user.populate('creator followers')
	// }

	res.status(200).json(foundUsers)
})

// find user's chats with people
router.get('/findChats/:userDbId/people', async (req, res) => {
	try {
		const searchText = req.query.text
		const userDbId = req.params.userDbId
		const chats = await Chat.find({ members: { $in: userDbId } })
			.populate('members')
			.populate('messages')
		const filteredChats = chats.filter(chat => chat.members.length === 2)
		const filteredChatsWithText = filteredChats.filter(chat =>
			chat.members.some(
				member =>
					member._id.equals(new mongoose.Types.ObjectId(userDbId)) === false &&
					(member.userId.match(new RegExp(searchText, 'i')) ||
						member.username.match(new RegExp(searchText, 'i')))
			)
		)
		res.status(200).json(filteredChatsWithText)
	} catch (err) {
		res.status(500).json(err)
	}
})

// find user's groups with certain persons
router.get('/findChats/:userDbId/groups', async (req, res) => {
	try {
		const searchText = req.query.text
		const userDbId = req.params.userDbId
		const chats = await Chat.find({ members: { $in: userDbId } })
			.populate('members')
			.populate('messages')
		const filteredChats = chats.filter(chat => chat.members.length > 2)
		const filteredChatsWithText = filteredChats.filter(chat =>
			chat.members.some(
				member =>
					member._id.equals(new mongoose.Types.ObjectId(userDbId)) === false &&
					(member.userId.match(new RegExp(searchText, 'i')) ||
						member.username.match(new RegExp(searchText, 'i')))
			)
		)
		res.status(200).json(filteredChatsWithText)
	} catch (err) {
		res.status(500).json(err)
	}
})

// find message with text in user's chats
router.get('/findChats/:userDbId/messages', async (req, res) => {
	try {
		const searchText = req.query.text
		const userDbId = req.params.userDbId
		const chats = await Chat.find({ members: { $in: userDbId } })
			.populate('members')
			.populate('messages')

		const chatIds = chats.map(chat => chat._id)

		const messages = await Message.find({
			chatId: { $in: chatIds },
			text: { $regex: new RegExp(searchText, 'i') },
		}).populate('sender')

		const getChatForMessage = async message => {
			const chat = await Chat.findById(message.chatId)
				.populate('members')
				.populate('messages')

			message = message.toObject()

			message.chat = chat

			return message
		}

		const messagesWithChats = await Promise.all(messages.map(getChatForMessage))

		res.status(200).json(messagesWithChats)
	} catch (err) {
		res.status(500).json(err)
	}
})

// pin chat
router.put('/pinChat/:userDbId', async (req, res) => {
	try {
		const user = await User.findById(req.params.userDbId)
		if (!user.pinnedChats.includes(req.body.chatId)) {
			await user.updateOne({
				$push: { pinnedChats: req.body.chatId },
			})
			res.status(200).json('Pinned')
		} else {
			await user.updateOne({
				$pull: { pinnedChats: req.body.chatId },
			})
			res.status(200).json('Unpinned')
		}
	} catch (err) {
		res.status(500).json(err)
	}
})

// add post to bookmarks
router.put('/bookmarks/:userDbId', async (req, res) => {
	const userDbId = req.params.userDbId
	const postId = req.body.postId
	try {
		const user = await User.findById(userDbId)

		if (!user.bookmarks.includes(postId)) {
			await user.updateOne({
				$push: { bookmarks: postId },
			})
			res.status(200).json('Added')
		} else {
			await user.updateOne({
				$pull: { bookmarks: postId },
			})
			res.status(200).json('Removed')
		}
	} catch (error) {
		res.status(500).json(error)
	}
})

// remove all bookmarks
router.put('/bookmarks/:userDbId/clear', async (req, res) => {
	const userDbId = req.params.userDbId
	try {
		await User.findByIdAndUpdate(userDbId, { bookmarks: [] })
		res.status(200).json('Bookmarks cleared')
	} catch (error) {
		res.status(500).json(error)
	}
})

// get user's bookmarks
router.get('/bookmarks/:userDbId', async (req, res) => {
	const userDbId = req.params.userDbId
	try {
		const bookmarks = await Post.find({
			_id: { $in: (await User.findById(userDbId)).bookmarks },
		}).populate('user')
		res.status(200).json(bookmarks)
	} catch (error) {
		res.status(500).json(error)
	}
})

// change user tags
router.put('/:userDbId/tags', async (req, res) => {
	try {
		await User.findByIdAndUpdate(
			req.params.userDbId,
			{
				$set: { tags: req.body.tags },
			},
			{ new: true }
		)
		res.status(200).json('Account has been updated')
	} catch (err) {
		res.status(500).json(err)
	}
})

module.exports = router
