const express = require('express')
const router = express.Router()
const Subscribe = require('../models/Subcriber')


// @route POST /api/subscribe
// @desc handle newslatter subscription
// @access Public

router.post('/', async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ message: 'Email is required' })
    }

    try {
        //  Check if the email is alredy subscribed
        let subscriber = await Subscribe.findOne({ email })

        if (subscriber) {
            return res.status(400).json({ message: 'email is already subscribe' })
        }

        // create a new subscriber

        subscriber = new Subscribe({ email })
        await subscriber.save()
        res.status(201).json({ message: 'Successfully subsciber to the newslater' })
    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in Subscriber')
    }
})

module.exports = router