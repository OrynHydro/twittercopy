const router = require('express').Router()
const User = require('../models/User')
const Chat = require('../models/Chat')
const Message = require('../models/Message')

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
			.populate({
				path: 'messages',
				populate: { path: 'sender' },
			})
			.populate({
				path: 'messages',
				populate: { path: 'originalMessage' },
			})

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

// delete chat
router.delete('/:chatId/delete', async (req, res) => {
	try {
		const chat = await Chat.findById(req.params.chatId).populate('messages')
		const messageIds = chat.messages.map(message => message._id)
		await Message.deleteMany({ _id: { $in: messageIds } })
		await chat.deleteOne()
		res.status(200).json('Chat with messages deleted')
	} catch (err) {
		res.status(500).json(err)
	}
})

// remove message from chat
router.put('/:messageId/removeMessage', async (req, res) => {
	try {
		await Chat.findByIdAndUpdate(req.body.chatId, {
			$pull: { messages: req.params.messageId },
		})
		res.status(200).json('Message removed from chat')
	} catch (err) {
		res.status(500).json(err)
	}
})

module.exports = router
