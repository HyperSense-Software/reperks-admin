import { RootState } from '@/store';

export const portfoliosCounterSelector = (state: RootState) =>
  state.portfoliosCounter.portfoliosCounter;

export const portfoliosCounterLoadingSelector = (state: RootState) => {
  return state.portfoliosCounter.loading;
};
