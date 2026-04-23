import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../Components/axios.js";

// ── Thunks ────────────────────────────────────────────────────────────────────

export const userRegister = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/users/register", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed",
      );
    }
  },
);

export const registerCompany = createAsyncThunk(
  "user/registerCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/company/register", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const logInUser = createAsyncThunk(
  "user/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/users/login", loginData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

export const loginCompany = createAsyncThunk(
  "user/loginCompany",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/company/login", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);

export const logOutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/users/logout");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed",
      );
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  userInfo: null,
  message: "",
  authStatus: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    login: (state, action) => {
      state.authStatus = true;
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.authStatus = false;
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── User Register ──
      .addCase(userRegister.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload?.message || "Registered successfully";
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Registration failed";
      })

      // ── Company Register ──
      .addCase(registerCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = action.payload?.message || "Company registered successfully";
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload || "Registration failed";
      })

      // ── User Login ──
      .addCase(logInUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.authStatus = true;
        state.userInfo = action.payload?.data?.user;
        state.message = action.payload?.message || "Logged in successfully";
      })
      .addCase(logInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.authStatus = false;
        state.userInfo = null;
        state.message = action.payload || "Login failed";
      })

      // ── Company Login ──
      .addCase(loginCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.authStatus = true;
        state.userInfo = action.payload?.data?.user; // same shape from backend
        state.message = action.payload?.message || "Logged in successfully";
      })
      .addCase(loginCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.authStatus = false;
        state.userInfo = null;
        state.message = action.payload || "Login failed";
      })

      // ── Logout ──
      .addCase(logOutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.authStatus = false;
        state.userInfo = null;
        state.message = "Logged out successfully";
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.authStatus = false;
        state.userInfo = null;
        state.message = action.payload || "Logout failed";
      });
  },
});

export const { reset, login, logout } = authSlice.actions;
export default authSlice.reducer;
