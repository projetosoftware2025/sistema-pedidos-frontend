import { combineSlices, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import appReducer from "./reducers/appReducer";

const rootReducer = combineSlices({
  app: appReducer,
  auth: authReducer
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
