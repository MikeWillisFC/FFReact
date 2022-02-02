import { createSlice } from "@reduxjs/toolkit";

const productFormSlice = createSlice({
   name: "productForm",
   initialState: {
      attributes: []
   },
   reducers: {
      addAttribute(state,action) {
         console.log("running addAttribute");
         console.log("state",state);
         console.log("action",action);
         state.attributes.push(action.payload);
      },
      clearAttributes(state,action) {
         state.attributes = [];
      },
      setAttributes(state,action) {
         state.attributes = action.payload;
      },
      setHiddenSetting(state,action) {
         state.attributes[action.payload.index].hiddenSetting = action.payload.hiddenSetting;
      },
      setRequired(state,action) {
         state.attributes[action.payload.index].required = action.payload.required;
      },
      setValue(state,action) {
         // console.log("setValue action:",action);
         state.attributes[action.payload.index].value = action.payload.value;
      },
      setIsValid(state,action) {
         state.attributes[action.payload.index].isValid = action.payload.isValid;
      }
   }
});

export const productFormActions = productFormSlice.actions;
export default productFormSlice;