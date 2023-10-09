// importing router using ExpressJS, users and posts model, and bcrypt

const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')
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
		const { password, updatedAt, ...other } = user?._doc
		res.status(200).json(other)
	} catch (err) {
		res.status(500).json(err)
	}
})

// get user by email

router.get('/findByEmail/:email', async (req, res) => {
	try {
		const user = await User.find({ email: req.params.email })
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
router.get('/userLikedPosts/:dbId', async (req, res) => {
	const userId = req.params.dbId
	try {
		const user = await User.findById(userId)

		const likedPostsWithAuthors = await Post.find({
			_id: { $in: user.likedPosts },
		})
			.sort({ createdAt: -1 })
			.populate('user')

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

		// Для каждого поста в массиве postsWithUserReplies, выполните populate('replies.user')
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
		res.status(200).json(postsWithMedia)
	} catch (err) {
		res.status(500).json(err)
	}
})

module.exports = router
