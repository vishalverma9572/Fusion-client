import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: "User",
    roles: ["Guest-User"],
  },
  reducers: {
    setUserName: (state, action) => {
      state.username = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
    clearUserName: (state) => {
      state.username = "User";
    },
    clearRoles: (state) => {
      state.roles = null;
    },
  },
});

export const { setUserName, setRoles, clearUserName, clearRoles } = userSlice.actions;
export default userSlice.reducer;
