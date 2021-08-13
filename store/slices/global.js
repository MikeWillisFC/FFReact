import { createSlice } from "@reduxjs/toolkit";

import config from "../../config/config";

const globalSlice = createSlice({
   name: "global",
   initialState: {...config},
   reducers: {

   }
});

export const globalActions = globalSlice.actions;
export default globalSlice;