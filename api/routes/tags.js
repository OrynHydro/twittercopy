const router = require('express').Router()
const Tag = require('../models/Tag')

const mongoose = require('mongoose')

// create tag
router.post('/', async (req, res) => {
	try {
		const newTag = await new Tag(req.body)
		const savedTag = await newTag.save()
		res.status(200).json(savedTag)
	} catch (error) {
		res.status(500).json(err)
	}
})

module.exports = router
