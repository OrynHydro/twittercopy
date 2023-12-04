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

module.exports = router
