const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Product = require('./models/Product')
const User = require('./models/User')
const products = require('./data/products')
const Cart = require('./models/Cart')

dotenv.config()

// connect to mongoDB
mongoose.connect(process.env.MONGO_URI)

// Functions to zaryab data

const zaryabData = async () => {
    try {
        // Clear exisitng data
        await Product.deleteMany()
        await User.deleteMany()
        await Cart.deleteMany()

        //  Create a default admin User
        const createdUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: '123456',
            role: 'admin',
        })

        // Assign the default user ID eaxh product
        const userID = createdUser._id
        const sampleProducts = products.map((product) => {
            return {
                ...product,
                user: userID

            }
        })

        // Insert the products into the database
        await Product.insertMany(sampleProducts)
        console.log('product data zaryab successfully');
        process.exit()

    } catch (error) {
        console.error('Error zarab the data', error)
        process.exit(1)
    }
}

zaryabData()