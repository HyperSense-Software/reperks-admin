import { AxiosResponse } from 'axios';
import { Portfolio } from '@/interfaces/Portfolio';
import { Response } from '@/interfaces/APIResponse';
import axiosInstance from '@/instance/axiosInstance';
import { PortfoliosFiltersState } from '@/store/portfolios-filters/portfolios-filters.state';

export const getPortfoliosFromAPI = async (
  filters?: PortfoliosFiltersState,
): Promise<Portfolio[] | []> => {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('Missing API_BASE_URL');
  }
  const params = filters ? searchFilters(filters) : null;
  const baseAPIPath = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiPath = baseAPIPath + `/admin/portfolios/findPortfolios`;
  try {
    const response: AxiosResponse<Response<Portfolio[]>> = await axiosInstance.get(
      apiPath,
      filters ? { params: params } : {},
    );

    if (response.data.error_code.code === 0 && response.data.error_code.message === 'Success') {
      return response.data.response;
    }

    return [];
  } catch (err: unknown) {
    console.log('Error - getPortfoliosFromAPI: ', err);
    return [];
  }
};

export const getPortfoliosCounterFromAPI = async (
  filter?: PortfoliosFiltersState,
): Promise<number> => {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new Error('Missing API_BASE_URL');
  }
  const params = filter ? searchFilters(filter) : null;
  const baseAPIPath = process.env.NEXT_PUBLIC_API_BASE_URL;
  const apiPath = baseAPIPath + `/admin/portfolios/findPortfoliosCounter`;
  try {
    const response: AxiosResponse<Response<number>> = await axiosInstance.get(
      apiPath,
      filter ? { params: params } : {},
    );

    if (response.data.error_code.code === 0 && response.data.error_code.message === 'Success') {
      return response.data.response;
    }

    return 0;
  } catch (err: unknown) {
    console.log('Error - getPortfoliosCounterFromAPI: ', err);
    return 0;
  }
};

export function searchFilters(options: PortfoliosFiltersState, counter: boolean = false) {
  const params = new URLSearchParams();
  const keys = new Set<string>();

  if (options) {
    if (options.keyword && !keys.has('keyword')) {
      params.append('keyword', options.keyword);
    }
    if (options.industry && options.industry.length > 0) {
      options.industry.forEach((industryItem) => {
        params.append('industry', industryItem);
      });
    }
    if (options.status && options.status.length > 0) {
      options.status.forEach((statusItem) => {
        params.append('status', statusItem.toString());
      });
    }
    if (!counter) {
      if (options.direction) {
        params.append('direction', options.direction);
      }
      if (options.order) {
        params.append('order', options.order);
      }

      if (options.limit) {
        params.append('limit', options.limit.toString());
      }
      if (options.offset) {
        params.append('offset', options.offset.toString());
      }
    }
  }
  return params;
}
