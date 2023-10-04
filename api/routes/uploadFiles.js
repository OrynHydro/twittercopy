const router = require('express').Router()
const upload = require('./../middleware/multer')

router.post('/', upload.array('files'), (req, res) => {
	try {
		return res.status(200).json('File uploaded successfully.')
	} catch (err) {
		console.log(err)
	}
})

module.exports = router
