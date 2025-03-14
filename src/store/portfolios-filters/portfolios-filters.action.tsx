import { filtersSlice } from './portfolios-filters.reduce';

export const {
  setPortfolioFilter,
  setPortfolioFilterOffset,
  setPortfolioFilterLimit,
  setPortfolioFilterSort,
} = filtersSlice.actions;
