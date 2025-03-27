const express = require('express')

const User = require('../models/User')

const { protect, admin } = require('../middleware/authMiddleware')

const router = express.Router()

// @route GET /api/admin/users
// @desc Get all users (Admin only)
// @access Private/Admin

router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({})
        res.json(users)
    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in admin get')
    }
})


// @route POST /api/admin/users
// @desc Add users (Admin only)
// @access Private/Admin

router.post('/', protect, admin, async (req, res) => {
    const { name, email, password, role } = req.body
    try {
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'User already exists' })
        }

        user = new User({ name, email, password, role: role || 'customer' })

        await user.save()

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            message: 'User created successfully'
        })
    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in admin add')
    }
})


// @route PUT /api/admin/users
// @desc Update users (Admin only)
// @access Private/Admin

router.put('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.role = req.body.role || user.role

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            message: 'User updated successfully'
        })
    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in admin update')
    }
})



// @route DELETE /api/admin/users
// @desc delete users (Admin only)
// @access Private/Admin

router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne()
        res.json({ message: 'User deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in admin delete')
    }
})


module.exports = router