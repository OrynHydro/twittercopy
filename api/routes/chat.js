const router = require('express').Router()
const User = require('../models/User')
const Chat = require('../models/Chat')

const mongoose = require('mongoose')

// create chat
router.post('/', async (req, res) => {
	try {
		const newChat = await new Chat(req.body)
		const savedChat = await newChat.save()
		res.status(200).json(savedChat)
	} catch (error) {
		res.status(500).json(err)
	}
})

// get user chats
router.get('/getChats/:userDbId', async (req, res) => {
	try {
		const userId = req.params.userDbId
		const userChats = await Chat.find({ members: userId })
			.populate('members')
			.populate('messages')

		res.status(200).json(userChats)
	} catch (error) {
		res.status(500).json(error)
	}
})

// add message to chat
router.put('/addMessage/:chatId', async (req, res) => {
	try {
		const chat = await Chat.findById(req.params.chatId)
		await chat.updateOne({ $push: { messages: req.body.messageId } })
		res.status(200).json(chat)
	} catch (err) {
		res.status(500).json(err)
	}
})

module.exports = router
