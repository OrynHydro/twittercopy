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

module.exports = router
