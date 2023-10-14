const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')
const List = require('../models/List')
const mongoose = require('mongoose')

// create list
router.post('/', async (req, res) => {
	const newList = await new List(req.body)
	try {
		const savedList = await newList.save()
		res.status(200).json(savedList)
	} catch (err) {
		res.status(500).json(err)
	}
})

// find all user's lists
router.get(`/userLists/:userDbId`, async (req, res) => {
	try {
		const user = await User.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(req.params.userDbId),
				},
			},
			{
				$lookup: {
					from: 'lists',
					localField: '_id',
					foreignField: 'creator',
					as: 'createdLists',
				},
			},
			{
				$lookup: {
					from: 'lists',
					localField: '_id',
					foreignField: 'followers',
					as: 'followedLists',
				},
			},
		])

		const populatedUser = await User.populate(user, {
			path: 'followedLists.followers',
		})

		res.status(200).json(populatedUser)
	} catch (err) {
		res.status(500).json(err)
	}
})

// find posts of list's members
router.get(`/membersPosts/:id`, async (req, res) => {
	try {
		const list = await List.aggregate([
			{
				$match: {
					_id: new mongoose.Types.ObjectId(req.params.id),
				},
			},
			{
				$lookup: {
					from: 'posts',
					localField: 'members',
					foreignField: 'user',
					as: 'membersPosts',
				},
			},
			{
				$unwind: {
					path: '$membersPosts',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$match: {
					'membersPosts.originalPost': null,
				},
			},
			{
				$group: {
					_id: '$_id',
					membersPosts: { $push: '$membersPosts' },
				},
			},
		])

		const populatedList = await User.populate(list, {
			path: 'membersPosts.user',
		})

		res.status(200).json(populatedList)
	} catch (err) {
		res.status(500).json(err)
	}
})

// find list
router.get('/findList/:listId', async (req, res) => {
	try {
		const list = await List.findById(req.params.listId).populate('creator')
		res.status(200).json(list)
	} catch (err) {
		res.status(500).json(err)
	}
})

// update list
router.put('/update/:listId', async (req, res) => {
	try {
		await List.findByIdAndUpdate(req.params.listId, {
			$set: req.body,
		})
		res.status(200).json('List was updated')
	} catch (err) {
		res.status(500).json(err)
	}
})

// delete list
router.delete('/:listId/delete', async (req, res) => {
	try {
		await List.findByIdAndDelete(req.params.listId)
		res.status(200).json('List deleted')
	} catch (err) {
		res.status(500).json(err)
	}
})

// follow list
router.put('/:listId/follow', async (req, res) => {
	const userId = req.body.userDbId
	const listId = req.params.listId

	try {
		const list = await List.findById(listId)

		if (list.followers.includes(userId)) {
			await list.updateOne({ $pull: { followers: userId } })
			res.status(200).json('Unfollowed')
		} else {
			await list.updateOne({ $push: { followers: userId } })
			res.status(200).json('Followed')
		}
	} catch (err) {
		return res.status(500).json(err)
	}
})

// add/remove user to/from list
router.put(`/addToList/:listId`, async (req, res) => {
	try {
		const list = await List.findById(req.params.listId)
		if (!list.members.includes(req.body.userDbId)) {
			await list.updateOne({
				$push: { members: req.body.userDbId },
			})
			res.status(200).json('User successfuly added to list')
		} else {
			await list.updateOne({
				$pull: { members: req.body.userDbId },
			})
			res.status(200).json('User successfuly removed from list')
		}
	} catch (err) {
		res.status(500).json(err)
	}
})

module.exports = router
