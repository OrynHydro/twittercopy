const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')
const List = require('../models/List')
const mongoose = require('mongoose')

router.post('/', async (req, res) => {
	const newList = await new List(req.body)
	try {
		const savedList = await newList.save()
		res.status(200).json(savedList)
	} catch (err) {
		res.status(500).json(err)
	}
})

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
		res.status(200).json(user)
	} catch (err) {
		res.status(500).json(err)
	}
})

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
		])
		res.status(200).json(list)
	} catch (err) {
		res.status(500).json(err)
	}
})

module.exports = router
