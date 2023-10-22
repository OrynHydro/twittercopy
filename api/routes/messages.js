const router = require('express').Router()
const User = require('../models/User')
const Chat = require('../models/Chat')
const Message = require('../models/Message')

const mongoose = require('mongoose')

// create message
router.post('/', async (req, res) => {
	try {
		const newMessage = await new Message(req.body)
		const savedMessage = await newMessage.save()
		res.status(200).json(savedMessage)
	} catch (error) {
		res.status(500).json(err)
	}
})

// get user chats
// router.get('/getChats/:userDbId', async (req, res) => {
// 	try {
// 		const userId = req.params.userDbId
// 		const userChats = await Chat.find({ members: { $in: [userId] } })

// 		const populatePromises = userChats.map(chat => chat.populate('members'))

// 		await Promise.all(populatePromises)

// 		res.status(200).json(userChats)
// 	} catch (error) {
// 		res.status(500).json(error)
// 	}
// })

module.exports = router
