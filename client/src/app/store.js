import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import workspaceReducer from '../features/workspaces/workspaceSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        workspaces: workspaceReducer,
    },
});
