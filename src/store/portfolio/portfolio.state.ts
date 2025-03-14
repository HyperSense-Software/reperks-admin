import { Portfolio } from '@/interfaces/Portfolio';

export interface PortfolioState {
  portfolio: Partial<Portfolio>;
  loading: boolean;
  error: unknown;
}

export const portfolioInitialState: PortfolioState = {
  portfolio: {},
  loading: false,
  error: {},
};
