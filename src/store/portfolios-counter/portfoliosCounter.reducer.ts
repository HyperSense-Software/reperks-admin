import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  portfoliosCounterInitialState,
  PortfoliosCounterState,
} from '@/store/portfolios-counter/portfoliosCounter.state';

import { getPortfoliosCounter } from '@/store/portfolios-counter/portfoliosCounter.thunk';

export const portfoliosCounterSlice = createSlice({
  name: 'portfolios',
  initialState: portfoliosCounterInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        getPortfoliosCounter.fulfilled,
        (state: PortfoliosCounterState, action: PayloadAction<number>) => {
          state.portfoliosCounter = action.payload;
          state.loading = false;
          console.log('Portfolios Counter fulfilled:', state.loading);
        },
      )
      .addCase(getPortfoliosCounter.pending, (state: PortfoliosCounterState) => {
        state.loading = true;
        console.log('Portfolios Counter pending!!!!:', state.loading);
      })
      .addCase(
        getPortfoliosCounter.rejected,
        (state: PortfoliosCounterState, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
          console.log('Portfolios Counter rejected:', state.loading);
        },
      );
  }, // Add extra reducers here for Async Await
});

export default portfoliosCounterSlice.reducer;
