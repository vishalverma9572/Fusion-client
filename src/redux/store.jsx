import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userslice";
import moduleReducer from "./moduleslice";
import formReducer from "./formSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    module: moduleReducer,
    form: formReducer,
    
  },
});
