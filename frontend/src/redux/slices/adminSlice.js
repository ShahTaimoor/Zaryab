import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`;

// Helper function to get token
const getToken = () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        console.error("No auth token found");
    }
    return token;
};

// Helper function for handling errors
const handleRequestError = (error, rejectWithValue) => {
    console.error("API Error:", error);
    return rejectWithValue(error.response?.data?.message || "Something went wrong");
};

// Fetch all users (admin only)
export const fetchUsers = createAsyncThunk(
    'admin/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            console.log(response);

            return response.data;
        } catch (error) {
            return handleRequestError(error, rejectWithValue);
        }
    }
);

// Add user (admin only)
export const addUser = createAsyncThunk(
    'admin/addUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, userData, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            return response.data;
        } catch (error) {
            return handleRequestError(error, rejectWithValue);
        }
    }
);

// Update user (admin only)
export const updateUser = createAsyncThunk(
    'admin/updateUser',
    async ({ id, ...updates }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, updates, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            return response.data;
        } catch (error) {
            return handleRequestError(error, rejectWithValue);
        }
    }
);

// Delete user (admin only)
export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            return id;
        } catch (error) {
            return handleRequestError(error, rejectWithValue);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                console.log(action.payload);

            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add user
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = [...state.users, action.payload];
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update user
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.map(user =>
                    user._id === action.payload._id ? action.payload : user
                );
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete user
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default adminSlice.reducer;
