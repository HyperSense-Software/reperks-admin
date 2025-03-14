import { RootState } from '@/store';

export const portfolioStateSelector = (state: RootState) => state.portfolio.portfolio;
export const portfolioLoadingSelector = (state: RootState) => state.portfolio.loading;
export const portfolioErrorSelector = (state: RootState) => state.portfolio.error;
