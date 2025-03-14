import { createSlice } from '@reduxjs/toolkit';
import { appInitialState } from '@/store/app/app.state';

export const appSlice = createSlice({
  name: 'app',
  initialState: appInitialState,
  reducers: {
    TOGGLE_LOADER: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export default appSlice.reducer;
