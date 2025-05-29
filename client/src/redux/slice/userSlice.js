import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "user",
  initialState: { name: "darshan", email: "darshankollam8@gmail.com" },
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    clearUser: () => {
      return {};
    },
  },
});

export const { addUser, clearUser } = usersSlice.actions;
export default usersSlice.reducer;
