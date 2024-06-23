const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

router.post('/signup', async (req, res) => {
    const { fname, lname,  password, email } = req.body;
    if (!email || !password || !fname) {
        return res.json({ error: "Please complete the data" })
    }
    try {
        const userCheck = await User.findOne({ email: email });
        if (userCheck) {
            return res.json({ error: "User already exists!!" })
        }
        const hashedPass = await bcrypt.hash(password, 12);
        const newUser = new User({
            fname, email,lname,
            password: hashedPass,
        })
        await newUser.save().then((user) => {
            const { _id } = user;
            const token = jwt.sign({ _id: _id }, process.env.JWT_SEC)
            user.password = undefined
            res.json({ token, user })
        }).catch(err => {
            res.json({ msg: "error while saving" })
            console.log(err)
        })

    } catch (error) {
        res.json({ msg: "Server error" })
        console.log(error)
    }
})

//login

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ error: "Please complete the data" })
    }
    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.json({ error: "Invalid email or password" })
        }
        await bcrypt.compare(password, user.password).then((match) => {
            if (match) {
                const { _id } = user;
                const token = jwt.sign({ _id: _id }, process.env.JWT_SEC)
                user.password = undefined
                res.json({ token, user })
            } else {
                return res.json({ error: "Invalid email or password" })
            }
        })

    } catch (error) {
        res.json({ message: "Server error" })
        console.log(error)
    }
})



module.exports = router