import { combineSlices, configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducers/appReducer";
import authReducer from "./reducers/authReducer";
import cartReducer from "./reducers/cartReducer";

const rootReducer = combineSlices({
  app: appReducer,
  auth: authReducer,
  cart: cartReducer, // 👈 adiciona aqui
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
