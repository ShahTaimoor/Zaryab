import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch products (admin only)
export const fetchAdminProducts = createAsyncThunk(
    'adminProducts/fetchAdminProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch products");
        }
    }
);

// Create product (admin only)
export const createProduct = createAsyncThunk(
    'adminProducts/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
                productData,
                { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to create product");
        }
    }
);

// Update product (admin only)
export const updateProduct = createAsyncThunk(
    'adminProducts/updateProduct',
    async ({ id, ...productData }, { rejectWithValue }) => { 
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
                productData, 
                { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update product");
        }
    }
);

// Delete product (admin only)
export const deleteProduct = createAsyncThunk(
    'adminProducts/deleteProduct', // Fixed action type prefix
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
            );
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete product");
        }
    }
);

const adminProductSlice = createSlice({
    name: 'adminProducts',
    initialState: {
        products: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch products
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch products";
            })

            // Create product
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create product";
            })

            // Update product
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const updatedProduct = action.payload;
                console.log("Updated Product from API:", updatedProduct)
                const productIndex = state.products.findIndex((product) => product._id === updatedProduct._id);
                if (productIndex !== -1) {
                    state.products[productIndex] = updatedProduct;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update product";
            })

            // Delete product
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter((product) => product._id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.error = action.payload || "Failed to delete product";
            });
    }
});

export default adminProductSlice.reducer;
