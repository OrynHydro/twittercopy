// importing expressJS, mongoose, dotenv, helmet, morgan, multer and path

const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')

// creating app using expressJS

const app = express()

// importing user, auth and post routes

const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

// config env files

dotenv.config()

// connecting project to MongoDB

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(console.log('Connected to MongoDB'))

// serve static images from the 'public/images' directory when the URL path starts with '/images'

app.use('/images', express.static(path.join(__dirname, 'public/images')))



// Middleware to parse incoming JSON data

app.use(express.json());

// Middleware for enhancing security headers

app.use(helmet());

// Middleware for logging HTTP requests in the 'common' format

app.use(morgan('common'));



// creating a multer storage for images

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/images/storage')
	},
	filename: (req, file, cb) => {
		cb(null, typeof req.body.name === 'string' ? req.body.name : req.body.name.at(-1));
	},
})

const upload = multer({ storage })



// request of adding images to multer storage

app.post('/api/upload', upload.array('files'), (req, res) => {
	try {
		return res.status(200).json('File uploaded successfully.')
	} catch (err) {
		console.log(err)
	}
})

// Middleware for handling routes

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)

// Start the Express.js server on port 8800 and log a message when it's running

app.listen(8800, () => {
    console.log('API started')
})