import { createSlice } from '@reduxjs/toolkit';
import { PortfoliosFiltersState, filtersInitialState } from './portfolios-filters.state';
import { PortfoliosMenuItems } from '@/constants/portfolios.constants';

export const filtersSlice = createSlice({
  name: 'filters',
  initialState: filtersInitialState,
  reducers: {
    setPortfolioFilter: (
      state: PortfoliosFiltersState,
      action: {
        payload: {
          industry?: PortfoliosMenuItems[];
          keyword?: string;
          status?: number[];
        };
      },
    ) => {
      state.offset = 0;
      state.industry = action.payload.industry;
      state.keyword = action.payload.keyword;
      state.status = action.payload.status;
    },
    setPortfolioFilterOffset: (state: PortfoliosFiltersState, action: { payload: number }) => {
      state.offset = action.payload;
    },
    setPortfolioFilterLimit: (state: PortfoliosFiltersState, action: { payload: number }) => {
      if (state.limit !== action.payload) {
        state.offset = 0;
        state.limit = action.payload;
      }
    },
    setPortfolioFilterSort: (
      state: PortfoliosFiltersState,
      action: { payload: { order: string; direction: string } },
    ) => {
      state.order = action.payload.order;
      state.direction = action.payload.direction;
    },
  },
});

export default filtersSlice.reducer;
