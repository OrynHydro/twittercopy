// importing expressJS, mongoose, dotenv, helmet, morgan, multer and path

const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const path = require('path')

const app = express()

dotenv.config()

const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const uploadFilesRoute = require('./routes/uploadFiles')
const listRoute = require('./routes/lists')
const chatRoute = require('./routes/chat')
const messageRoute = require('./routes/messages')
const notificationRoute = require('./routes/notifications')

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(console.log('Connected to MongoDB'))

app.use('/images', express.static(path.join(__dirname, 'public/images')))

app.use(express.json())

app.use(helmet())

app.use(morgan('common'))

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/upload', uploadFilesRoute)
app.use('/api/lists', listRoute)
app.use('/api/chats', chatRoute)
app.use('/api/messages', messageRoute)
app.use('/api/notifications', notificationRoute)

app.listen(8800, () => {
	console.log('API started')
})
