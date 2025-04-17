import { toast } from 'sonner';
import { Offer } from '@/types/offers';

export interface Asset {
  id: number;
  assetId: string;
  address: string;
  unitId: string;
  unitDescription: string;
  apartmentNo: string;
  postalCode: string;
  tenantName: string;
  tenantEmail: string;
  tenantID: number;
  createdAt: number;
  updatedAt: number;
}

export interface AssetFilters {
  keyword?: string;
}

export interface PaginationParams {
  offset: number;
  limit: number;
}

export interface SortParams {
  field: keyof Asset | keyof Offer;
  direction: 'asc' | 'desc';
}

export interface AssetListParams extends PaginationParams {
  filters?: AssetFilters;
  sort?: SortParams;
}

export interface ResponseWrapper<T> {
  error_code: { code: number; message: string };
  response: T;
}

export const toastError = (error: any) => {
  if (error.message) {
    toast.error(error.message);
  } else {
    toast.error('Something went wrong');
  }
};
