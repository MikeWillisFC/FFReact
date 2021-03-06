import { createSlice } from "@reduxjs/toolkit";

import config from "../../config/config";

const globalSlice = createSlice({
   name: "global",
   initialState: {
      ...config,
      isLoggedIn: false
   },
   reducers: {
      setLogin(state,action) {
         state.isLoggedIn = action.payload;
      }
   }
});

export const globalActions = globalSlice.actions;
export default globalSlice;