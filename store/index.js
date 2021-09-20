import { configureStore } from "@reduxjs/toolkit";

import globalSlice from "./slices/global";
import messagesSlice from "./slices/messages";

const store = configureStore({
   reducer: {
      global: globalSlice.reducer,
      messages: messagesSlice.reducer
   }
});

export default store;