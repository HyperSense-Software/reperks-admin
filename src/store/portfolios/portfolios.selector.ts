import { RootState } from '@/store';

export const portfoliosSelector = (state: RootState) => state.portfolios.portfolios;
export const portfoliosLoadingSelector = (state: RootState) => state.portfolios.loading;
export const portfoliosErrorSelector = (state: RootState) => state.portfolios.error;
