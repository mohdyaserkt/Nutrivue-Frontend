import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,

};

const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    clearUser: (state) => {
      state.user = null;
    },

  },
});

export const { addUser, updateUser, clearUser } =
  usersSlice.actions;
export default usersSlice.reducer;
