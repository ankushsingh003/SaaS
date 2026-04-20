import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchWorkspaces = createAsyncThunk('workspaces/fetchAll', async (_, thunkAPI) => {
    try {
        const response = await api.get('/workspaces');
        return response.data.workspaces;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch workspaces');
    }
});

export const createWorkspace = createAsyncThunk('workspaces/create', async (data, thunkAPI) => {
    try {
        const response = await api.post('/workspaces', data);
        return response.data.workspace;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to create workspace');
    }
});

const workspaceSlice = createSlice({
    name: 'workspaces',
    initialState: {
        list: [],
        activeWorkspace: null,
        loading: false,
        error: null
    },
    reducers: {
        setActiveWorkspace: (state, action) => {
            state.activeWorkspace = action.payload;
            localStorage.setItem('activeWorkspaceId', action.payload?._id || '');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWorkspaces.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWorkspaces.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
                
                // Set active workspace if not set
                const savedId = localStorage.getItem('activeWorkspaceId');
                const savedWorkspace = action.payload.find(w => (w.workspace?._id || w.workspace) === savedId);
                
                if (savedWorkspace) {
                    state.activeWorkspace = savedWorkspace.workspace;
                } else if (action.payload.length > 0) {
                    state.activeWorkspace = action.payload[0].workspace;
                }
            })
            .addCase(fetchWorkspaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createWorkspace.fulfilled, (state, action) => {
                state.list.push({ workspace: action.payload, role: 'owner' });
                state.activeWorkspace = action.payload;
            });
    }
});

export const { setActiveWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
