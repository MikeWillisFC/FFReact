import { configureStore } from "@reduxjs/toolkit";

import globalSlice from "./slices/global";

const store = configureStore({
   reducer: {
      global: globalSlice.reducer
   }
});

export default store;