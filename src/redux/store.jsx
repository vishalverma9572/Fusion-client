import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userslice.jsx';
import moduleReducer from './moduleslice.jsx';

export const store = configureStore({
  reducer: {
    user: userReducer,
    module: moduleReducer,
  },
});
