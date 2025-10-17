import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  isSidebarOpen: boolean;
}

const initialState: AppState = {
  isSidebarOpen: false,
};

const appReducer = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSideBar(state, action: PayloadAction<boolean>) {
      state.isSidebarOpen = action.payload;
    },
   
  },
});

export const { setSideBar } = appReducer.actions;

export default appReducer.reducer;
