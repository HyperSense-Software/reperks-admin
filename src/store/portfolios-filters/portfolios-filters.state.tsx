import { PortfoliosMenuItems } from '@/constants/portfolios.constants';

export interface PortfoliosFiltersState {
  industry?: PortfoliosMenuItems[];
  keyword?: string;
  status?: number[];
  order?: string;
  direction?: string;
  offset: number;
  limit: number;
}

export const filtersInitialState: PortfoliosFiltersState = {
  offset: 0,
  limit: 10,
  keyword: '',
};
