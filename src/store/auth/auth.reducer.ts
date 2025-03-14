import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authInitialState } from '@/store/auth/auth.state';
import { WritableDraft } from 'immer/src/types/types-external';
import { AuthState } from '@/models';

export const authSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    logIn: (state, action: PayloadAction<WritableDraft<AuthState>>) => {
      state.value = action.payload;
    },
    logout: (state) => {
      state.value = authInitialState.value;
    },
  },
});

export default authSlice.reducer;
