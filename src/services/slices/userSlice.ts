import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';

type UserState = {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isLoading: true,
  error: null
};

export const fetchUser = createAsyncThunk('user/fetchUser', getUserApi);

export const loginUser = createAsyncThunk('user/loginUser', loginUserApi);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  registerUserApi
);

export const updateUser = createAsyncThunk('user/updateUser', updateUserApi);

export const logoutUser = createAsyncThunk('user/logoutUser', logoutApi);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Получение данных пользователя
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка получения пользователя';
      })

      // Авторизация пользователя
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка авторизации';
      })

      // Регистрация пользователя
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })

      // Обновление данных
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка обновления данных пользователя';
      })

      // Выход из аккаунта
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка выхода';
      });
  }
});

export const { logout } = userSlice.actions;

export const userReducer = userSlice.reducer;
