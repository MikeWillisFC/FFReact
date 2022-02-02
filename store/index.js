import { configureStore } from "@reduxjs/toolkit";

import globalSlice from "./slices/global";
import messagesSlice from "./slices/messages";
import productFormSlice from "./slices/productForm";

const store = configureStore({
   reducer: {
      global: globalSlice.reducer,
      messages: messagesSlice.reducer,
      productForm: productFormSlice.reducer
   }
});

export default store;