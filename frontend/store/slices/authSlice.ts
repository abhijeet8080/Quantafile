import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {User} from '@/types/user'

interface AuthPayload {
  user: User;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

const isBrowser = typeof window !== "undefined";

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthPayload>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      if (isBrowser) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      if (isBrowser) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },

    rehydrate: (state) => {
      if (isBrowser) {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          state.user = JSON.parse(storedUser);
          state.token = storedToken;
          state.isAuthenticated = true;
        }
      }
    },
  },
});

export const { login, logout, rehydrate } = authSlice.actions;
export default authSlice.reducer;
