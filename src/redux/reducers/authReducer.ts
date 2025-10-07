import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInterface } from "../../app/models/interfaces/UserInterface";
import emptyUser from "../../data/userEmpty";

interface AuthState {
  user: UserInterface;
//   token: TokenInterface;
}

const initialState: AuthState = {
  user: emptyUser,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserInterface>) {
      state.user = action.payload;
    },
    resetAuth(state) {
      state.user = initialState.user;
    }
  },
});

export const { setUser, resetAuth } = authReducer.actions;

export default authReducer.reducer;
