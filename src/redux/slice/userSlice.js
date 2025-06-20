import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    updateUser: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    clearUser: () => {
      return {};
    },
  },
});

export const { addUser,updateUser, clearUser } = usersSlice.actions;
export default usersSlice.reducer;
