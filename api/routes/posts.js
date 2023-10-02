// importing router using ExpressJS, users and posts model

const router = require('express').Router()
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
			await user.updateOne({ $push: { likedPosts: post._id } })
			res.status(200).json('Post has been liked')
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } })
			await user.updateOne({ $pull: { likedPosts: post._id } })
			res.status(200).json('Post has been unliked')
		}
	} catch (err) {
		res.status(500).json(err)
	}
})

// get post
router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id).populate('user')
		res.status(200).json(post)
	} catch (err) {
		res.status(500).json(err)
	}
})

// retweet/remove retweet post
router.put('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (post.userId !== req.body.userId) {
			if (!post.retweets.includes(req.body.userId)) {
				await post.updateOne({ $push: { retweets: req.body.userId } })
				res.status(200).json('The post has been retweeted')
			} else {
				await post.updateOne({ $pull: { retweets: req.body.userId } })
				res.status(200).json("The post's retweet has been removed")
			}
		} else {
			res.status(403).json("You can't retweet your post")
		}
	} catch (err) {
		res.status(500).json(err)
	}
})

// get all user's posts
router.get('/allUserPosts/:userId', async (req, res) => {
	try {
		const user = await User.findOne({ userId: '@' + req.params.userId })
		const posts = await Post.find({ userId: user._id })
		// const retweetedPosts = await Post.find({ retweets: [user._id, ...anotherRetweets] })
		res.status(200).json(posts)
	} catch (err) {
		res.status(500).json(err)
	}
})

// get timeline
router.get('/timeline/:userId', async (req, res) => {
	try {
		const user = await User.findOne({ userId: '@' + req.params.userId })

		const followingPostsAuthor = []
		const followingPostsArr = []
		const sortedPosts = []

		await Promise.all(
			user.following.map(async followingId => {
				const followingPosts = await Post.find({ userId: followingId })
				const followingUser = await User.findById(followingId)

				followingPostsArr.push(followingPosts)
				followingPostsAuthor.push(followingUser)
			})
		)

		followingPostsArr.map(item =>
			item.length === 1
				? sortedPosts.push(item[0])
				: item.map(i => sortedPosts.push(i))
		)

		sortedPosts.sort(function (a, b) {
			return new Date(b.createdAt) - new Date(a.createdAt)
		})

		res.status(200).json([sortedPosts, followingPostsAuthor])
	} catch (err) {
		res.status(500).json(err)
	}
})

// export posts router

module.exports = router
