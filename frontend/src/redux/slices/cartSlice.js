import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


// Helper function to load cart from localstoarge

const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem('cart')
    return storedCart ? JSON.parse(storedCart) : { prducts: [] }
}

// Helper function to save cart yo localStorage 

const saveCartToStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart))
}

// Fetch Cart for a user or guest

export const fetchCart = createAsyncThunk('cart/fetchCart', async ({ userId, guestId }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, { params: { userId, guestId } })
        return response.data
    } catch (error) {
        console.error(error)
        return rejectWithValue(error.response.data)
    }
})


// Add an item to the cart for a user or guest 
export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, { productId, quantity, size, color, guestId, userId })
        return response.data
    } catch (error) {
        console.error(error)
        return rejectWithValue(error.response.data)
    }
})



// Update an item of quantity to a  cart  
export const updatedCartItemQuantity = createAsyncThunk('cart/updatedCartItemQuantity', async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, { productId, quantity, size, color, guestId, userId })
        return response.data
    } catch (error) {
        console.error(error)
        return rejectWithValue(error.response.data)
    }
})


// Remove an item from a  cart  
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
        const response = await axios(
            {
                method: "DELETE",
                url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
                data: { productId, quantity, size, color, guestId, userId }
            }
        )
        return response.data
    } catch (error) {
        console.error(error)
        return rejectWithValue(error.response.data)
    }
})

// Merge guest cart into user cart 
export const mergeCart = createAsyncThunk('cart/mergeCart', async ({ guestId, user }) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`, { guestId, user }, { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } })
        return response.data
    } catch (error) {
        console.error(error)
        return rejectWithValue(error.response.data)
    }
})

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: loadCartFromStorage(),
        loading: false,
        error: null
    },
    reducers: {
        clearCart: (state) => {
            state.cart = { products: [] }
            localStorage.removeItem('cart')
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
                saveCartToStorage(action.payload)
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch cart'
            })


            .addCase(addToCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
                saveCartToStorage(action.payload)
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message || 'Failed add to cart'
            })


            .addCase(updatedCartItemQuantity.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updatedCartItemQuantity.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
                saveCartToStorage(action.payload)
            })
            .addCase(updatedCartItemQuantity.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message || 'Failed to update item quantity'
            })


            .addCase(removeFromCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
                saveCartToStorage(action.payload)
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message || 'Failed to remove'
            })



            .addCase(mergeCart.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(mergeCart.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
                saveCartToStorage(action.payload)
            })
            .addCase(mergeCart.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload.message || 'Failed to mergeCart'
            })
    }
})


export const { clearCart } = cartSlice.actions
export default cartSlice.reducer 