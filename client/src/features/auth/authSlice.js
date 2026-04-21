import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
    try {
        const response = await api.post('/auth/login', credentials);
        localStorage.setItem('token', response.data.token);
        return response.data.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Login failed');
    }
});

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await api.post('/auth/register', userData);
        localStorage.setItem('token', response.data.token);
        return response.data.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Registration failed');
    }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
    try {
        const response = await api.get('/auth/me');
        return response.data.user;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || 'Failed to fetch user');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: !!localStorage.getItem('token'),
        error: null,
        isAuthenticated: false
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getMe.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
            });
    }
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
