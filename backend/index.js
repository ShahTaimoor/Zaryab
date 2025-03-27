const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')
const checkoutRoutes = require('./routes/checkoutRoute')
const orderRoutes = require('./routes/orderRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const subRoutes = require('./routes/subscribeRoutes')
const adminRoutes = require('./routes/adminRoutes')
const productAdminRoutes = require('./routes/productAdminRoutes')
const orderAdminRoutes = require('./routes/orderAdminRoutes')



app.use(express.json());
app.use(cors({
    origin: "https://zaryab-nveg.vercel.app", 
    credentials: true
}));

dotenv.config()

const PORT = process.env.PORT

// Connect Db

connectDB()



// API Routes
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/checkout', checkoutRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/sub', subRoutes)

// admin routes

app.use('/api/admin/users', adminRoutes)
app.use('/api/admin/products', productAdminRoutes)
app.use('/api/admin/orders', orderAdminRoutes)


app.listen(process.env.PORT, () => {
    console.log('Server is running', process.env.PORT);

})