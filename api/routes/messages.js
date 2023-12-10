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

// delete message
router.delete('/:messageId/delete', async (req, res) => {
	try {
		const message = await Message.findById(req.params.messageId)
		await message.deleteOne()
		res.status(200).json('Message deleted')
	} catch (err) {
		res.status(500).json(err)
	}
})

// reply to message
router.put('/:messageId/reply', async (req, res) => {
	try {
		await Message.findByIdAndUpdate(req.params.messageId, {
			originalMessage: req.body.originalMessage,
		})
		res.status(200).json('Message replied')
	} catch (err) {
		res.status(500).json(err)
	}
})

// read message
router.put('/:messageId/read', async (req, res) => {
	const messageId = req.params.messageId
	const userDbId = req.body.userDbId
	try {
		const message = await Message.findById(messageId)
		if (!message.perused.includes(userDbId)) {
			await message.updateOne({ $push: { perused: userDbId } })
		}

		res.status(200).json('Message read')
	} catch (err) {
		res.status(500).json(err)
	}
})

module.exports = router
