// importing router using ExpressJS, users model and bcrypt library for password hashing

const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// register

router.post('/register', async (req, res) => {
    try {
            // generate new password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)

            // create new user
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                birth: req.body.birth,
                token: req.body.token,
                userId: req.body.userId
            })
            // save user and respond
            const user = await newUser.save()
            res.status(200).json(user)
    } catch(err) {
        res.status(500).json(err)
    }
})

// login

router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email })
		const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword ? res.status(403).json('wrong password') : res.status(200).json(user)
	} catch (err) {
		res.status(500).json(err)
	}
})

// exporting auth router 

module.exports = router