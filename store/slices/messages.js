import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
   name: "messages",
   initialState: {
      errorMessages: [],
      generalMessages: []
   },
   reducers: {
      setErrors(state,action) {
         console.log("running setErrors");
         console.log("state",state);
         console.log("action",action);
         state.errorMessages = action.payload;
      }
   }
});

export const messagesActions = messagesSlice.actions;
export default messagesSlice;