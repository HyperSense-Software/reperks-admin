export interface PortfoliosCounterState {
  portfoliosCounter: number;
  loading: boolean;
  error: unknown;
}

export const portfoliosCounterInitialState: PortfoliosCounterState = {
  portfoliosCounter: 0,
  loading: true,
  error: null,
};
