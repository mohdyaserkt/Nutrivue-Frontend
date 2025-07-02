import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  authLoading: true, 
};

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
      state.authLoading = false;
    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    clearUser: (state) => {
      state.user = null;
      state.authLoading = false;
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
  },
});

export const { addUser, updateUser, clearUser, setAuthLoading } = usersSlice.actions;
export default usersSlice.reducer;
