import { TUser } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { type PayloadAction } from '@reduxjs/toolkit';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  refreshUserToken,
  updateUser
} from '@api';
import { RootState } from '../store';
type AuthState = {
  user: TUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: null | string;
  accessToken: string | null;
  refreshToken: string | null;
  authChecked: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  authChecked: false
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await loginUser(email, password);

    localStorage.setItem('accessToken', response.access_token);
    localStorage.setItem('refreshToken', response.refresh_token);

    return response;
  }
);
export const getUserThunk = createAsyncThunk(
  'auth/getUser',
  async (accessToken: string, { rejectWithValue, dispatch }) => {
    try {
      return await getUser(accessToken);
    } catch (error) {
      if (error instanceof Error && error.message === '401') {
        try {
          const refreshed = await dispatch(refreshThunk()).unwrap();

          return await getUser(refreshed.access_token);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          return rejectWithValue(
            refreshError instanceof Error
              ? refreshError.message
              : 'Не удалось обновить токен'
          );
        }
      }

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Не удалось получить пользователя'
      );
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
);
export const refreshThunk = createAsyncThunk(
  'auth/refresh',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) {
      throw new Error('Refresh-токен отсутствует');
    }

    const response = await refreshUserToken(refreshToken);

    if (!response.success) {
      throw new Error('Не удалось обновить токен');
    }

    localStorage.setItem('accessToken', response.access_token);
    localStorage.setItem('refreshToken', response.refresh_token);

    return response;
  }
);
export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({
    email,
    password,
    name
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    const response = await registerUser(email, password, name);

    localStorage.setItem('accessToken', response.access_token);
    localStorage.setItem('refreshToken', response.refresh_token);

    return response;
  }
);
export const updateUserThunk = createAsyncThunk(
  'auth/updateUser',
  async (
    userData: { name: string; email: string; password?: string },
    { getState }
  ) => {
    const state = getState() as RootState;
    const accessToken = state.auth.accessToken;

    if (!accessToken) {
      throw new Error('Необходимо авторизоваться');
    }

    return await updateUser(accessToken, userData);
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    checkAuth: (state) => {
      state.authChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        console.log('Ответ loginThunk:', action.payload);
        console.log('Токен из ответа:', Boolean(action.payload.access_token));
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка входа';
      })
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authChecked = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string | undefined) ||
          action.error.message ||
          'Не удалось получить пользователя';

        state.authChecked = true;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.authChecked = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.authChecked = true;
        state.loading = false;
        state.error = action.error.message || 'Ошибка выхода из аккаунта';
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
        state.authChecked = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(refreshThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.loading = false;
        state.error = null;
      })
      .addCase(refreshThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось обновить токен';
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string | undefined) ||
          action.error.message ||
          'Не удалось обновить профиль';
      });
  }
});

export default authSlice.reducer;
export const { setUser, logout, checkAuth } = authSlice.actions;
