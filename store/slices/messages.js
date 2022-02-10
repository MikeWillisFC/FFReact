import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
   name: "messages",
   initialState: {
      errorMessages: [],
      informationMessages: []
   },
   reducers: {
      setErrorMessages(state,action) {
         console.log("running setErrorMessages");
         console.log("state",state);
         console.log("action",action);
         state.errorMessages = action.payload;
      },
      setInformationMessages(state,action) {
         console.log("running setInformationMessages");
         console.log("state",state);
         console.log("action",action);
         state.informationMessages = action.payload;
      },
      clearMessages(state) {
         state.errorMessages = [];
         state.informationMessages = [];
      },
      clearErrorMessages(state) {
         state.errorMessages = [];
      },
      clearInformationMessages(state) {
         state.informationMessages = [];
      }
   }
});

export const messagesActions = messagesSlice.actions;
export default messagesSlice;