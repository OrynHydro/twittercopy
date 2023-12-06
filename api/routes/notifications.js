const router = require('express').Router()
const Post = require('../models/Post')
const User = require('../models/User')
const Chat = require('../models/Chat')
const Message = require('../models/Message')
const mongoose = require('mongoose')
const Notification = require('../models/Notification')

// create notification
router.post('/', async (req, res) => {
	const newNotification = await new Notification(req.body)
	try {
		const savedNotificationt = await newNotification.save()
		res.status(200).json(savedNotificationt)
	} catch (err) {
		res.status(500).json(err)
	}
})

// add notification to user
router.put('/:userDbId/add', async (req, res) => {
	const userDbId = req.params.userDbId
	const notificationId = req.body.notificationId
	try {
		await User.findByIdAndUpdate(userDbId, {
			$push: { notifications: notificationId },
		})
		res.status(200).json('Added')
	} catch (error) {
		res.status(500).json(error)
	}
})

// read notification
router.put('/:notificationId/read', async (req, res) => {
	const notificationId = req.params.notificationId
	try {
		await Notification.findByIdAndUpdate(notificationId, {
			perused: true,
		})
		res.status(200).json('Read')
	} catch (error) {
		res.status(500).json(error)
	}
})

// get user's notifications
router.get('/:userDbId', async (req, res) => {
	const userDbId = req.params.userDbId
	try {
		const user = await User.findById(userDbId)
		const userNotifications = await Notification.find({
			_id: { $in: user.notifications },
		})
		res.status(200).json(userNotifications)
	} catch (error) {
		res.status(500).json(error)
	}
})

module.exports = router
