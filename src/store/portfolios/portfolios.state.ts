import { Portfolio } from '@/interfaces/Portfolio';

export interface PortfoliosState {
  portfolios: Portfolio[];
  loading: boolean;
  error: unknown;
}

export const portfoliosInitialState: PortfoliosState = {
  portfolios: [],
  loading: false,
  error: {},
};
