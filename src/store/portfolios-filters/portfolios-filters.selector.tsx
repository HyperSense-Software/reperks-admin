import { RootState } from '..';

export const portfolioFilterSelector = (state: RootState) => state.filters;
export const portfolioFilterLimitSelector = (state: RootState) => state.filters.limit;
export const portfolioFilterOffsetSelector = (state: RootState) => state.filters.offset;
