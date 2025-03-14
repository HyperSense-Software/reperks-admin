import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { portfoliosInitialState, PortfoliosState } from './portfolios.state';
import { Portfolio } from '@/interfaces/Portfolio';
import { getPortfolios } from '@/store/portfolios/portfolios.thunk';

export const portfoliosSlice = createSlice({
  name: 'portfolios',
  initialState: portfoliosInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getPortfolios.fulfilled,
        (state: PortfoliosState, action: PayloadAction<Portfolio[]>) => {
          state.portfolios = action.payload;
        },
      )
      .addCase(getPortfolios.pending, (state: PortfoliosState) => {
        state.loading = true;
      })
      .addCase(getPortfolios.rejected, (state: PortfoliosState, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.portfolios = [];
        state.error = action.payload;
      });
  }, // Add extra reducers here for Async Await
});

export default portfoliosSlice.reducer;
