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
			{
				$unwind: {
					path: '$createdLists',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$unwind: {
					path: '$followedLists',
					preserveNullAndEmptyArrays: true,
				},
			},

			{
				$lookup: {
					from: 'users',
					localField: 'createdLists.creator',
					foreignField: '_id',
					as: 'createdLists.creator',
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'followedLists.creator',
					foreignField: '_id',
					as: 'followedLists.creator',
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'createdLists.followers',
					foreignField: '_id',
					as: 'createdLists.followers',
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'followedLists.followers',
					foreignField: '_id',
					as: 'followedLists.followers',
				},
			},
			{
				$group: {
					_id: null,
					createdLists: { $push: '$createdLists' },
					followedLists: { $push: '$followedLists' },
				},
			},
		])

		if (user[0].followedLists[0].creator.length === 0) {
			user[0].followedLists = []
		}

		if (user[0].createdLists[0].creator.length === 0) {
			user[0].createdLists = []
		}

		res.status(200).json(user[0])
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

		list[0].membersPosts.sort((p1, p2) => {
			return new Date(p2.createdAt) - new Date(p1.createdAt)
		})
		res.status(200).json(populatedList[0].membersPosts)
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

// find all user member lists
router.get(`/memberLists/:userDbId`, async (req, res) => {
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
					foreignField: 'members',
					as: 'memberLists',
				},
			},
			{
				$unwind: '$memberLists',
			},
			{
				$lookup: {
					from: 'users',
					localField: 'memberLists.followers',
					foreignField: '_id',
					as: 'memberLists.followers',
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'memberLists.creator',
					foreignField: '_id',
					as: 'memberLists.creator',
				},
			},
			{
				$group: {
					_id: null,
					memberLists: { $push: '$memberLists' },
				},
			},
		])

		user[0].memberLists.forEach(list => {
			list.creator = list.creator[0]
		})

		res.status(200).json(user[0].memberLists)
	} catch (err) {
		res.status(500).json(err)
	}
})

// find created lists
router.get(`/createdLists/:userDbId`, async (req, res) => {
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
				$unwind: {
					path: '$createdLists',
					preserveNullAndEmptyArrays: true,
				},
			},

			{
				$lookup: {
					from: 'users',
					localField: 'createdLists.creator',
					foreignField: '_id',
					as: 'createdLists.creator',
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'createdLists.followers',
					foreignField: '_id',
					as: 'createdLists.followers',
				},
			},
			{
				$group: {
					_id: null,
					createdLists: { $push: '$createdLists' },
				},
			},
		])

		if (user[0].createdLists[0].creator.length === 0) {
			user[0].createdLists = []
		}

		res.status(200).json(user[0])
	} catch (err) {
		res.status(500).json(err)
	}
})

// find lists by text
router.get('/findByText', async (req, res) => {
	const searchText = req.query.text

	const foundLists = await List.find({
		$or: [
			{ name: { $regex: new RegExp(searchText, 'i') } },
			{ desc: { $regex: new RegExp(searchText, 'i') } },
		],
	}).exec()

	if (foundLists.length === 0) {
		return res.status(200).json('No matches')
	}

	for (const list of foundLists) {
		await list.populate('creator followers')
	}

	res.status(200).json(foundLists)
})

// change list tags
router.put('/:listId/tags', async (req, res) => {
	try {
		await List.findByIdAndUpdate(
			req.params.listId,
			{
				$set: { tags: req.body.tags },
			},
			{ new: true }
		)
		res.status(200).json('Tags have been updated')
	} catch (err) {
		res.status(500).json(err)
	}
})

module.exports = router
