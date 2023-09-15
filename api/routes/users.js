// importing router using ExpressJS, users and posts model, and bcrypt

const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcrypt')

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
		const user = await User.findOneAndUpdate(
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
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id)
			const currentUser = await User.findById(req.body.userId)

			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({ $push: { followers: req.body.userId } })
				await currentUser.updateOne({ $push: { following: req.params.id } })
				res.status(200).json('user has been followed')
			} else {
				res.status(403).json('You already follow this user')
			}
		} catch (err) {
			res.status(500).json(err)
		}
	} else {
		res.status(403).json('You cant follow yourself')
	}
})

// unfollow user

router.put('/:id/unfollow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id)
			const currentUser = await User.findById(req.body.userId)

			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({ $pull: { followers: req.body.userId } })
				await currentUser.updateOne({ $pull: { followings: req.params.id } })
				res.status(200).json('user has been unfollowed')
			} else {
				res.status(403).json('You all ready unfollow this user')
			}
		} catch (err) {
			res.status(500).json(err)
		}
	} else {
		res.status(403).json('You cant unfollow yourself')
	}
})

// get followings
router.get('/followings/:userId', async (req, res) => {
	try {
		const user = await User.findById(req.params.userId)
		const followings = await Promise.all(
			user.following.map(followingId => {
				return User.findById(followingId)
			})
		)
		let followingList = []
		followings.map(user => {
			const {
				_id,
				username,
				profilePicture,
				userId,
				followers,
				following,
				bio,
			} = user
			followingList.push({
				_id,
				username,
				profilePicture,
				followers,
				following,
				userId,
				bio,
			})
		})
		res.status(200).json(followingList)
	} catch (err) {
		res.status(500).json(err)
	}
})

// get followers
router.get('/followers/:userId', async (req, res) => {
	try {
		const user = await User.findById(req.params.userId)
		const followers = await Promise.all(
			user.followers.map(followerId => {
				return User.findById(followerId)
			})
		)
		let followersList = []
		followers.map(follower => {
			const {
				_id,
				username,
				profilePicture,
				followers,
				following,
				userId,
				bio,
			} = follower
			followersList.push({
				_id,
				username,
				profilePicture,
				followers,
				following,
				userId,
				bio,
			})
		})
		res.status(200).json(followersList)
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

// export users router

module.exports = router
