// importing router using ExpressJS, users and posts model

const router = require('express').Router()
const List = require('../models/List')
const Post = require('../models/Post')
const User = require('../models/User')

// create post
router.post('/', async (req, res) => {
	const newPost = await new Post(req.body)
	try {
		const savedPost = await newPost.save()
		res.status(200).json(savedPost)
	} catch (err) {
		res.status(500).json(err)
	}
})

// update post
router.put('/:id/update', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (req.body.replyId) {
			await post.updateOne({
				$pull: { replies: req.body.replyId },
			})
		}

		await post.updateOne({ $set: req.body })

		res.status(200).json('Post has been updated')
	} catch (err) {
		res.status(500).json(err)
	}
})

// delete post
router.delete('/:id/delete', async (req, res) => {
	try {
		await Post.deleteOne({ _id: req.params.id })
		res.status(200).json('Post deleted')
	} catch (err) {
		res.status(500).json(err)
	}
})

// like/unlike post
router.put('/:id/like', async (req, res) => {
	try {
		const user = await User.findById(req.body.userId)
		const post = await Post.findById(req.params.id)
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } })
			res.status(200).json('Post has been liked')
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } })
			res.status(200).json('Post has been unliked')
		}
	} catch (err) {
		res.status(500).json(err)
	}
})

// get post
router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
			.populate('user')
			.populate('originalPost')
		res.status(200).json(post)
	} catch (err) {
		res.status(500).json(err)
	}
})

// get all user's posts
router.get('/allUserPosts/:userId', async (req, res) => {
	try {
		const user = await User.findOne({ userId: '@' + req.params.userId })
			.populate('retweets')
			.populate({
				path: 'retweets',
				populate: { path: 'user' },
			})
		const posts = await Post.find({
			userId: user._id,
		}).populate('user')
		posts.push(...user.retweets)
		res.status(200).json(posts)
	} catch (err) {
		res.status(500).json(err)
	}
})

// get timeline
router.get('/timeline/:userId', async (req, res) => {
	try {
		const user = await User.findOne({ userId: '@' + req.params.userId })

		const followingIds = user.following

		const followingPosts = await Post.find({
			userId: { $in: followingIds },
			originalPost: null,
		})
			.populate('user')
			.sort({ createdAt: -1 })

		res.status(200).json(followingPosts)
	} catch (err) {
		res.status(500).json(err)
	}
})

// reply to a post
router.put(`/:postDbId/reply/:userDbId`, async (req, res) => {
	try {
		const originalPost = await Post.findByIdAndUpdate(req.params.postDbId, {
			$push: { replies: req.body.replyId },
		})

		const currentUser = await User.findByIdAndUpdate(req.params.userDbId)

		res.status(200).json([originalPost, currentUser])
	} catch (err) {
		res.status(500).json(err)
	}
})

// get post with replies
router.get(`/replies/:originalPostId`, async (req, res) => {
	try {
		const originalPostId = req.params.originalPostId

		const post = await Post.findById(originalPostId).populate('user')

		const populatedReplies = await Promise.all(
			post.replies.map(async replyId => {
				const reply = await Post.findById(replyId).populate('user')
				return reply
			})
		)
		post.replies = populatedReplies

		res.status(200).json(post)
	} catch (err) {
		res.status(500).json(err)
	}
})

// retweet post
router.put('/:postId/retweet', async (req, res) => {
	const postId = req.params.postId
	const userDbId = req.body.userDbId
	try {
		const user = await User.findById(userDbId)
		if (user.retweets.includes(postId)) {
			await user.updateOne({ $pull: { retweets: postId } })
			res.status(200).json('Retweet removed')
		} else {
			await user.updateOne({ $push: { retweets: postId } })
			res.status(200).json('Retweeted')
		}
	} catch (err) {
		res.status(500).json(err)
	}
})

module.exports = router
