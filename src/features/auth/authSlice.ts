import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  user: { username: string } | null;
  token: string;
  loading: boolean;
  error: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || '',
  loading: false,
  error: '',
};

const STORAGE_KEY = 'registeredUsers';
type RegUser = { username: string; password: string };
function getRegistered(): RegUser[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}
function saveRegistered(list: RegUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegUser, thunkAPI) => {
    try {
      const regs = getRegistered();
      if (regs.find(u => u.username === userData.username)) {
        return thunkAPI.rejectWithValue({ message: 'Username already exists' });
      }
      regs.push(userData);
      saveRegistered(regs);
      return { username: userData.username };
    } catch (err) {
      return thunkAPI.rejectWithValue({ message: 'Registration failed' });
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData: RegUser, thunkAPI) => {
    const { username, password } = loginData;
    const regs = getRegistered();
    if (regs.find(u => u.username === username && u.password === password)) {
      const token = 'mock-token-' + Date.now();
      localStorage.setItem('token', token);
      return { user: { username }, token };
    }
    try {
      const res = await axios.post(
        'https://dummyjson.com/auth/login',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem('token', res.data.token);
      return { user: { username }, token: res.data.token };
    } catch (err: any) {
      return thunkAPI.rejectWithValue({ message: 'Invalid credentials' });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = '';
      localStorage.removeItem('token');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
