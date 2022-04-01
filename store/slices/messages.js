import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
   name: "messages",
   initialState: {
      errorMessages: [],
      informationMessages: [],
      title: "Errors & Notifications"
   },
   reducers: {
      reset(state) {
         state.errorMessages = [];
         state.informationMessages = [];
         state.title = "Errors & Notifications";
      },
      setTitle(state,action) {
         state.title = action.payload;
      },
      setErrorMessages(state,action) {
         // console.log("running setErrorMessages");
         // console.log("state",state);
         // console.log("action",action);
         if ( action.payload.title ) {
            // we received an object
            state.title = action.payload.title;
            state.errorMessages = action.payload.messages;
         } else {
            // we received an array
            state.errorMessages = action.payload;
         }
      },
      setInformationMessages(state,action) {
         // console.log("running setInformationMessages");
         // console.log("state",state);
         // console.log("action",action);
         if ( action.payload.title ) {
            // we received an object
            state.title = action.payload.title;
            state.informationMessages = action.payload.messages;
         } else {
            // we received an array
            state.informationMessages = action.payload;
         }
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