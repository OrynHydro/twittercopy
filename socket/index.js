const io = require('socket.io')(8900, {
	cors: {
		origin: 'http://localhost:3000',
	},
})

let users = []

const addUser = (userId, socketId) => {
	!users.includes(userId) && users.push({ userId, socketId })
}

const removeUser = socketId => {
	users = users.filter(user => user.socketId !== socketId)
}

const getUser = userId => {
	return users.find(user => user.userId === userId)
}

io.on('connection', socket => {
	console.log('User connected')
})
