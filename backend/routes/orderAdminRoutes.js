const express = require('express')
const Order = require('../models/Order')
const { protect, admin } = require('../middleware/authMiddleware')

const router = express.Router()

// @route GET /api/admin/orders
// @desc Get orders (Admin only)
// @access Private/Admin

router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email')
        res.json(orders)
    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in admin get')
    }
})


// @route PUT /api/admin/orders
// @desc Update orders (Admin only)
// @access Private/Admin

router.put('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email')
        if (order) {
            order.status = req.body.status || order.status
            order.isDelivered = req.body.status === 'Delivered' ? true : order.isDelivered
            order.DeliveredAt = req.body.status === 'Delivered' ? Date.now() : order.DeliveredAt

            const updatedOrder = await order.save()
            res.json(updatedOrder)
        } else {
            res.status(404).json({ message: 'Order not found' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in admin updated')
    }
})


// @route DELETE /api/admin/orders
// @desc Delete orders (Admin only)
// @access Private/Admin

router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (order) {
            await order.deleteOne()
            res.json({ message: 'Order removed' })
        } else {
            res.status(404).json({ message: "Order ot found" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Server error in admin delete')
    }
})

module.exports = router