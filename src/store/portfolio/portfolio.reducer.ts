import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { portfolioInitialState, PortfolioState } from './portfolio.state';
import { Portfolio } from '@/interfaces/Portfolio';
import {
  adminCreatePortfolio,
  adminDeletePortfolioById,
  adminUpdatePortfolioById,
  getPortfolio,
} from '@/store/portfolio/portfolio.thunk';

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: portfolioInitialState,
  reducers: {
    setPortfolioState: (state: PortfolioState, action: PayloadAction<PortfolioState>) => {
      state.portfolio = action.payload.portfolio;
      state.loading = action.payload.loading;
      state.error = action.payload.error;
    },
    setPortfolio: (state: PortfolioState, action: PayloadAction<Partial<Portfolio>>) => {
      state.portfolio = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getPortfolio.fulfilled,
        (state: PortfolioState, action: PayloadAction<Portfolio | unknown>) => {
          state.portfolio = action.payload as Portfolio;
        },
      )
      .addCase(getPortfolio.pending, (state: PortfolioState) => {
        state.loading = true;
      })
      .addCase(getPortfolio.rejected, (state: PortfolioState, action: PayloadAction<unknown>) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(
        adminCreatePortfolio.fulfilled,
        (state: PortfolioState, action: PayloadAction<Portfolio | unknown>) => {
          state.portfolio = action.payload as Portfolio;
        },
      )
      .addCase(adminCreatePortfolio.pending, (state: PortfolioState) => {
        state.loading = true;
      })
      .addCase(
        adminCreatePortfolio.rejected,
        (state: PortfolioState, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
        },
      )

      .addCase(
        adminUpdatePortfolioById.fulfilled,
        (state: PortfolioState, action: PayloadAction<Portfolio | unknown>) => {
          state.portfolio = action.payload as Portfolio;
        },
      )
      .addCase(adminUpdatePortfolioById.pending, (state: PortfolioState) => {
        state.loading = true;
      })
      .addCase(
        adminUpdatePortfolioById.rejected,
        (state: PortfolioState, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
        },
      )

      .addCase(adminDeletePortfolioById.fulfilled, (state: PortfolioState) => {
        state.portfolio = {};
      })
      .addCase(adminDeletePortfolioById.pending, (state: PortfolioState) => {
        state.loading = true;
      })
      .addCase(
        adminDeletePortfolioById.rejected,
        (state: PortfolioState, action: PayloadAction<unknown>) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  }, // Add extra reducers here for Async Await
});

export default portfolioSlice.reducer;
