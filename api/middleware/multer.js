const multer = require('multer')

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/images/storage')
	},
	filename: (req, file, cb) => {
		cb(
			null,
			typeof req.body.name === 'string' ? req.body.name : req.body.name.at(-1)
		)
	},
})

const upload = (module.exports = multer({ storage }))
